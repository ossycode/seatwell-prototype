import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Auth validation error:", userError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      const { id, email } = user;
      const { data: existing, error: selectErr } = await supabase
        .from("users")
        .select("role")
        .eq("id", id)
        .single();

      if (selectErr && selectErr.code !== "PGRST116") {
        // some unexpected error
        console.error("Error checking existing user:", selectErr);
      }
      let role: string;
      if (!existing) {
        const { data: inserted, error: insertErr } = await supabase
          .from("users")
          .insert([{ id, email, role: "buyer" }])
          .select("role")
          .single();
        if (insertErr) {
          console.error("Error inserting user:", insertErr);
        }
        role = inserted?.role ?? "buyer";
      } else {
        await supabase.from("users").update({ email }).eq("id", id);
        role = existing.role;
      }

      const destination = role === "admin" ? "/admin" : next;

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${destination}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${destination}`);
      } else {
        return NextResponse.redirect(`${origin}${destination}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
