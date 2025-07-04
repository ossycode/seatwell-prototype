"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "@/components/ui/Loader";
import { ChevronDownIcon } from "@/icons";
import { formatDate, formatDateWithoutTime } from "@/utils/helpers";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/Pagination";
import { useGetPayoutsQuery } from "@/services/payoutsApi";
import { PayoutStatus } from "@/types/payout";

const TABLE_PAGE_SIZE = 10;

export default function SellerPaoutsView({ sellerId }: { sellerId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_PAGE_SIZE);
  const [status, setStatus] = useState<PayoutStatus>();

  const debouncedSearch = useDebounce(search, 300);

  const { data: payoutsData, isLoading } = useGetPayoutsQuery({
    seller_id: sellerId,
    search: debouncedSearch,
    page: currentPage,
    limit: rowsPerPage,
    status: status,
  });

  console.log(payoutsData?.data);

  const payouts = payoutsData?.data ?? [];
  const totalEntries = payoutsData?.count ?? 0;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.push(`?${params.toString()}`);
  }, [debouncedSearch, status, currentPage, router]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + payouts.length, totalEntries);

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"> Show </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="8">8</option>
              <option value="5">5</option>
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400"> entries </span>

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
                    d="M3.042 9.374c0-3.497 2.835-6.332 6.333-6.332 3.498 0 6.334 2.835 6.334 6.332 0 3.497-2.836 6.332-6.334 6.332-3.498 0-6.333-2.835-6.333-6.332Zm6.333-7.832c-4.326 0-7.833 3.506-7.833 7.832 0 4.326 3.507 7.832 7.833 7.832 1.892 0 3.628-.671 4.982-1.788l2.82 2.82c.293.293.768.293 1.061 0 .293-.293.293-.768 0-1.061l-2.82-2.82c1.118-1.354 1.79-3.09 1.79-4.983 0-4.326-3.508-7.832-7.833-7.832Z"
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

          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as PayoutStatus);
                setCurrentPage(1);
              }}
              aria-label="Payout status filter"
              name="Payout status filter"
              className={`capitalize h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                status
                  ? "text-gray-800 dark:text-white/90"
                  : "text-gray-400 dark:text-gray-400"
              }`}
            >
              <option value="">All Payouts</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                Game
              </TableCell>
              <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                Game Date
              </TableCell>
              <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                Amount
              </TableCell>
              <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                Status
              </TableCell>
              <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                Created At
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length > 0 ? (
              payouts.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90">
                    {item.ticket?.game?.home_team} vs{" "}
                    {item.ticket?.game?.away_team}
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                    {formatDate(item.ticket?.game?.date)}
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                    CHF {item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                    <Badge
                      size="sm"
                      color={item.status === "paid" ? "success" : "warning"}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                    {formatDateWithoutTime(item.created_at)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-lg text-gray-500 dark:text-gray-400 font-medium w-full"
                >
                  No data available
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          <div className="pb-3 xl:pb-0">
            <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
              Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
            </p>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
