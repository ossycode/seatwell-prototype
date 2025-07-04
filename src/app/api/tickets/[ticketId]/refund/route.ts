import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const supabase = await createClient();
  const { ticketId } = await params;

  // 1) Update ticket status
  const { data: ticket, error: tErr } = await supabase
    .from("tickets")
    .update({ status: "payout_issued" })
    .eq("id", ticketId)
    .select("*")
    .single();
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 400 });

  // 2) Notify buyer
  const { data: tx } = await supabase
    .from("transactions")
    .select("buyer_id")
    .eq("ticket_id", ticketId)
    .single();
  await supabase.from("notifications").insert([
    {
      user_id: tx?.buyer_id,
      ticket_id: ticketId,
      type: "payout_issued",
      message: `Your purchase of ticket ${ticketId} has been refunded.`,
    },
  ]);

  return NextResponse.json(ticket);
}
