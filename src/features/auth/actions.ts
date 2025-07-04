"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { LoginFormType } from "./authSchema";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/account");
}

export const loginWithGoogle = async () => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    redirect("/error");
  } else if (data.url) {
    redirect(data.url);
  }
};

export async function logginAsSeller(formData: LoginFormType) {
  const supabase = await createClient();

  // 1) Attempt email/password sign-in
  const { data: session, error: signInErr } =
    await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
  if (signInErr) {
    // invalid creds → back to login with an error query
    console.error("Seller login error:", signInErr.message);
    redirect("/auth/seller-login?error=invalid-credentials");
  }

  // 2) Upsert into your app’s users table as a seller
  const userId = session!.user.id;

  // 2) Check if they already exist in your public.users table
  const { data: existing, error: selectErr } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (selectErr && selectErr.code !== "PGRST116") {
    console.error("Error checking user:", selectErr);
    // optionally handle a real error here
  }

  if (!existing) {
    // first-time seller → insert with role
    const { error: insertErr } = await supabase
      .from("users")
      .insert({ id: userId, email: formData.email, role: "seller" });
    if (insertErr) {
      console.error("Error inserting user:", insertErr);
      redirect("/auth/seller-login?error=auth-failed");
      // Redirect to an error page
    }
  } else {
    await supabase
      .from("users")
      .update({ email: formData.email })
      .eq("id", userId);
  }

  // 3) Redirect into the seller dashboard
  redirect("/seller");
}

export async function loginAsAdmin(formData: LoginFormType) {
  // const email = formData.get("email") as string;
  // const password = formData.get("password") as string;
  const supabase = await createClient();

  // 1) Sign in with email/password
  const { error: signErr } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });
  if (signErr) {
    // bad creds
    redirect("/auth/admin-login?error=invalid-credentials");
  }

  // 2) Grab the user object
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    await supabase.auth.signOut();
    redirect("/auth/admin-login?error=auth-failed");
  }

  // 3) Check “role” in your users table
  const { data: profile, error: profErr } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  // if not an admin, kick them out
  if (profErr || profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/auth/admin-login?error=not-authorized");
  }

  // 4) Everyone checks out → send them into the Admin area
  redirect("/admin");
}

export async function signUpBuyer({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  const { data: signUpResult, error: signUpError } = await supabase.auth.signUp(
    { email, password }
  );

  if (signUpError) {
    return { error: signUpError.message };
  }

  const user = signUpResult.user;
  if (!user) {
    return { error: "Sign up failed. Please try again." };
  }

  const { error: insertError } = await supabase.from("users").insert([
    {
      id: user.id,
      email,
      role: "buyer",
    },
  ]);

  if (insertError) {
    return { error: "Failed to assign buyer role." };
  }

  // Success
  return { success: true };
}

export async function loginAsBuyer({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  const { data: authResult, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    throw new Error("invalid-credentials");
  }

  const { user } = authResult;

  const { data: profile, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !profile) {
    await supabase.auth.signOut();
    throw new Error("auth-failed");
  }

  const role = profile.role;

  if (role === "seller") {
    await supabase.auth.signOut();
    throw new Error("not-a-buyer-seller");
  }

  if (role === "admin") {
    await supabase.auth.signOut();
    throw new Error("not-a-buyer-admin");
  }

  // Success — let client redirect
  return { success: true };
}
