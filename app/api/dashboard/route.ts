import { type NextRequest } from "next/server";
import { z } from "zod";
import { Queries } from "@/server/queries";
import { Roles } from "@/server/roles/Roles";
import { getRequestTimezone } from "@/lib/timezone";
import { getSessionRepId } from "@/lib/session";
import { withRequestLogging } from "@/lib/request-context";

const querySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "month must be in YYYY-MM format"),
  weekYear: z.coerce.number().int().positive(),
  weekNumber: z.coerce.number().int().min(1).max(53),
});

export const GET = withRequestLogging(async (request: NextRequest) => {
  const repId = await getSessionRepId();
  if (!repId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  if (!Roles.canViewDashboard(repId)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const searchParams = request.nextUrl.searchParams;
  const rawParams = {
    month: searchParams.get("month"),
    weekYear: searchParams.get("weekYear"),
    weekNumber: searchParams.get("weekNumber"),
  };

  const parsed = querySchema.safeParse(rawParams);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "Invalid query parameters",
        details: parsed.error.flatten(),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { month: monthParam, weekYear, weekNumber } = parsed.data;

  // Parse YYYY-MM into year and 0-based month
  const [yearStr, monthStr] = monthParam.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // convert to 0-based

  const timezone = getRequestTimezone(request);
  const result = await Queries.dashboard.execute({
    repId,
    year,
    month,
    weekYear,
    weekNumber,
    timezone,
    now: new Date(),
  });

  return Response.json(result);
});
