"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetGamesQuery } from "@/services/gamesApi";
import { TABLE_PAGE_SIZE } from "@/utils/constants";
import Loader from "@/components/ui/Loader";

export default function ViewAllFutureGames() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useGetGamesQuery({
    search: debouncedSearch,
    page,
    limit: TABLE_PAGE_SIZE,
    futureOnly: true,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }, [debouncedSearch, page, router]);

  const games = data?.data ?? [];
  const totalGames = data?.count ?? 0;
  const totalPages = Math.ceil(totalGames / TABLE_PAGE_SIZE);

  if (isLoading) return <Loader />;

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <form onSubmit={(e) => e.preventDefault()} className="mb-6">
        <div className="relative">
          <button className="absolute -translate-y-1/2 left-4 top-1/2">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
                fill=""
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search by team or venue..."
            className="dark:bg-dark-900 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map((game) => {
          const hasTickets = (game.available_ticket_count ?? 0) > 0;
          return (
            <div
              key={game.id}
              className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-dark-800 dark:border-white/10"
            >
              <div className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                {game.home_team?.name} vs {game.away_team?.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(game.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div className="mt-4">
                {hasTickets ? (
                  <Link href={`/buyer/games/${game.id}`}>
                    <button className="w-full py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      🎟 Tickets Available
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 text-sm font-medium bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                  >
                    No Tickets Available
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm px-4 py-2 rounded border dark:border-gray-600 disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm px-4 py-2 rounded border dark:border-gray-600 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
