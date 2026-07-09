import pino from "pino";
import { Writable } from "node:stream";

const validLevels = Object.keys(pino.levels.values) as pino.Level[];

function resolveLevel(): pino.Level {
  const requested = process.env.LOG_LEVEL;
  if (requested && validLevels.includes(requested as pino.Level)) {
    return requested as pino.Level;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

const level = resolveLevel();

// Fallback bucket for shipments emitted outside a request (e.g. background/cron
// work). Request-scoped shipments live in the bucket request-context.ts provides
// below, so a slow/stuck request never makes an unrelated request's flush hang.
const pendingShipments = new Set<Promise<void>>();

let getActiveShipmentBucket: (() => Set<Promise<void>> | undefined) | undefined;

// Lets request-context.ts (which imports this module) hand back a per-request
// bucket without logger.ts importing request-context.ts and creating a cycle.
export function registerShipmentBucketProvider(provider: () => Set<Promise<void>> | undefined) {
  getActiveShipmentBucket = provider;
}

// Bounds how long a single shipment can be pending. Without this, a stalled
// Better Stack request never resolves, so it never leaves `pendingShipments` —
// and every subsequent `flushLogShipping()` call (from any request sharing this
// instance) would await it and hang right along with it.
const SHIPMENT_TIMEOUT_MS = Number(process.env.BETTER_STACK_TIMEOUT_MS ?? 5000);

function createBetterStackStream(token: string, endpoint: string) {
  return new Writable({
    write(chunk, _encoding, callback) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), SHIPMENT_TIMEOUT_MS);
      const bucket = getActiveShipmentBucket?.() ?? pendingShipments;

      // One POST per log line: simple and safe, but not batched, so it won't be
      // efficient at real traffic volume.
      const shipment = fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: chunk,
        signal: controller.signal,
      })
        .then(() => undefined)
        // Shipping a log must never be able to crash or block the app that emitted
        // it, so failures (bad token, network blip, rate limit, or the timeout
        // above) are swallowed here. There's no signal of a broken shipment other
        // than events going missing in Better Stack itself.
        .catch(() => undefined)
        .finally(() => clearTimeout(timeout));

      bucket.add(shipment);
      shipment.finally(() => {
        bucket.delete(shipment);
        callback();
      });
    },
  });
}

// A Vercel function instance can freeze the moment a response is sent, so a shipment
// still in flight at that point could be dropped. Call this inside next/server's
// `after()` to keep the instance alive until every currently pending shipment settles.
// Pass the request's own bucket (see request-context.ts) so this only ever awaits
// shipments this request produced, not every shipment currently in flight on the
// instance.
export function flushLogShipping(bucket: Iterable<Promise<void>> = pendingShipments): Promise<void> {
  return Promise.all(bucket).then(() => undefined);
}

const streams: pino.StreamEntry[] = [{ stream: pino.destination(1), level }];

// Only ship in built code (next build/start, and therefore every Vercel deployment,
// preview included) — never in `next dev`, so local iteration stays console-only.
if (process.env.BETTER_STACK_SOURCE_TOKEN && process.env.NODE_ENV === "production") {
  streams.push({
    stream: createBetterStackStream(
      process.env.BETTER_STACK_SOURCE_TOKEN,
      process.env.BETTER_STACK_ENDPOINT ?? "https://in.logs.betterstack.com",
    ),
    level,
  });
}

export const logger = pino(
  {
    level,
    base: {
      service: "radio-sales",
      env: process.env.NODE_ENV,
    },
    hooks: {
      // Applies to every logger, including .child() instances (getRequestLogger's
      // requestId-bound loggers), so this is a single, permanent guarantee that a
      // logging call itself can never break the code path it's observing.
      logMethod(inputArgs, method) {
        try {
          method.apply(this, inputArgs);
        } catch (err) {
          console.error("logging failed:", err instanceof Error ? err.message : err);
        }
      },
    },
  },
  pino.multistream(streams),
);
