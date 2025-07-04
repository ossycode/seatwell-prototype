"use client";
import AvgPriceBarChart from "@/features/analytics/components/AvgPriceBarChart";
import SalesOverTimeChart from "@/features/analytics/components/SalesOverTimeChart";
import TicketStatusPieChart from "@/features/analytics/components/TicketStatusPieChart";
import React from "react";

const AdminAnalytics = () => {
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-3xl">Analytics</h1>
      <section>
        <h2 className="text-xl mb-2">Sales Over Time</h2>
        <SalesOverTimeChart />
      </section>
      <section>
        <h2 className="text-xl mb-2">Ticket Status Breakdown</h2>
        <TicketStatusPieChart />
      </section>
      <section>
        <h2 className="text-xl mb-2">Average Price by Game</h2>
        <AvgPriceBarChart />
      </section>
    </div>
  );
};

export default AdminAnalytics;
