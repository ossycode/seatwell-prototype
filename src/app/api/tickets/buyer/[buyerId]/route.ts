import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ buyerId: string }> }
) {
  const supabase = await createClient();
  const { buyerId } = await params;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("transactions")
    .select(
      `
      *,
      ticket:ticket_id (
        id,
        seat_info,
        price,
        status,
        game:game_id (
          id,
          date,
          venue,
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url)
        )
      )
    `,
      { count: "exact" }
    )
    .eq("buyer_id", buyerId)
    .order("purchased_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, page, limit });
}
