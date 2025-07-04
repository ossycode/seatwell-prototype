"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { useMemo } from "react";
import { useGetGamesQuery } from "@/services/gamesApi";
import { useGetTicketsQuery } from "@/services/ticketsApi";
import Loader from "@/components/ui/Loader";
import { formatCurrency } from "@/utils/helpers";

interface DataPoint {
  name: string;
  avg: number;
}

const AvgPriceBarChart = () => {
  const { data: games, isLoading: gamesLoading } = useGetGamesQuery({});
  const { data: ticketsApiData, isLoading: ticketsLoading } =
    useGetTicketsQuery({});
  const tickets = ticketsApiData?.data;
  const data: DataPoint[] = useMemo(() => {
    if (!games || !tickets) return [];

    return games?.data.map((g) => {
      const gs = tickets.filter((t) => t.game.id === g.id && t.price != null);
      const avg =
        gs.length > 0
          ? gs.reduce((sum, t) => sum + (t.price ?? 0), 0) / gs.length
          : 0;

      return {
        name: `${g.home_team?.name ?? "TBD"} vs ${g.away_team?.name ?? "TBD"}`,
        avg,
      };
    });
  }, [games, tickets]);

  if (gamesLoading || ticketsLoading) {
    return <Loader />;
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-72 rounded-lg border border-dashed bg-gray-50 text-sm text-gray-500">
        No average price data available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Average Ticket Price per Game
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-30}
            textAnchor="end"
            tick={{ fontSize: 11 }}
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) =>
              typeof value === "number" ? formatCurrency(value) : value
            }
            contentStyle={{
              backgroundColor: "white",
              borderColor: "#e5e7eb",
              borderRadius: 6,
              fontSize: 13,
            }}
          />
          <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AvgPriceBarChart;
