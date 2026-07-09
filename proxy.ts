import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { REQUEST_ID_HEADER } from "@/lib/request-context";

export function proxy(request: NextRequest) {
  const requestId = request.headers.get(REQUEST_ID_HEADER) ?? randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);

  const { pathname } = request.nextUrl;
  if (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/health"
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  const repId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!repId) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
