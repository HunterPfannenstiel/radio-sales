import { type NextRequest } from "next/server";
import { z } from "zod";
import { Mutations } from "@/server/mutations";
import { Roles } from "@/server/roles/Roles";
import { CALL_OUTCOMES, CALL_CONFIDENCES, WHAT_NEXT_OPTIONS, TERM_UNITS } from "@/lib/blob/schema";
import { getSessionRepId } from "@/lib/session";
import { withRequestLogging } from "@/lib/request-context";

const logCallBodySchema = z
  .object({
    businessName: z.string().min(1),
    businessId: z.string().optional(),
    stage: z.string().min(1),
    whatNext: z.enum(WHAT_NEXT_OPTIONS),
    budget: z.number().optional(),
    termValue: z.number().optional(),
    termUnit: z.enum(TERM_UNITS).optional(),
    confidence: z.enum(CALL_CONFIDENCES).optional(),
    outcome: z.enum(CALL_OUTCOMES).optional(),
  })
  .superRefine((data, ctx) => {
    const hasBudget = data.budget !== undefined && data.budget > 0;
    const hasTerm = data.termValue !== undefined && data.termValue > 0;
    if (hasBudget && !hasTerm) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "termValue is required when budget is provided", path: ["termValue"] });
    }
    if (hasTerm && !hasBudget) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budget is required when termValue is provided", path: ["budget"] });
    }
  });

export const POST = withRequestLogging(async (request: NextRequest) => {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
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
});
