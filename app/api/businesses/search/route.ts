import { type NextRequest } from "next/server";
import { Queries } from "@/server/queries";
import { getSessionRepId } from "@/lib/session";

export async function GET(request: NextRequest) {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";

  const results = await Queries.searchBusinesses.execute(repId, q);
  return Response.json(results);
}
