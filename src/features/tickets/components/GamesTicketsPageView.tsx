"use client";
import {
  useBuyTicketMutation,
  useGetTicketsByGameQuery,
} from "@/services/ticketsApi";
import { useParams } from "next/navigation";
import React from "react";

const GamesTicketsPageView = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { data: tickets, isLoading, error } = useGetTicketsByGameQuery(gameId!);
  const [buyTicket] = useBuyTicketMutation();

  if (isLoading) return <p>Loading tickets…</p>;
  if (error) return <p>Error loading tickets</p>;
  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Available Tickets</h2>
      <ul className="space-y-3">
        {tickets!.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between p-3 border rounded"
          >
            <div>
              <p>Seat: {t.seat_info || "General"}</p>
              <p>Price: ${t.price}</p>
            </div>
            <button
              onClick={() =>
                buyTicket({ ticketId: t.id, buyerId: "currentUserId" })
              }
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Buy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamesTicketsPageView;
