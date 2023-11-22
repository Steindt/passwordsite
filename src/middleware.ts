import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

export async function middleware(request: NextRequest) {
  if (cookies().get("accessToken") === undefined && (request.nextUrl.pathname != "/auth" && request.nextUrl.pathname != "/auth/callback")) {
    console.log("redirecting");
    return NextResponse.redirect(new URL("/auth", request.nextUrl.protocol + request.headers.get("host")));
  }
}