import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ReleasePayload } from "@/types/sell";
import { generateCode } from "@/utils/helpers";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { gameIds, seatInfo, newMethod } = (await req.json()) as ReleasePayload;

  // 1) ensure user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2) insert new payout method if needed
  if (newMethod) {
    await supabase
      .from("payout_methods")
      .update({ is_default: false })
      .eq("user_id", user.id);

    const { error: pmErr } = await supabase
      .from("payout_methods")
      .insert({
        user_id: user.id,
        type: newMethod.type,
        details: newMethod.details,
        is_default: true,
      })
      .select("id")
      .single();
    if (pmErr) {
      console.error(pmErr);
      return NextResponse.json({ error: pmErr.message }, { status: 500 });
    }
  }

  const ticketRows = gameIds.map((gid) => ({
    game_id: gid,
    seller_id: user.id,
    seat_info: seatInfo[gid],
    status: "pending",
    seller_email: user.email,
    verification_code: generateCode(),
    // payout_method_id: pmId,
  }));
  const { error: listErr } = await supabase.from("tickets").insert(ticketRows);

  if (listErr) {
    console.error(listErr);
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
