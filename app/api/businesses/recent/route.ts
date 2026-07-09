import { Queries } from "@/server/queries";
import { getSessionRepId } from "@/lib/session";
import { withRequestLogging } from "@/lib/request-context";

export const GET = withRequestLogging(async () => {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const results = await Queries.recentBusinesses.execute(repId);
  return Response.json(results);
});
