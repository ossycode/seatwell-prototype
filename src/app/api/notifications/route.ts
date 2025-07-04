import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  // optional: filter by ?userId=...
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  let query = supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { user_id, ticket_id, type, message } = (await request.json()) as {
    user_id: string;
    ticket_id: string;
    type: string;
    message: string;
  };
  const { data, error } = await supabase
    .from("notifications")
    .insert([{ user_id, ticket_id, type, message }])
    .select("*")
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
