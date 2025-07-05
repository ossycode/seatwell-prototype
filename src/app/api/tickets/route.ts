import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateCode } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const url = new URL(request.url);

  const gameId = url.searchParams.get("gameId");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search")?.toLowerCase();
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("tickets")
    .select(
      `
      *,
      game:games(
        id,
        date,
        venue,
        home_team:teams!games_home_team_id_fkey(id, name, logo_url),
        away_team:teams!games_away_team_id_fkey(id, name, logo_url)
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  // Filtering by game
  if (gameId) {
    query = query.eq("game_id", gameId);
  }

  // Filtering by status
  if (status) {
    query = query.eq("status", status);
  }
  if (search) {
    query = query.ilike("seller_email", `%${search}%`);
  }
  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, page, limit });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { game_id, seller_id, price, seat_info } = (await request.json()) as {
    game_id: string;
    seller_id: string;
    price: number;
    seat_info?: string;
  };

  if (!game_id || !seller_id || typeof price !== "number") {
    return NextResponse.json(
      { error: "game_id, seller_id and price are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        game_id,
        seller_id,
        price,
        status: "pending",
        seat_info,
        verification_code: generateCode(),
      },
    ])
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
