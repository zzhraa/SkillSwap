import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware ini menggantikan middleware.ts.bak yang lama.
 * Sekarang pakai Supabase session nyata (cookie-based), bukan mock.
 *
 * Yang dilakukan:
 * 1. Refresh session token Supabase di setiap request (wajib untuk SSR)
 * 2. Redirect ke /login kalau akses protected route tanpa login
 * 3. Redirect ke dashboard yang sesuai kalau sudah login tapi buka /login atau /register
 * 4. Cek role: hanya admin yang boleh akses /admin
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // PENTING: getUser() wajib dipanggil di middleware untuk refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Route yang butuh login ──────────────────────────────────────────────
  const protectedRoutes = [
    "/dashboard",
    "/explore",
    "/requests",
    "/chat",
    "/profile",
    "/settings",
    "/admin",
  ];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Belum login → redirect ke /login
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi buka /login atau /register → redirect ke dashboard
  if (user && (pathname === "/login" || pathname === "/register")) {
    // Ambil role dari profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const destination = profile?.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Cek akses /admin — hanya untuk role admin
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware di semua route KECUALI:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico
     * - api routes (handled sendiri)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
