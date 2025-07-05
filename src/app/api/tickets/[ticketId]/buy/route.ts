import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const supabase = await createClient();
  const { buyerId } = (await request.json()) as { buyerId: string };

  // 1) Mark ticket sold
  const { data: ticket, error: ticketErr } = await supabase
    .from("tickets")
    .update({ status: "sold" })
    .eq("id", ticketId)
    .select(
      `*,
       game:games(id, home_team, away_team, date),
       seller:users(id, email)`
    )
    .single();
  if (ticketErr || !ticket) {
    return NextResponse.json(
      { error: ticketErr?.message || "Ticket not found" },
      { status: 400 }
    );
  }

  // 1a) Fetch buyer data
  const { data: buyer, error: buyerErr } = await supabase
    .from("users")
    .select("id, email")
    .eq("id", buyerId)
    .single();
  if (buyerErr || !buyer) {
    return NextResponse.json(
      { error: buyerErr?.message || "Buyer not found" },
      { status: 400 }
    );
  }

  // 2) Record transaction
  const { error: txErr } = await supabase
    .from("transactions")
    .insert([
      {
        ticket_id: ticket.id,
        buyer_id: buyer.id,
        buyer_email: buyer.email,
        seller_email: ticket.seller?.email,
        ticket_seat_info: ticket.seat_info,
        ticket_price: ticket.price,
        game_date: ticket.game?.date,
        game_title: `${ticket.game?.home_team} vs ${ticket.game?.away_team}`,
        purchased_at: new Date().toISOString(),
      },
    ])
    .select("*")
    .single();
  if (txErr) {
    return NextResponse.json({ error: txErr.message }, { status: 400 });
  }

  // 3) Notify the seller automatically
  await supabase.from("notifications").insert([
    {
      user_id: ticket.seller_id,
      ticket_id: ticketId,
      type: "sold",
      message: `Your ticket ${ticketId} has been sold.`,
    },
  ]);

  // 4) Queue a payout for the seller
  await supabase.from("payouts").insert([
    {
      ticket_id: ticketId,
      seller_id: ticket.seller_id,
      amount: ticket.price,
      status: "pending",
      seller_email: ticket.seller.email,
    },
  ]);

  return NextResponse.json(ticket);
}
