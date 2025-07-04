import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import supabaseAdmin from "@/utils/supabase/admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();
  const updates = (await request.json()) as { email?: string; role?: string };

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// export async function DELETE(
//   _request: NextRequest,
//   { params }: { params: Promise<{ userId: string }> }
// ) {
//   const { userId } = await params;

//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from("users")
//     .delete()
//     .eq("id", userId)
//     .select("*")
//     .single();

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   return NextResponse.json(data);
// }

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: userRecord, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (fetchError)
    return NextResponse.json({ error: fetchError.message }, { status: 400 });

  const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
    userRecord.id
  );

  if (authDeleteError)
    return NextResponse.json(
      { error: authDeleteError.message },
      { status: 400 }
    );

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}
