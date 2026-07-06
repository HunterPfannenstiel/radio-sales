import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "repId";

export async function getSessionRepId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function setSessionRepId(repId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, repId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function clearSessionRepId(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}
