"use client";

import ExportButton from "@/components/admin/ExportButton";
import Pagination from "@/components/Pagination";
import Badge from "@/components/ui/badge/Badge";
import Loader from "@/components/ui/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useModal } from "@/hooks/useModal";
import { AngleDownIcon, AngleUpIcon, ChevronDownIcon } from "@/icons";
import {
  useGetPayoutsQuery,
  usePayPayoutMutation,
} from "@/services/payoutsApi";
import { Payout, PayoutStatus } from "@/types/payout";
import { TABLE_PAGE_SIZE } from "@/utils/constants";
import { formatDate, formatDateWithoutTime } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ConfirmPayoutModal from "./ConfirmPayoutModal";
import toast from "react-hot-toast";

export default function PayoutsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [rowsPerPage, setRowsPerPage] = useState(TABLE_PAGE_SIZE);
  const [status, setStatus] = useState<PayoutStatus | "">(
    (searchParams.get("status") as PayoutStatus) || ""
  );
  const [payoutToProcess, setPayoutToProcess] = useState<Payout | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const payoutModalControl = useModal();

  const [payPayout, { isLoading: isPaying }] = usePayPayoutMutation();
  const { data: payoutsData, isLoading } = useGetPayoutsQuery({
    search: debouncedSearch,
    page: currentPage,
    limit: rowsPerPage,
    status: status || undefined,
  });

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

  const payouts = payoutsData?.data ?? [];
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + payouts.length, totalEntries);

  const handlePayout = async () => {
    try {
      if (!payoutToProcess) return;
      await payPayout(payoutToProcess.id).unwrap();
      toast.success("Payout processed successfully");
    } catch (err) {
      toast.error("Failed to process payout");
      console.error(err);
    } finally {
      payoutModalControl.closeModal();
      setPayoutToProcess(null);
    }
  };

  if (isLoading || isPaying) return <Loader />;
  return (
    <div className="overflow-hidden  rounded-xl  bg-white  dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 px-4 py-4 border border-b-0 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"> Show </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option
                value="10"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                10
              </option>
              <option
                value="8"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                8
              </option>
              <option
                value="5"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                5
              </option>
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              } `}
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ExportButton type="payouts" disabled={payouts.length < 1} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Seller
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                      <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                    </button>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Game
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                      <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                    </button>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Game Date
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                      <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                    </button>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Amount
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                      <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                    </button>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Status
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                      <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                    </button>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Created At
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                      <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                    </button>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                      Action
                    </p>
                    <button className="flex flex-col gap-0.5">
                      <AngleUpIcon className="text-gray-300 dark:text-gray-700" />
                      <AngleDownIcon className="text-gray-300 dark:text-gray-700" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts?.length > 0 ? (
                payouts?.map((item, index) => (
                  <TableRow key={index}>
                    {/* Seller */}
                    <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 ">
                      <p className=" font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.seller_email}
                      </p>
                    </TableCell>

                    {/* Game */}
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400">
                      {item.ticket?.game?.home_team} vs{" "}
                      {item.ticket?.game?.away_team}
                    </TableCell>

                    {/* Game Date */}
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      {formatDate(item.ticket?.game?.date)}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      CHF {item.amount.toFixed(2)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <Badge
                        size="sm"
                        color={item.status === "paid" ? "success" : "warning"}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      {formatDateWithoutTime(item.created_at)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                      <div className="flex items-center w-full gap-2">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => {
                              setPayoutToProcess(item);
                              payoutModalControl.openModal();
                            }}
                            className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                          >
                            Pay
                          </button>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">
                            –
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr className="w-full ">
                  <td
                    colSpan={4}
                    className="text-center py-6 text-lg text-gray-500  dark:text-gray-400 font-medium w-full "
                  >
                    No data available
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          {/* Left side: Showing entries */}
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

      {payoutToProcess && (
        <ConfirmPayoutModal
          isOpen={payoutModalControl.isOpen}
          closeModal={payoutModalControl.closeModal}
          onConfirm={handlePayout}
          payout={payoutToProcess}
          isloading={isPaying}
        />
      )}
    </div>
  );
}
