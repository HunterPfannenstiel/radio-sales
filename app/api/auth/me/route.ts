import { getSessionRepId } from "@/lib/session";
import { Queries } from "@/server/queries";

export async function GET() {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const rep = await Queries.currentRep.execute(repId);
  if (!rep) {
    return Response.json({ id: repId, name: "Unknown User" });
  }
  return Response.json(rep);
}
