import { type NextRequest } from "next/server";
import { Queries } from "@/server/queries";
import { Roles } from "@/server/roles/Roles";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const repId = process.env.CURRENT_REP_ID;
  if (!repId) {
    return new Response(
      JSON.stringify({ error: "CURRENT_REP_ID is not configured" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!Roles.canViewDashboard(repId)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id: businessId } = await params;

  try {
    const result = await Queries.businessInteractionHistory.execute(repId, businessId);
    return Response.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Query failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
