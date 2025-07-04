import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Game } from "@/types/games";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const futureOnly = searchParams.get("futureOnly") === "true";
  const search = searchParams.get("search")?.trim();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("games")
    .select(
      `
  id,
  date,
  venue,
  home_team_id,
  away_team_id,
  home_team:teams!games_home_team_id_fkey(id, name, logo_url, home_color, away_color),
  away_team:teams!games_away_team_id_fkey(id, name, logo_url, home_color, away_color)
`,
      { count: "exact" }
    )
    .order("date", { ascending: true })
    .range(from, to);

  if (futureOnly) {
    query = query.gt("date", new Date().toISOString());
  }

  if (search) {
    const wildcard = `%${search}%`;
    query = query.or(
      `home_team.ilike.${wildcard},away_team.ilike.${wildcard},venue.ilike.${wildcard}`
    );
  }
  const { data: games, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Step 2: Fetch ticket counts per game
  const gameIds = games.map((g) => g.id);

  const { data: allTickets, error: ticketError } = await supabase
    .from("tickets")
    .select("game_id")
    .in("game_id", gameIds)
    .eq("status", "approved");

  if (ticketError) {
    return NextResponse.json({ error: ticketError.message }, { status: 500 });
  }

  const ticketMap: Record<string, number> = {};

  allTickets?.forEach((ticket) => {
    const id = ticket.game_id;
    ticketMap[id] = (ticketMap[id] || 0) + 1;
  });

  const data = games.map((game) => ({
    ...game,
    available_ticket_count: ticketMap[game.id] || 0,
  }));

  return NextResponse.json({ data, count });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { home_team_id, away_team_id, date, venue } =
    (await request.json()) as Game;

  if (!home_team_id || !away_team_id || !date || !venue) {
    return NextResponse.json(
      { error: "home_team, away_team, date, and venue are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("games")
    .insert([{ home_team_id, away_team_id, date, venue }])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
