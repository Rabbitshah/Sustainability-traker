import { useMemo, useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  FileDown,
  Download,
  Leaf,
  Droplets,
  Trash2,
  Activity,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api } from "../services/api";
import { emissionsApi, type EmissionRecord } from "../services/emissions";

const IMPACT_COLORS = ["#22c55e", "#16a34a", "#15803d", "#86efac"];
const FILTER_CATEGORIES = ["Transport", "Energy", "Food", "Waste"];

type ReportMode = "standard" | "audit" | "trend" | "history";

type ActivityRow = {
  id: number;
  dateLabel: string;
  activityLabel: string;
  category: string;
  impact: number;
};

const toMonthKey = (isoDate: string) => isoDate.slice(0, 7);

const getRecordImpact = (record: EmissionRecord) =>
  Number(record.co2e_impact ?? record.value ?? 0);

const activityText: Record<string, string> = {
  transport: "Bicycle Commute",
  energy: "Solar Grid Feed-in",
  food: "Zero Waste Grocery Run",
  waste: "Recycling Drop-off",
};

const categoryBadgeClass: Record<string, string> = {
  transport: "bg-green-100 text-green-700",
  energy: "bg-amber-100 text-amber-700",
  food: "bg-emerald-100 text-emerald-700",
  waste: "bg-blue-100 text-blue-700",
};

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [logs, setLogs] = useState<EmissionRecord[]>([]);
  const [mode, setMode] = useState<ReportMode>("standard");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Transport",
    "Energy",
    "Food",
    "Waste",
  ]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const emissions = await emissionsApi.list();
      setLogs(
        emissions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
    } catch (error) {
      console.error("Failed to load report data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredLogs = useMemo(() => {
    const allowed = new Set(selectedCategories.map((item) => item.toLowerCase()));
    return logs.filter((item) => allowed.has(item.category.toLowerCase()));
  }, [logs, selectedCategories]);

  const dateWindow = useMemo(() => {
    if (filteredLogs.length === 0) {
      return "No records available";
    }

    const newest = filteredLogs[0].date;
    const oldest = filteredLogs[filteredLogs.length - 1].date;
    return `${formatDate(oldest)} - ${formatDate(newest)}`;
  }, [filteredLogs]);

  const summary = useMemo(() => {
    const totalCarbon = filteredLogs.reduce(
      (sum, record) => sum + getRecordImpact(record),
      0,
    );

    const grouped = new Map<string, number>();
    filteredLogs.forEach((item) => {
      const key = item.category;
      grouped.set(key, (grouped.get(key) ?? 0) + getRecordImpact(item));
    });

    const split = Array.from(grouped.entries())
      .map(([category, value]) => ({
        category,
        value: Number(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);

    const waterSaved = filteredLogs
      .filter((item) => item.category.toLowerCase() === "energy")
      .reduce((sum, item) => sum + item.value * 0.48, 0);

    const wasteDiversionRate =
      filteredLogs.length === 0
        ? 0
        : Math.min(
            100,
            Math.round(
              (filteredLogs.filter((item) => item.category.toLowerCase() === "waste")
                .length /
                filteredLogs.length) *
                100,
            ),
          );

    return {
      totalCarbon,
      split,
      waterSaved,
      wasteDiversionRate,
    };
  }, [filteredLogs]);

  const totalCarbonTons = summary.totalCarbon / 1000;

  const trendData = useMemo(() => {
    const grouped = new Map<string, number>();

    filteredLogs.forEach((item) => {
      const month = toMonthKey(item.date);
      grouped.set(month, (grouped.get(month) ?? 0) + getRecordImpact(item));
    });

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({
        label: month,
        value: Number(value.toFixed(2)),
      }));
  }, [filteredLogs]);

  const activityRows = useMemo<ActivityRow[]>(() => {
    return filteredLogs.slice(0, 3).map((item) => {
      const categoryKey = item.category.toLowerCase();
      return {
        id: item.id,
        dateLabel: formatDate(item.date),
        activityLabel: activityText[categoryKey] ?? `${item.category} Activity`,
        category: item.category,
        impact: getRecordImpact(item),
      };
    });
  }, [filteredLogs]);

  const trendDeltaText = useMemo(() => {
    if (trendData.length < 2) return "0% decrease from last period";

    const previous = trendData[trendData.length - 2].value;
    const current = trendData[trendData.length - 1].value;

    if (previous <= 0) return "0% decrease from last period";

    const delta = ((previous - current) / previous) * 100;
    return `${Math.max(0, Math.round(delta))}% decrease from last period`;
  }, [trendData]);

  const dominantCategory = summary.split[0];
  const dominantPercent =
    summary.totalCarbon > 0
      ? Math.round(((dominantCategory?.value ?? 0) / summary.totalCarbon) * 100)
      : 0;

  const toggleCategory = (category: string) => {
    setSelectedCategories((previous) => {
      if (previous.includes(category)) {
        const next = previous.filter((item) => item !== category);
        return next.length === 0 ? [category] : next;
      }
      return [...previous, category];
    });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportCsv = async () => {
    setIsExportingCsv(true);
    try {
      const header = "Date,Category,Value,Unit,CO2e Impact\n";
      const rows = filteredLogs
        .map(
          (item) =>
            `${item.date},${item.category},${item.value},${item.unit},${getRecordImpact(item)}`,
        )
        .join("\n");

      const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
      downloadBlob(blob, `sustainability-report-${new Date().toISOString().split("T")[0]}.csv`);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const response = await api.get("/kpis/download_report/", {
        responseType: "blob",
      });

      const filename = `sustainability-report-${new Date().toISOString().split("T")[0]}.pdf`;
      const blob = new Blob([response.data], { type: "application/pdf" });
      downloadBlob(blob, filename);
    } catch (error) {
      console.error("PDF export failed, using fallback.", error);
      const fallbackContent = [
        "Sustainability Report",
        `Generated: ${new Date().toLocaleString()}`,
        `Total Carbon: ${summary.totalCarbon.toFixed(2)} kg CO2e`,
        `Reporting Window: ${dateWindow}`,
      ].join("\n");

      const blob = new Blob([fallbackContent], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, `sustainability-report-${new Date().toISOString().split("T")[0]}.txt`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h3 className="text-lg font-semibold text-zinc-900">Report Settings</h3>
            <p className="text-xs text-zinc-500">Configure data extraction</p>

            <div className="mt-4 space-y-1 text-sm">
              {[
                { key: "standard", label: "Standard Report" },
                { key: "audit", label: "Categorical Audit" },
                { key: "trend", label: "Trend Analysis" },
                { key: "history", label: "Export History" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setMode(item.key as ReportMode)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition ${
                    mode === item.key
                      ? "bg-green-100 text-green-700"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {mode === item.key ? <Check size={14} /> : <Activity size={14} />}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              Date Range
            </p>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              <span>{dateWindow}</span>
              <CalendarDays size={14} className="text-zinc-400" />
            </div>

            <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              Impact Categories
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTER_CATEGORIES.map((item) => {
                const active = selectedCategories.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleCategory(item)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      active
                        ? "bg-green-500 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                Reports and Export Center
              </h1>
              <p className="text-sm text-zinc-500">
                Live preview of your sustainability impact data.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportCsv}
                disabled={isExportingCsv || loading}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
              >
                <FileDown size={16} />
                {isExportingCsv ? "Exporting..." : "Export CSV"}
              </button>
              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
              >
                <Download size={16} />
                {isExportingPdf ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-5 py-3 text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              Interactive Report Preview
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-4xl font-bold text-green-500">Impact Summary</h2>
                  <p className="mt-1 text-sm text-zinc-700">Prepared for: Sustainability Officer</p>
                  <p className="text-sm text-zinc-500">Reporting Period: {dateWindow}</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold text-zinc-900">
                    {totalCarbonTons.toFixed(1)}
                    <span className="text-lg font-medium text-zinc-500"> tonsCO₂e</span>
                  </p>
                  <p className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    {trendDeltaText}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="rounded-xl bg-zinc-50 p-4">
                  <div className="mb-2 inline-flex rounded-lg bg-green-100 p-2 text-green-600">
                    <Leaf size={14} />
                  </div>
                  <p className="text-xs text-zinc-500">Total Savings</p>
                  <p className="text-4xl font-bold text-zinc-900">
                    {summary.totalCarbon.toFixed(1)}kg
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <div className="mb-2 inline-flex rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Droplets size={14} />
                  </div>
                  <p className="text-xs text-zinc-500">Water Saved</p>
                  <p className="text-4xl font-bold text-zinc-900">
                    {summary.waterSaved.toFixed(1)}k L
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <div className="mb-2 inline-flex rounded-lg bg-amber-100 p-2 text-amber-600">
                    <Trash2 size={14} />
                  </div>
                  <p className="text-xs text-zinc-500">Diverted from Landfill</p>
                  <p className="text-4xl font-bold text-zinc-900">
                    {summary.wasteDiversionRate}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.9fr]">
                <div>
                  <p className="mb-2 text-sm font-semibold text-zinc-800">Emissions Trend (Last 30 Days)</p>
                  <div className="h-48 rounded-xl bg-zinc-50 p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <Tooltip
                          contentStyle={{
                            border: "1px solid #e4e4e7",
                            borderRadius: "10px",
                            backgroundColor: "#fff",
                          }}
                          formatter={(value) => {
                            const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                            return [`${numericValue.toFixed(2)} kg CO2e`, "Impact"];
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#22c55e"
                          strokeWidth={3}
                          dot={{ r: 3, fill: "#22c55e" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-zinc-800">Category Split</p>
                  <div className="flex h-48 items-center justify-center rounded-xl bg-zinc-50">
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-zinc-900">{dominantPercent}%</p>
                          <p className="text-xs text-zinc-500">
                            {dominantCategory?.category ?? "Energy"}
                          </p>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={summary.split}
                            dataKey="value"
                            nameKey="category"
                            innerRadius={52}
                            outerRadius={74}
                            stroke="none"
                          >
                            {summary.split.map((_, index) => (
                              <Cell
                                key={`slice-${index}`}
                                fill={IMPACT_COLORS[index % IMPACT_COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-zinc-800">Recent Activity Logs</p>
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-100 text-xs text-zinc-500">
                    <tr>
                      <th className="py-2 font-medium">Date</th>
                      <th className="py-2 font-medium">Action/Activity</th>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 text-right font-medium">Impact Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {activityRows.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-sm text-zinc-500">
                          No records available for the current filters.
                        </td>
                      </tr>
                    ) : (
                      activityRows.map((item) => {
                        const key = item.category.toLowerCase();
                        return (
                          <tr key={item.id}>
                            <td className="py-3 text-sm text-zinc-700">{item.dateLabel}</td>
                            <td className="py-3 text-sm text-zinc-900">{item.activityLabel}</td>
                            <td className="py-3">
                              <span
                                className={`rounded px-2 py-1 text-[10px] font-semibold uppercase ${
                                  categoryBadgeClass[key] ?? "bg-zinc-100 text-zinc-700"
                                }`}
                              >
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 text-right text-sm font-semibold text-green-600">
                              -{item.impact.toFixed(1)}kg CO₂
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between border-t border-zinc-100 px-5 py-3 text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              <p>© 2024 Sustainability Tracker Dashboard</p>
              <p>
                Report generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </section>
      </div>

      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow">
            Loading report data...
          </div>
        </div>
      )}
    </div>
  );
}
