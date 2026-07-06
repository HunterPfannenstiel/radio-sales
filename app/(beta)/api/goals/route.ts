// BETA: rep self-service goal setting (see app/(beta) for the beta-route convention)
import { type NextRequest } from "next/server";
import { z } from "zod";
import { Mutations } from "@/server/mutations";
import { Queries } from "@/server/queries";
import { Roles } from "@/server/roles/Roles";
import { getSessionRepId } from "@/lib/session";

const setGoalBodySchema = z.object({
  monthlyGoalAmount: z.number().positive(),
  weeklyCallTarget: z.number().int().nonnegative(),
  weeklyAskTarget: z.number().int().nonnegative(),
});

export async function GET() {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  if (!Roles.canViewGoals(repId)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  const result = await Queries.repGoals.execute(repId);
  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  if (!Roles.canSetGoal(repId)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const parsed = setGoalBodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request body", details: parsed.error.flatten() }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  await Mutations.setRepGoal.execute({ repId, ...parsed.data });
  return new Response(null, { status: 204 });
}
