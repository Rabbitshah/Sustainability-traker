import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";

type Props = {
  data: { category: string; value: number }[];
};

const COLORS = ["#22c55e", "#16a34a", "#166534", "#bbf7d0", "#3b82f6"];

export default function CategoryDonut({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const withPercentages = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));

  return (
    <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold text-zinc-900 transition-colors">
            Footprint by Category
          </p>
          <p className="text-sm text-zinc-500 transition-colors">Distribution of impact</p>
        </div>
        <p className="text-lg text-slate-400 transition-colors">◔</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative h-64 w-full min-w-0">
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                Total
              </p>
              <p className="text-3xl font-bold text-zinc-900 transition-colors">100%</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={withPercentages}
                dataKey="value"
                nameKey="category"
                innerRadius={58}
                outerRadius={92}
                stroke="none"
              >
                {withPercentages.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--chart-tooltip-bg)",
                  border: "1px solid var(--chart-tooltip-border)",
                  borderRadius: "10px",
                  boxShadow: "var(--chart-tooltip-shadow)",
                }}
                formatter={(value, _name, payload) => {
                  const numericValue =
                    typeof value === "number" ? value : Number(value ?? 0);
                  const label =
                    payload?.payload && "category" in payload.payload
                      ? String(payload.payload.category)
                      : "Category";
                  return [`${numericValue.toFixed(2)} kg`, label];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center">
          <ul className="w-full space-y-2">
            {withPercentages.map((item, index) => (
              <li
                key={item.category}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-zinc-700 transition-colors">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.category}
                </span>
                <span className="font-semibold text-zinc-900 transition-colors">
                  {Math.round(item.percentage)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {withPercentages.length === 0 && (
        <p className="pt-3 text-center text-sm text-zinc-500">
          No category data available yet.
        </p>
      )}

      <div className="sr-only">
        Total category emissions: {total.toFixed(2)} kg
      </div>
    </div>
  );
}
