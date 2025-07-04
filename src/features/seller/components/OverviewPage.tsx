"use client";

import Loader from "@/components/ui/Loader";
import { useGetTicketsBySellerQuery } from "@/services/ticketsApi";
import { fmtCurrency } from "@/utils/helpers";
import React from "react";

interface Props {
  userId: string;
}
const OverviewPage = ({ userId }: Props) => {
  const { data, isLoading } = useGetTicketsBySellerQuery({
    sellerId: userId,
    page: 1,
    limit: 10,
  });

  if (isLoading) return <Loader />;

  const tickets = data?.data ?? [];

  const sold = tickets.filter((t) => ["sold"].includes(t.status));

  const totalGross = sold.reduce((sum, t) => sum + (t?.price ?? 0), 0);
  const payoutShare = 0.95;
  const totalPayout = totalGross * payoutShare;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-600">Your Listings</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {tickets?.length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-600">Pending</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {tickets?.filter((t) => t.status === "pending").length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-600">Sold / Resold</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{sold.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-600">Expected Payout</h2>
          <p>Total Sales - 5%</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {fmtCurrency.format(totalPayout)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
