import { TicketStatus } from "@/types/tickets";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const supabase = await createClient();
  const { ticketId } = await params;

  const { data, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      seller:users(email),
      game:games(
        id,
        date,
        venue,
        home_team:teams!games_home_team_id_fkey(id, name, logo_url),
        away_team:teams!games_away_team_id_fkey(id, name, logo_url)
      )
    `
    )
    .eq("id", ticketId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const supabase = await createClient();
  const { ticketId } = await params;

  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
  }

  const updates = (await request.json()) as {
    price?: number;
    status?: TicketStatus;
    seat_info?: string;
  };
  if (!Object.keys(updates).length) {
    return NextResponse.json(
      { error: "No fields provided to update" },
      { status: 400 }
    );
  }

  // 1) Fetch the old ticket
  const { data: oldTicket } = await supabase
    .from("tickets")
    .select("status, seller_id, price")
    .eq("id", ticketId)
    .single();
  if (!oldTicket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // 1.a) If they’re already at payout_issued and there's a paid payout, block any change
  if (
    oldTicket.status === "payout_issued" &&
    updates.status &&
    updates.status !== "payout_issued"
  ) {
    const { data: paid } = await supabase
      .from("payouts")
      .select("id")
      .eq("ticket_id", ticketId)
      .eq("status", "paid")
      .single();

    if (paid) {
      return NextResponse.json(
        {
          error:
            "Cannot change ticket status after payout is already marked paid.",
        },
        { status: 400 }
      );
    }
  }

  const effectivePrice = updates.price ?? oldTicket.price;
  // Before applying the update, enforce price requirement for certain statuses
  if (
    updates.status &&
    ["approved", "sold", "payout_issued"].includes(updates.status) &&
    (!effectivePrice || effectivePrice <= 0)
  ) {
    return NextResponse.json(
      {
        error: "Cannot approve or finalize ticket without a valid price.",
      },
      { status: 400 }
    );
  }

  // 2) Apply the update
  const { data: newTicket, error: updateErr } = await supabase
    .from("tickets")
    .update(updates)
    .eq("id", ticketId)
    .select("*")
    .single();
  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // 3) Handle payouts & notifications on status‐change
  if (updates.status && oldTicket.status !== updates.status) {
    const newStatus = updates.status;

    // a) If you’re moving _off_ sold or payout_issued, remove any pending payout
    if (!["sold", "payout_issued"].includes(newStatus)) {
      await supabase
        .from("payouts")
        .delete()
        .eq("ticket_id", ticketId)
        .eq("status", "pending");
    }

    switch (newStatus) {
      case "approved":
      case "rejected":
        await supabase.from("notifications").insert([
          {
            user_id: oldTicket.seller_id,
            ticket_id: ticketId,
            type: newStatus,
            message: `Your ticket ${ticketId} has been ${newStatus}.`,
          },
        ]);
        break;

      case "sold":
        if (newTicket.price != null) {
          await supabase.from("payouts").insert([
            {
              ticket_id: ticketId,
              seller_id: newTicket.seller_id,
              amount: newTicket.price,
              status: "pending",
              seller_email: newTicket.seller_email,
            },
          ]);
        }
        await supabase.from("notifications").insert([
          {
            user_id: oldTicket.seller_id,
            ticket_id: ticketId,
            type: "sold",
            message: `Your ticket ${ticketId} has been marked as sold.`,
          },
        ]);
        break;

      case "payout_issued":
        // mark the pending payout as paid
        await supabase
          .from("payouts")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("ticket_id", ticketId)
          .eq("status", "pending");
        await supabase.from("notifications").insert([
          {
            user_id: oldTicket.seller_id,
            ticket_id: ticketId,
            type: "payout_issued",
            message: `A payout for ticket ${ticketId} has been issued.`,
          },
        ]);
        break;
    }
  }

  return NextResponse.json(newTicket);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", ticketId)
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
