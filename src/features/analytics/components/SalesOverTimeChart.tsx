import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import { useMemo } from "react";
import { useGetTransactionsQuery } from "@/services/transactionsApi";
import Loader from "@/components/ui/Loader";

type DataPoint = {
  date: string;
  count: number;
};

const SalesOverTimeChart = () => {
  const { data: txs, isLoading } = useGetTransactionsQuery({});

  const data: DataPoint[] = useMemo(() => {
    const map = new Map<string, number>();

    txs?.data?.forEach((t) => {
      const day = new Date(t.game_date).toISOString().split("T")[0];
      map.set(day, (map.get(day) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [txs]);

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
        No sales data available for this period.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Sales Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderColor: "#e5e7eb",
              borderRadius: 6,
              fontSize: 13,
            }}
            labelClassName="font-medium"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#6366f1" // Indigo-500
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverTimeChart;
