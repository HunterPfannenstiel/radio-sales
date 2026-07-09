import { AsyncLocalStorage } from "node:async_hooks";
import { logger } from "@/lib/logger";

export const REQUEST_ID_HEADER = "x-request-id";

type RequestContext = {
  requestId: string;
};

const requestContext = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(context: RequestContext, fn: () => T): T {
  return requestContext.run(context, fn);
}

export function getRequestLogger() {
  const context = requestContext.getStore();
  return context ? logger.child({ requestId: context.requestId }) : logger;
}

type RouteHandler<Context = unknown> = (
  request: Request,
  context: Context,
) => Response | Promise<Response>;

export function withRequestLogging<Context = unknown>(
  handler: RouteHandler<Context>,
): RouteHandler<Context> {
  return (request, context) => {
    const requestId = request.headers.get(REQUEST_ID_HEADER) ?? "unknown";
    return runWithRequestContext({ requestId }, async () => {
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
        return response;
      } catch (err) {
        logger.error({ route, err, durationMs: Date.now() - start }, "request failed");
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
      }
    });
  };
}
