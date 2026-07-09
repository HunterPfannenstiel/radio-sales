import { Queries } from "@/server/queries";
import { withRequestLogging } from "@/lib/request-context";

export const GET = withRequestLogging(async () => {
  const result = await Queries.healthCheck.execute();
  return Response.json(result, { status: result.status === "ok" ? 200 : 503 });
});
