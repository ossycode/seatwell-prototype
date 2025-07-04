"use client";

import Button from "@/components/ui/button/Button";
import Loader from "@/components/ui/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTicketsByBuyerQuery } from "@/services/ticketsApi";
import { TABLE_PAGE_SIZE } from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { User } from "@supabase/supabase-js";
import React, { useState } from "react";

interface Props {
  user: User;
}
const BuyersTicketsPurchasedTable = ({ user }: Props) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetTicketsByBuyerQuery({
    buyerId: user.id,
    page,
  });
  const transactions = data?.data ?? [];
  const total = data?.count || 0;
  const totalPages = Math.ceil(total / TABLE_PAGE_SIZE);

  if (isLoading) return <Loader />;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="px-5 mb-4 sm:px-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Your Purchased Tickets
        </h2>
      </div>

      <div className="overflow-hidden">
        <div className="max-w-full px-5 overflow-x-auto sm:px-6">
          <Table className="min-h-[13rem]">
            <TableHeader className="border-gray-100 border-y dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Game
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Seat
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Purchased
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-4 font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                      {tx.ticket.id}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                      {tx.ticket.game.home_team.name} vs{" "}
                      {tx.ticket.game.away_team.name}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      {formatDate(tx.ticket.game.date)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      {tx.ticket.seat_info}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      CHF {tx.ticket.price}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                      {formatDate(tx.purchased_at)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-lg text-gray-500 dark:text-gray-400 font-medium"
                  >
                    No tickets purchased
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyersTicketsPurchasedTable;
