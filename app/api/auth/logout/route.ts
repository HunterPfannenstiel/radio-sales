import { clearSessionRepId } from "@/lib/session";
import { withRequestLogging } from "@/lib/request-context";

export const POST = withRequestLogging(async () => {
  await clearSessionRepId();
  return new Response(null, { status: 204 });
});
