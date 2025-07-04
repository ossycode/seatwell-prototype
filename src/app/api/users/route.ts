import supabaseAdmin from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   const supabase = await createClient();
//   const { data, error } = await supabase.from("users").select("*");

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json(data);
// }
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const userRole = searchParams.get("role");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("users")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  // Filtering by role
  if (userRole) {
    query = query.eq("role", userRole);
  }

  if (search) {
    query = query.ilike("email", `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { email, role, password } = (await request.json()) as {
    email: string;
    role: string;
    password: string;
  };

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "email, password and role required" },
      { status: 400 }
    );
  }

  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

  if (authError) {
    return NextResponse.json(
      { error: `Auth error: ${authError.message}` },
      { status: 400 }
    );
  }

  const { data: userData, error: insertError } = await supabase
    .from("users")
    .insert([{ id: authUser.user.id, email, role }])
    .select("*")
    .single();

  if (insertError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return NextResponse.json(
      { error: `Insert error: ${insertError.message}` },
      { status: 400 }
    );
  }

  return NextResponse.json(userData, { status: 201 });
}
