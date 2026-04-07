import {
  ResponsiveContainer,
  Line,
  XAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

type Props = {
  data: { label: string; value: number }[];
  total: number;
  deltaText: string;
};

export default function TrendChart({ data, total, deltaText }: Props) {
  return (
    <div className="h-full rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-2xl font-semibold text-zinc-900 transition-colors">
            CO2 Consumption Trends
          </p>
          <p className="text-sm text-zinc-500 transition-colors">
            Last 7 Days Breakdown
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-zinc-900 transition-colors">
            {total.toFixed(1)} kg
          </p>
          <p className="text-xs font-semibold text-red-500">-{deltaText}</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke="var(--chart-axis)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ stroke: "#22c55e", strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                border: "1px solid var(--chart-tooltip-border)",
                borderRadius: "10px",
                boxShadow: "var(--chart-tooltip-shadow)",
              }}
              formatter={(value) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value ?? 0);
                return [`${numericValue.toFixed(2)} kg CO2e`, "Impact"];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#trendGradient)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#22c55e" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
