import { type NextRequest } from "next/server";
import { Queries } from "@/server/queries";

export async function GET(request: NextRequest) {
  const repId = process.env.CURRENT_REP_ID;
  if (!repId) {
    return new Response(
      JSON.stringify({ error: "CURRENT_REP_ID is not configured" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";

  const results = await Queries.searchBusinesses.execute(repId, q);
  return Response.json(results);
}
