import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/jwt";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/verify-otp",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/health",
];

const ROLE_ROUTES: Record<string, string[]> = {
  DEVELOPER: ["/developer", "/admin", "/dashboard", "/api/developer", "/api/admin"],
  ADMIN: ["/admin", "/dashboard", "/api/admin"],
  ALUMNI: ["/dashboard", "/api/alumni"],
  STUDENT: ["/dashboard"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Allow static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.match(/\.(ico|png|jpg|svg|webp|json|txt)$/)
  ) {
    return NextResponse.next();
  }

  // Extract token from cookie or Authorization header
  const token =
    request.cookies.get("access_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = verifyAccessToken(token) as any;

    // Developer-only routes
    if (pathname.startsWith("/developer") || pathname.startsWith("/api/developer")) {
      if (payload.role !== "DEVELOPER") {
        if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Admin-only routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (!["ADMIN", "DEVELOPER"].includes(payload.role)) {
        if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Inject user context headers
    const res = NextResponse.next();
    res.headers.set("x-user-id", payload.userId);
    res.headers.set("x-user-role", payload.role);
    return res;
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
