import { Queries } from "@/server/queries";

export async function GET() {
  const repId = process.env.CURRENT_REP_ID;
  if (!repId) {
    return new Response(
      JSON.stringify({ error: "CURRENT_REP_ID is not configured" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = await Queries.callActivity.execute(repId);
  return Response.json(result);
}
