import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
  YAxis,
} from "recharts";

type Props = {
  data: { month: string; value: number }[];
};

export default function TrendChart({ data }: Props) {
  const themeColors = {
    text: "#64748b",
    grid: "#e2e8f0",
    bg: "#ffffff",
  };

  return (
    <div className="bg-white rounded-2xl border p-5 transition-colors h-full">
      <div className="flex justify-between mb-4">
        <p className="font-semibold">CO2 Consumption Trends</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={themeColors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke={themeColors.text}
              fontSize={10}
              tickLine={false}
            />
            <YAxis stroke={themeColors.text} fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: themeColors.bg,
                border: "none",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
