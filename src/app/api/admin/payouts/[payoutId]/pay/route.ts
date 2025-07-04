import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ payoutId: string }> }
) {
  const supabase = await createClient();
  const { payoutId } = await params;

  // 1) Mark payout as paid
  const { data: payout, error: pErr } = await supabase
    .from("payouts")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", payoutId)
    .select("*")
    .single();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

  // 2) Update the related ticket status
  const { error: tErr } = await supabase
    .from("tickets")
    .update({ status: "payout_issued" })
    .eq("id", payout.ticket_id);
  if (tErr) {
    return NextResponse.json(
      {
        error: `Payout marked paid, but ticket update failed: ${tErr.message}`,
      },
      { status: 500 }
    );
  }

  // 3) Notify the seller
  await supabase.from("notifications").insert([
    {
      user_id: payout.seller_id,
      ticket_id: payout.ticket_id,
      type: "payout_issued",
      message: `Your payout of $${payout.amount} for ticket ${payout.ticket_id} has been issued.`,
    },
  ]);

  return NextResponse.json(payout);
}
