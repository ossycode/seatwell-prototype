"use client";
import Badge, { BadgeColor } from "@/components/ui/badge/Badge";
import Loader from "@/components/ui/Loader";
import { useDebounce } from "@/hooks/useDebounce";
import { ChevronDownIcon } from "@/icons";
import { useGetTicketsBySellerQuery } from "@/services/ticketsApi";
import { TicketStatus } from "@/types/tickets";
import { ALL_STATUSES, TABLE_PAGE_SIZE } from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const statusColorMap: Record<TicketStatus, BadgeColor> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  sold: "info",
  payout_issued: "primary",
};

const SellerListingsView = ({ userId }: { userId: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useGetTicketsBySellerQuery({
    sellerId: userId,
    search: debouncedSearch,
    page,
    limit: TABLE_PAGE_SIZE,
    status,
  });

  console.log(data?.data);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    if (status) params.set("status", status);
    router.push(`?${params.toString()}`);
  }, [debouncedSearch, page, status, router]);

  const tickets = data?.data ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.ceil(total / TABLE_PAGE_SIZE);

  if (isLoading) return <Loader />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <form onSubmit={(e) => e.preventDefault()}>
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
                  placeholder="Search..."
                  className="dark:bg-dark-900 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>

            <div className="relative w-full">
              <select
                value={status || ""}
                onChange={(e) => setStatus(e.target.value || undefined)}
                className={`capitalize h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                  status
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400 dark:text-gray-400"
                }`}
              >
                <option value="">All Statuses</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="max-w-full px-5 overflow-x-auto sm:px-6">
          <table className="min-h-[13rem] w-full text-left">
            <thead className="border-gray-100 border-y dark:border-white/[0.05]">
              <tr>
                {["ID", "Game", "Date", "Seat", "Price", "Status"].map((h) => (
                  <th
                    key={h}
                    className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-4 py-4 font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                      {ticket.verification_code}
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      {ticket.game.home_team.name} vs{" "}
                      {ticket.game.away_team.name}
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      {formatDate(ticket.game.date)}
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      {ticket.seat_info}
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap text-theme-sm dark:text-gray-400">
                      CHF {ticket.price}
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      <Badge color={statusColorMap[ticket.status]}>
                        {ticket.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-lg text-gray-500 dark:text-gray-400 font-medium"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="text-sm px-3 py-2 rounded border dark:border-gray-600"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="text-sm px-3 py-2 rounded border dark:border-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerListingsView;
