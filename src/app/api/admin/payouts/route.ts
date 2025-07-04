import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const sellerId = searchParams.get("seller_id");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("payouts")
    .select(
      `
      *,
      ticket: tickets (
        id,
        verification_code,
        game: games (
          home_team,
          away_team,
          date
        )
      ),
      seller: users!payouts_seller_id_fkey (
        id,
        email
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Optional filtering
  if (sellerId) {
    query = query.eq("seller_id", sellerId);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    // This targets ticket.verification_code OR seller.email
    query = query.or(
      `amount.ilike.%${search}%,ticket.verification_code.ilike.%${search}%,seller.email.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, page, limit });
}
