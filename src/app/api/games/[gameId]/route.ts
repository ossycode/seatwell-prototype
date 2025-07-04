import { Game } from "@/types/games";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.details ? 400 : 404 }
    );
  }
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const supabase = await createClient();

  const body = (await request.json()) as Game;

  const { data, error } = await supabase
    .from("games")
    .update(body)
    .eq("id", gameId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .delete()
    .eq("id", gameId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}
