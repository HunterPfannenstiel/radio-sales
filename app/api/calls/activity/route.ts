import { type NextRequest } from "next/server";
import { Queries } from "@/server/queries";
import { getRequestTimezone } from "@/lib/timezone";

export async function GET(request: NextRequest) {
  const repId = process.env.CURRENT_REP_ID;
  if (!repId) {
    return new Response(
      JSON.stringify({ error: "CURRENT_REP_ID is not configured" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const timezone = getRequestTimezone(request);
  const result = await Queries.callActivity.execute({ repId, timezone });
  return Response.json(result);
}
