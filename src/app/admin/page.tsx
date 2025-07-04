"use client";
import React from "react";
import AvgPriceBarChart from "@/features/analytics/components/AvgPriceBarChart";
import TicketStatusPieChart from "@/features/analytics/components/TicketStatusPieChart";
import SalesOverTimeChart from "@/features/analytics/components/SalesOverTimeChart";
import AdminStats from "@/features/admin/components/AdminStats";

const AdminDashboard = () => {
  return (
    <div className=" space-y-12">
      <h1 className="text-3xl font-bold text-center sm:text-left ">
        Admin Overview
      </h1>

      {/* Summary Cards */}
      <AdminStats />

      {/* Analytics Sections */}
      <div className="space-y-16">
        <section id="sales-over-time" className="space-y-4">
          <h2 className="text-2xl font-semibold">Sales Over Time</h2>
          <div className="rounded-lg shadow">
            <SalesOverTimeChart />
          </div>
        </section>

        <section id="ticket-status" className="space-y-4">
          <h2 className="text-2xl font-semibold">Ticket Status Breakdown</h2>
          <div className="rounded-lg shadow">
            <TicketStatusPieChart />
          </div>
        </section>

        <section id="avg-price" className="space-y-4">
          <h2 className="text-2xl font-semibold">Average Price by Game</h2>
          <div className=" rounded-lg shadow">
            <AvgPriceBarChart />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
