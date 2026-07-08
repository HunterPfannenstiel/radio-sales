import { Queries } from "@/server/queries";

export async function GET() {
  const result = await Queries.healthCheck.execute();
  return Response.json(result, { status: result.status === "ok" ? 200 : 503 });
}
