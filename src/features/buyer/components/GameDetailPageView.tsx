"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { useModal } from "@/hooks/useModal";
import ConfirmBuyModal from "./ConfirmBuyModal";

export type Seat = {
  id: string;
  seat_info: string;
  isAvailable: boolean;
  ticket_id: string | null;
  price: number | null;
};

type GameInfo = {
  home_team: string;
  away_team: string;
  date: string;
  venue: string;
};

export default function GameDetailPageView() {
  const { gameId } = useParams<{ gameId: string }>();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [game, setGame] = useState<GameInfo | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const confirmBuyModalCtl = useModal();

  useEffect(() => {
    if (!gameId) return;

    startTransition(() => {
      (async () => {
        try {
          const [gameRes, seatRes] = await Promise.all([
            fetch(`/api/games/${gameId}`),
            fetch(`/api/games/${gameId}/seats`),
          ]);

          const gameData = await gameRes.json();
          const seatData = await seatRes.json();
          setGame(gameData);
          setSeats(seatData);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          toast.error("Failed to load game data");
        }
      })();
    });
  }, [gameId]);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId === selectedSeat ? null : seatId);
  };

  //   const handlePurchase = async () => {
  //     if (!selectedSeat) {
  //       toast.error("Please select a seat.");
  //       return;
  //     }

  //     setIsLoading(true);
  //     const res = await fetch(`/api/tickets/purchase`, {
  //       method: "POST",
  //       body: JSON.stringify({ gameId, seatId: selectedSeat }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await res.json();
  //     setIsLoading(false);

  //     if (res.ok) {
  //       toast.success("Ticket purchased successfully!");
  //       setSeats((prev) =>
  //         prev.map((s) =>
  //           s.id === selectedSeat ? { ...s, isAvailable: false } : s
  //         )
  //       );
  //       setSelectedSeat(null);
  //     } else {
  //       toast.error(data?.error || "Purchase failed");
  //     }
  //   };

  const selected = seats.find((s) => s.id === selectedSeat);

  // Group by row prefix (e.g. A, B, AA)
  const groupedByRow = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    const sectionMatch = seat.seat_info.match(/Section\s+([A-Za-z0-9]+)/i);
    const rowMatch = seat.seat_info.match(/Row\s+(\d+)/i);
    const section = sectionMatch?.[1] || "Unknown";
    const row = rowMatch?.[1] || "Unknown";

    const key = `Section ${section}, Row ${row}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(seat);
    return acc;
  }, {});

  if (isPending) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto pt-3 pb-10 px-4">
      <div className=" h-full w-full mb-8  ">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/buyer">Buyer</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Game Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {game && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            {game.home_team} vs {game.away_team}
          </h1>
          <p className="text-gray-600 text-sm">
            {new Date(game.date).toLocaleString()} – {game.venue}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <Legend color="bg-green-500" label="Available" />
        <Legend color="bg-gray-300" label="Unavailable" />
        <Legend color="ring-2 ring-blue-500" label="Selected" />
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto space-y-4 pb-4 bg-gray p-6 rounded-md max-w-lg mx-auto">
        {Object.entries(groupedByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-2 ">
            <div className="min-w-[120px] text-sm font-semibold text-gray-700 w-[70%]">
              {row}
            </div>
            <div className="flex flex-wrap gap-2 ">
              {rowSeats.map((seat) => {
                const seatNumberMatch = seat.seat_info.match(/Seat\s+(\d+)/i);
                const seatNumber = seatNumberMatch?.[1] || "?";

                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatSelect(seat.id)}
                    disabled={!seat.isAvailable}
                    aria-label={`Seat ${seat.seat_info} - $${seat.price}`}
                    className={clsx(
                      "w-12 h-12 text-xs rounded border flex items-center justify-center font-medium",
                      {
                        "bg-green-500 text-white hover:brightness-110":
                          seat.isAvailable,
                        "bg-gray-300 text-gray-500 cursor-not-allowed":
                          !seat.isAvailable,
                        "ring-2 ring-blue-500": selectedSeat === seat.id,
                      }
                    )}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Buy Button */}
      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          onClick={() => confirmBuyModalCtl.openModal()}
          disabled={!selectedSeat}
        >
          Buy Ticket{" "}
        </Button>
      </div>

      {/* Your Selection Summary */}
      {selected && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">
            Your Selection
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <strong>Seat:</strong> {selected.seat_info}
            </p>
            <p>
              <strong>Price:</strong> ${selected.price?.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {selected && (
        <ConfirmBuyModal
          isOpen={confirmBuyModalCtl.isOpen}
          closeModal={confirmBuyModalCtl.closeModal}
          ticketInfo={selected}
        />
      )}
    </div>
  );
}

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);
