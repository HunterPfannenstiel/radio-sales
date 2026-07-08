import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/health"
  ) {
    return NextResponse.next();
  }
  const repId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!repId) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
