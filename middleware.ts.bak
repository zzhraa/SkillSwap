import { NextRequest, NextResponse } from "next/server";
import {
  canAccess,
  getDefaultRouteForRole,
  getSession,
  matchRoleForPath,
} from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requiredRole = matchRoleForPath(pathname);

  // Not a protected route — let it through untouched.
  if (!requiredRole) {
    return NextResponse.next();
  }

  const session = getSession();

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccess(session, pathname)) {
    return NextResponse.redirect(
      new URL(getDefaultRouteForRole(session.role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/explore/:path*",
    "/requests/:path*",
    "/chat/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};