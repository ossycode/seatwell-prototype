import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export default async function middleware(request: NextRequest) {
  const LOGIN_ROUTE = "/auth";
  const ADMIN_ROUTE = "/admin";
  const { pathname } = request.nextUrl;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logged In Users from the Login page
  if (user && pathname.startsWith(LOGIN_ROUTE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // or '/mydashboard'
    return NextResponse.redirect(url);
  }

  // Protect Admin routes
  if (pathname.startsWith(ADMIN_ROUTE)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_ROUTE;
      return NextResponse.redirect(url);
    }
    // fetch their role
    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || profile?.role !== "admin") {
      // not authorized → back to homepage
      const url = request.nextUrl.clone();
      url.pathname = "/auth/admin-login";
      return NextResponse.redirect(url);
    }
  }

  // 5) Protect /sell routes (only seller or admin)
  if (pathname.startsWith("/seller")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/seller-login";
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "seller" && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      // url.pathname = "/seller/no-ticket";
      url.pathname = "/auth/seller-login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 6) accessing buyer's route
  if (pathname.startsWith("/buyer")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/buyer-login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
