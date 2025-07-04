import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build the base query
  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .order("purchased_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(
      `
      buyer_email.ilike.%${search}%,
      seller_email.ilike.%${search}%,
      ticket_seat_info.ilike.%${search}%,
      game_title.ilike.%${search}%,
      game_date.ilike.%${search}%
      `
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    page,
    limit,
    total: count,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
