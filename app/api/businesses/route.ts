import { Queries } from "@/server/queries";
import { getSessionRepId } from "@/lib/session";

export async function GET() {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const results = await Queries.searchBusinesses.execute(repId, "");
  return Response.json(results);
}
