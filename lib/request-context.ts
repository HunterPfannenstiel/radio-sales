import { AsyncLocalStorage } from "node:async_hooks";
import { after, type NextRequest } from "next/server";
import { logger, flushLogShipping, registerShipmentBucketProvider } from "@/lib/logger";

export const REQUEST_ID_HEADER = "x-request-id";

type RequestContext = {
  requestId: string;
  // Shipments this request's log lines produced. Scoped per request so this
  // request's flush never has to wait on some other concurrent request's
  // (possibly stuck) shipment — see logger.ts's fallback global bucket.
  pendingShipments: Set<Promise<void>>;
};

const requestContext = new AsyncLocalStorage<RequestContext>();

registerShipmentBucketProvider(() => requestContext.getStore()?.pendingShipments);

export function runWithRequestContext<T>(context: RequestContext, fn: () => T): T {
  return requestContext.run(context, fn);
}

export function getRequestLogger() {
  const context = requestContext.getStore();
  return context ? logger.child({ requestId: context.requestId }) : logger;
}

type RouteHandler<Context = unknown> = (
  request: NextRequest,
  context: Context,
) => Response | Promise<Response>;

// Scheduling the log-shipment flush must never be able to take down an otherwise
// successful (or already-handled) response — e.g. `after()` throws if called outside
// a real Next.js request context, which should never lose a response over.
function scheduleFlush() {
  const bucket = requestContext.getStore()?.pendingShipments;
  try {
    after(() => flushLogShipping(bucket));
  } catch {
    // Best-effort only; a failure here just means unshipped Better Stack lines may
    // be lost, not that the request itself should fail.
  }
}

export function withRequestLogging<Context = unknown>(
  handler: RouteHandler<Context>,
): RouteHandler<Context> {
  return (request, context) => {
    const requestId = request.headers.get(REQUEST_ID_HEADER) ?? "unknown";
    return runWithRequestContext({ requestId, pendingShipments: new Set() }, async () => {
      const logger = getRequestLogger();
      const route = new URL(request.url).pathname;
      const start = Date.now();
      logger.info({ route }, "request started");

      try {
        const response = await handler(request, context);
        logger.info(
          { route, status: response.status, durationMs: Date.now() - start },
          "request completed",
        );
        scheduleFlush();
        return response;
      } catch (err) {
        logger.error({ route, err, durationMs: Date.now() - start }, "request failed");
        scheduleFlush();
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
      }
    });
  };
}
