import { type NextRequest } from "next/server";
import { z } from "zod";
import { Mutations } from "@/server/mutations";
import { Roles } from "@/server/roles/Roles";

const logCallBodySchema = z.object({
  businessName: z.string().min(1),
  businessId: z.string().optional(),
  stage: z.string().min(1),
  whatNext: z.string().min(1),
  budget: z.number().optional(),
  termValue: z.number().optional(),
  termUnit: z.enum(["weeks", "months"]).optional(),
  confidence: z.string().optional(),
  outcome: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const repId = process.env.CURRENT_REP_ID;
  if (!repId) {
    return new Response(
      JSON.stringify({ error: "CURRENT_REP_ID is not configured" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!Roles.canLogCall(repId)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = logCallBodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request body", details: parsed.error.flatten() }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = await Mutations.logCall.execute({ repId, ...parsed.data });
  return Response.json(result, { status: 201 });
}
