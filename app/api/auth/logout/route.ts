import { clearSessionRepId } from "@/lib/session";

export async function POST() {
  await clearSessionRepId();
  return new Response(null, { status: 204 });
}
