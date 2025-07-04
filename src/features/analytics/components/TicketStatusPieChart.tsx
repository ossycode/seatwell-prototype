"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import Loader from "@/components/ui/Loader";
import { useGetTicketsQuery } from "@/services/ticketsApi";

const COLORS = ["#4CAF50", "#FFBB28", "#FF8042", "#8884d8", "#00C49F"];

const TicketStatusPieChart = () => {
  const { data: ticketsApiData, isLoading } = useGetTicketsQuery({});

  const tickets = ticketsApiData?.data;

  const data = useMemo(() => {
    const counts =
      tickets?.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    return Object.entries(counts).map(([status, value]) => ({
      name: status,
      value,
    }));
  }, [tickets]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-72">
        <Loader />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-72 rounded-lg border border-dashed bg-gray-50 text-sm text-gray-500">
        No ticket data available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Ticket Status Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}`, name]}
            contentStyle={{
              backgroundColor: "white",
              borderColor: "#e5e7eb",
              borderRadius: 6,
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            layout="horizontal"
            verticalAlign="bottom"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketStatusPieChart;
