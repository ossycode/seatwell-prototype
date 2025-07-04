// app/api/games/[id]/seats/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const supabase = await createClient();
  const { gameId } = await params;

  // 1. Get all possible seats (from season ticket holders)
  const { data: allSeats, error: allSeatsError } = await supabase
    .from("season_ticket_holders")
    .select("seat_info");

  if (allSeatsError) {
    return NextResponse.json({ error: allSeatsError.message }, { status: 500 });
  }

  const seatSet = new Set(allSeats.map((s) => s.seat_info));

  // 2. Get already taken seats (tickets for this game)
  const { data: ticketedSeats, error: takenError } = await supabase
    .from("tickets")
    .select(`*`)
    .eq("game_id", gameId);

  if (takenError) {
    return NextResponse.json({ error: takenError.message }, { status: 500 });
  }

  const approvedTickets = ticketedSeats.filter((t) => t.status === "approved");

  const ticketMap = new Map<string, { ticket_id: string; price: number }>();
  approvedTickets.forEach((t) => {
    ticketMap.set(t.seat_info, {
      ticket_id: t.id, // assuming "id" is the ticket ID
      price: Number(t.price),
    });
  });

  const result = Array.from(seatSet).map((seatInfo) => {
    const ticket = ticketMap.get(seatInfo);
    return {
      id: seatInfo,
      seat_info: seatInfo,
      isAvailable: !!ticket,
      ticket_id: ticket?.ticket_id ?? null,
      price: ticket?.price ?? null,
    };
  });

  return NextResponse.json(result);
}
