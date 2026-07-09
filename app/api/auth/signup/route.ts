import { type NextRequest } from "next/server";
import { z } from "zod";
import { Mutations } from "@/server/mutations";
import { setSessionRepId } from "@/lib/session";
import { withRequestLogging } from "@/lib/request-context";

const signupBodySchema = z.object({
  name: z.string().trim().min(1),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
});

export const POST = withRequestLogging(async (request: NextRequest) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const parsed = signupBodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request body", details: parsed.error.flatten() }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  let result;
  try {
    result = await Mutations.signup.execute(parsed.data);
  } catch {
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  if (!result.ok) {
    return new Response(
      JSON.stringify({ error: "That username and PIN are already taken — try signing in." }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  await setSessionRepId(result.repId);
  return Response.json({ repId: result.repId, name: result.name });
});
