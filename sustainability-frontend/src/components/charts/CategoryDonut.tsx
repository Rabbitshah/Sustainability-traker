import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";

type Props = {
  data: { category: string; value: number }[];
};

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function CategoryDonut({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border p-5 min-w-0 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold">Footprint by Category</p>
        <p className="text-sm text-gray-500">Distribution</p>
      </div>

      <div className="w-full min-w-0 h-70">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={65}
              outerRadius={95}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "8px",
                color: "#000",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
