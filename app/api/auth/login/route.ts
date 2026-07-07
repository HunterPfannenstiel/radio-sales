import { type NextRequest } from "next/server";
import { z } from "zod";
import { Mutations } from "@/server/mutations";
import { setSessionRepId } from "@/lib/session";

const loginBodySchema = z.object({
  name: z.string().trim().min(1),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const parsed = loginBodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request body", details: parsed.error.flatten() }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  let result;
  try {
    result = await Mutations.login.execute(parsed.data);
  } catch {
    return new Response(JSON.stringify({ error: "Login failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  if (!result.ok) {
    return new Response(JSON.stringify({ error: "Incorrect PIN" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  await setSessionRepId(result.repId);
  return Response.json({ repId: result.repId, name: result.name, isNewRep: result.isNewRep });
}
