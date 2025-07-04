"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useGetGamesQuery } from "@/services/gamesApi";
import Loader from "@/components/ui/Loader";
import { formatDate } from "@/utils/helpers";
import Button from "@/components/ui/button/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Game } from "@/types/games";
import { useModal } from "@/hooks/useModal";
import ConfirmReleaseModal from "./ConfirmReleaseModal";
import ReleaseCompletedModal from "./ReleaseCompletedModal";

export default function UpComingGamesView() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [listedGames, setListedGames] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedGameData, setSelectedGameData] = useState<
    Record<string, Game>
  >({});

  const confirmReleaseModalCtl = useModal();
  const releaseCompletedCtl = useModal();

  const supabase = createClient();

  const { data: games, isLoading } = useGetGamesQuery({
    futureOnly: true,
    search,
    page,
    limit,
  });

  const totalPages = Math.ceil((games?.count || 0) / limit);
  const selectedGames = Object.values(selectedGameData);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tickets } = await supabase
        .from("tickets")
        .select("game_id,status")
        .eq("seller_id", user.id)
        .in("status", ["pending", "approved", "sold", "payout_issued"]);

      const map: Record<string, string> = {};
      tickets?.forEach((t) => {
        map[t.game_id] = t.status;
      });
      setListedGames(map);
    })();
  }, [supabase]);

  const toggleSelect = (game: Game) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(game.id)) {
        newSet.delete(game.id);
      } else {
        newSet.add(game.id);
      }
      return newSet;
    });

    setSelectedGameData((prev) => {
      const newData = { ...prev };
      if (newData[game.id]) {
        delete newData[game.id];
      } else {
        newData[game.id] = game;
      }
      return newData;
    });
  };

  const handleConfirmRelease = () => {
    confirmReleaseModalCtl.closeModal();
    releaseCompletedCtl.openModal();
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto">
      <h1 className="text-xl sm:text-3xl font-semibold text-center mt-4 mb-10 dark:text-white/90">
        Choose the games you cannot attend
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by team or venue…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {games?.data.map((game) => {
          const isSelected = selected.has(game.id);
          const alreadyReleased = listedGames[game.id];

          return (
            <div
              key={game.id}
              className="flex flex-col md:flex-row items-center gap-4 bg-gray-100 p-4 rounded-lg shadow"
            >
              <div className="relative w-full max-w-xs aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
                <Image
                  src="/images/stadium-celebrate.jpg"
                  alt="Background"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-green-600 z-10" />
                <div className="relative z-10 text-white p-2">
                  <div className="flex items-center justify-around">
                    {[game.home_team, game.away_team].map((team, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center"
                      >
                        <Image
                          src={`${team?.logo_url}`}
                          alt={`${team?.name}`}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <span className="mt-1 text-sm">{team?.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-light text-center">
                    {game.venue}
                  </p>
                  <p className="text-center text-accent font-semibold mt-1 border-b-2 w-fit mx-auto">
                    {formatDate(game.date)}
                  </p>
                </div>
              </div>
              {alreadyReleased ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={"outline"}
                      disabled
                      className="w-full max-w-[150px] shrink-0"
                    >
                      Released
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You released this ticket already</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  size="sm"
                  variant={isSelected ? "primary" : "outline"}
                  endIcon={
                    isSelected ? <CheckIcon className="w-4 h-4" /> : null
                  }
                  disabled={!!alreadyReleased}
                  onClick={() => toggleSelect(game)}
                  className="w-full max-w-[150px] shrink-0"
                >
                  {isSelected ? "Selected" : "I want to sell"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-4 items-center">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Page {page} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Confirm Button */}
      <div className="mt-10">
        <Button
          className="w-full"
          disabled={selected.size === 0}
          onClick={() => confirmReleaseModalCtl.openModal()}
        >
          Review {selected.size} Game{selected.size !== 1 ? "s" : ""}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmReleaseModal
        isOpen={confirmReleaseModalCtl.isOpen}
        closeModal={confirmReleaseModalCtl.closeModal}
        games={selectedGames}
        onConfirm={handleConfirmRelease}
      />
      <ReleaseCompletedModal
        isOpen={releaseCompletedCtl.isOpen}
        closeModal={releaseCompletedCtl.closeModal}
      />
    </div>
  );
}
