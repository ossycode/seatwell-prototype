"use client";

import ExportButton from "@/components/admin/ExportButton";
import Button from "@/components/ui/button/Button";
import Loader from "@/components/ui/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetTransactionsQuery } from "@/services/transactionsApi";
import { TABLE_PAGE_SIZE } from "@/utils/constants";
import { formatDate, formatDateWithoutTime } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TransactionsTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Number(searchParams.get("page") || 1);
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading } = useGetTransactionsQuery({
    search,
    page,
    limit: TABLE_PAGE_SIZE,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  }, [debouncedSearch, page, router]);

  const transactions = data?.data || [];
  const count = data?.count || 0;
  const totalPages = Math.ceil(count / TABLE_PAGE_SIZE);

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white  dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="px-4 pt-4 sm:px-6">
        <div className="flex flex-col gap-2  mb-4 sm:flex-row sm:items-center sm:justify-between ">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          </div>

          <div className=" flex items-center justify-center mt-4 sm:mt-0 sm:justify-end gap-6">
            <ExportButton
              type={"transactions"}
              disabled={transactions.length < 1}
            />
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 border-y dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
              >
                Game
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
              >
                Game Date
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
              >
                Seat Info
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
              >
                Buyer Email
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
              >
                Seller Email
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
              >
                Purchase Date
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="px-4 py-3 font-medium text-gray-800 sm:px-6 text-start text-theme-sm dark:text-white/90">
                    {transaction.game_title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(transaction.game_date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                    {transaction.ticket_seat_info}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400 whitespace-nowrap">
                    CHF <strong>{transaction.ticket_price}</strong>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                    {transaction.buyer_email}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                    {transaction.seller_email}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400">
                    {formatDateWithoutTime(transaction.purchased_at)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-lg text-gray-500  dark:text-gray-400 font-medium"
                >
                  No data available
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z"
                fill=""
              />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </Button>
          {/* Page Info */}
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
            Page {page} of {totalPages}
          </span>
          {/* Page Numbers */}
          <ul className="hidden items-center gap-0.5 sm:flex">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setPage(idx + 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium ${
                    page === idx + 1
                      ? "bg-brand-500 text-white"
                      : "text-gray-700 hover:bg-brand-500/[0.08] dark:hover:bg-brand-500 dark:hover:text-white hover:text-brand-500 dark:text-gray-400 "
                  }`}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
          </ul>
          {/* Next Button */}
          <Button
            onClick={() => setPage(page + 1)}
            size="sm"
            variant="outline"
            disabled={page === totalPages}
          >
            <span className="hidden sm:inline">Next</span>
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
                fill=""
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
