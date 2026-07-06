import { Queries } from "@/server/queries";
import { Roles } from "@/server/roles/Roles";
import { getSessionRepId } from "@/lib/session";

export async function GET() {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  if (!Roles.canViewDashboard(repId)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await Queries.whatsNext.execute(repId);
  return Response.json(result);
}
