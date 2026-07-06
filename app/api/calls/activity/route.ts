import { type NextRequest } from "next/server";
import { Queries } from "@/server/queries";
import { getRequestTimezone } from "@/lib/timezone";
import { getSessionRepId } from "@/lib/session";

export async function GET(request: NextRequest) {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const timezone = getRequestTimezone(request);
  const result = await Queries.callActivity.execute({ repId, timezone });
  return Response.json(result);
}
