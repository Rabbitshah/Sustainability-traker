import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CirclePlus,
  Sparkles,
  Cloud,
  Gauge,
  Flame,
  Lightbulb,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import AddLogForm from "../components/logsPage/AddLogForm";
import TrendChart from "../components/charts/TrendChart";
import CategoryDonut from "../components/charts/CategoryDonut";
import { emissionsApi, type EmissionRecord } from "../services/emissions";
import { api } from "../services/api";

type AdviceResponse = {
  status?: string;
  message: string;
};

type TotalKpiResponse = {
  total_emissions: number;
};

type CategoryKpiResponse = {
  category: string;
  value: number;
};

type MonthlyKpiResponse = {
  month: string;
  value: number;
};

type TrendPoint = {
  label: string;
  value: number;
};

const DAILY_GOAL_KG = 12;

const categoryBadge: Record<string, string> = {
  transport: "bg-blue-100 text-blue-700",
  travel: "bg-blue-100 text-blue-700",
  food: "bg-green-100 text-green-700",
  energy: "bg-amber-100 text-amber-700",
  waste: "bg-emerald-100 text-emerald-700",
};

const activityLabels: Record<string, string> = {
  transport: "Public Transit (Metro)",
  travel: "Travel Activity",
  food: "Plant-based Meal",
  energy: "Home Electricity",
  waste: "Waste Reduction",
};

const toISODate = (date: Date) => date.toISOString().split("T")[0];

const formatPercentDelta = (value: number) => {
  if (!Number.isFinite(value)) return "0%";
  const rounded = Math.round(Math.abs(value));
  return `${value >= 0 ? "+" : "-"}${rounded}%`;
};

const formatRelativeDate = (isoDate: string) => {
  const target = new Date(`${isoDate}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";

  return target.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRecordImpact = (record: EmissionRecord) =>
  Number(record.co2e_impact ?? record.value ?? 0);

export default function Dashboard() {
  const [allLogs, setAllLogs] = useState<EmissionRecord[]>([]);
  const [totalEmissionsKpi, setTotalEmissionsKpi] = useState(0);
  const [categoryDataKpi, setCategoryDataKpi] = useState<CategoryKpiResponse[]>([]);
  const [monthlyDataKpi, setMonthlyDataKpi] = useState<MonthlyKpiResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<AdviceResponse | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [logs, totalRes, categoryRes, monthlyRes] = await Promise.all([
        emissionsApi.list(),
        api.get("/kpis/total/"),
        api.get("/kpis/category/"),
        api.get("/kpis/monthly/"),
      ]);

      setAllLogs(
        logs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
      setTotalEmissionsKpi((totalRes.data as TotalKpiResponse).total_emissions ?? 0);
      setCategoryDataKpi((categoryRes.data as CategoryKpiResponse[]) ?? []);
      setMonthlyDataKpi((monthlyRes.data as MonthlyKpiResponse[]) ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const handleEmissionCreated = () => {
      loadDashboardData();
    };

    window.addEventListener("emission:created", handleEmissionCreated);
    return () => {
      window.removeEventListener("emission:created", handleEmissionCreated);
    };
  }, [loadDashboardData]);

  const getAIAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const res = await api.get("/kpis/ai_advice/");
      setAiAdvice(res.data as AdviceResponse);
    } catch (err) {
      console.error(err);
      setAiAdvice({
        status: "warning",
        message:
          "Unable to fetch AI insights right now. Please try again in a moment.",
      });
    } finally {
      setLoadingAdvice(false);
    }
  };

  const recentLogs = useMemo(() => allLogs.slice(0, 5), [allLogs]);

  const totalEmissions = useMemo(() => Number(totalEmissionsKpi ?? 0), [totalEmissionsKpi]);

  const categoryData = useMemo(
    () =>
      categoryDataKpi
        .map((item) => ({
          category: item.category,
          value: Number(item.value ?? 0),
        }))
        .sort((a, b) => b.value - a.value),
    [categoryDataKpi],
  );

  const monthlyData = useMemo(
    () =>
      monthlyDataKpi
        .map((item) => ({
          month: item.month.slice(0, 7),
          value: Number(item.value ?? 0),
        }))
        .sort((a, b) => a.month.localeCompare(b.month)),
    [monthlyDataKpi],
  );

  const dailyTotals = useMemo(() => {
    const byDay = new Map<string, number>();

    allLogs.forEach((log) => {
      const current = byDay.get(log.date) ?? 0;
      byDay.set(log.date, current + getRecordImpact(log));
    });

    return byDay;
  }, [allLogs]);

  const { todayFootprint, yesterdayFootprint, trendData } = useMemo(() => {
    const now = new Date();
    const todayIso = toISODate(now);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayIso = toISODate(yesterday);

    const builtTrend: TrendPoint[] = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date(now);
      day.setDate(now.getDate() - offset);
      const iso = toISODate(day);
      builtTrend.push({
        label: day
          .toLocaleDateString(undefined, { weekday: "short" })
          .toUpperCase(),
        value: Number((dailyTotals.get(iso) ?? 0).toFixed(2)),
      });
    }

    return {
      todayFootprint: dailyTotals.get(todayIso) ?? 0,
      yesterdayFootprint: dailyTotals.get(yesterdayIso) ?? 0,
      trendData: builtTrend,
    };
  }, [dailyTotals]);

  const footprintDeltaPct = useMemo(() => {
    if (yesterdayFootprint <= 0) return 0;
    return ((todayFootprint - yesterdayFootprint) / yesterdayFootprint) * 100;
  }, [todayFootprint, yesterdayFootprint]);

  const monthlyDeltaPct = useMemo(() => {
    if (monthlyData.length < 2) return 0;
    const previous = monthlyData[monthlyData.length - 2]?.value ?? 0;
    const current = monthlyData[monthlyData.length - 1]?.value ?? 0;
    if (previous <= 0) return 0;
    return ((current - previous) / previous) * 100;
  }, [monthlyData]);

  const ecoScore = useMemo(() => {
    const avgLast7 = trendData.reduce((sum, point) => sum + point.value, 0) / 7;
    const rawScore = 100 - avgLast7 * 1.8;
    return Math.max(0, Math.min(100, Math.round(rawScore)));
  }, [trendData]);

  const streakDays = useMemo(() => {
    const set = new Set(allLogs.map((log) => log.date));
    let streak = 0;
    const cursor = new Date();

    while (set.has(toISODate(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }, [allLogs]);

  const weeklyTotal = useMemo(
    () => trendData.reduce((sum, point) => sum + point.value, 0),
    [trendData],
  );

  const recommendationMessage = aiAdvice?.message
    ? aiAdvice.message
    : "Reducing red meat consumption this week could save you approximately 5.2 kg of CO2.";

  const goalMet = todayFootprint <= DAILY_GOAL_KG;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 transition-colors">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-zinc-50 p-6 text-zinc-900 transition-colors duration-300 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 transition-colors">
            User Dashboard Overview
          </h1>
          <p className="mt-1 text-zinc-500 transition-colors">
            Track your daily impact and eco-friendly progress
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setOpenLogModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
          >
            <CirclePlus size={16} />
            Add New Log
          </button>
          <button
            onClick={getAIAdvice}
            disabled={loadingAdvice}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 disabled:opacity-50"
          >
            <Sparkles size={16} />
            {loadingAdvice ? "Generating..." : "Generate AI Advice"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
              Today&apos;s Footprint
            </p>
            <Cloud size={16} className="text-slate-400" />
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 transition-colors">
            {todayFootprint.toFixed(1)} kg
            <span className="ml-2 text-base font-medium text-slate-400 transition-colors">
              CO2e
            </span>
          </p>
          <p
            className={`mt-2 text-sm font-semibold ${
              footprintDeltaPct <= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {formatPercentDelta(footprintDeltaPct)} vs yesterday
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
              Eco Score
            </p>
            <Gauge size={16} className="text-slate-400" />
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 transition-colors">
            {ecoScore}
            <span className="ml-2 text-base font-medium text-slate-400 transition-colors">
              /100
            </span>
          </p>
          <p
            className={`mt-2 text-sm font-semibold ${
              monthlyDeltaPct <= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {monthlyDeltaPct <= 0 ? "↗" : "↘"}{" "}
            {formatPercentDelta(-monthlyDeltaPct)} this month
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
              Consistency Streak
            </p>
            <Flame size={16} className="text-green-500" />
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 transition-colors">
            {streakDays} Days
          </p>
          <p
            className={`mt-2 text-sm font-semibold ${goalMet ? "text-green-600" : "text-red-500"}`}
          >
            {goalMet ? "● Daily Goal Met" : "● Above Daily Goal"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
          <TrendChart
            data={trendData}
            total={weeklyTotal}
            deltaText={`${formatPercentDelta(-Math.abs(footprintDeltaPct))} efficient`}
          />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
          <CategoryDonut data={categoryData} />
        </div>
      </div>

      <div
        className={`rounded-2xl border px-5 py-4 transition-colors ${
          aiAdvice?.status === "warning"
            ? "border-amber-200 bg-amber-50"
            : "border-green-200 bg-green-50"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
              <Lightbulb size={14} />
            </div>
            <div>
              <p className="font-semibold text-zinc-900 transition-colors">AI Personal Insight</p>
              <p className="text-sm text-zinc-700 transition-colors">{recommendationMessage}</p>
            </div>
          </div>

          <button
            onClick={getAIAdvice}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
            disabled={loadingAdvice}
          >
            {loadingAdvice ? "Loading..." : "View Recommendations"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 transition-colors">
          <p className="font-semibold text-zinc-900 transition-colors">Recent Activity</p>
          <Link
            to="/logs"
            className="text-xs font-semibold text-green-600 uppercase hover:text-green-700"
          >
            View All Logs
          </Link>
        </div>

        <table className="w-full text-left">
          <thead className="border-b border-zinc-100 bg-zinc-50 text-[10px] font-semibold tracking-[0.12em] text-slate-500 uppercase transition-colors">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Activity</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {recentLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-sm text-zinc-500 transition-colors"
                >
                  No activity yet. Add your first log to start tracking
                  progress.
                </td>
              </tr>
            ) : (
              recentLogs.map((log) => {
                const normalizedCategory = log.category.toLowerCase();
                const activity =
                  activityLabels[normalizedCategory] ??
                  `${log.category} Activity`;
                const impact = getRecordImpact(log);
                const isReduction = normalizedCategory !== "energy";

                return (
                  <tr key={log.id} className="transition-colors hover:bg-zinc-50">
                    <td className="px-5 py-3 text-sm text-zinc-700 transition-colors">
                      {formatRelativeDate(log.date)}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-900 transition-colors">
                      {activity}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${
                          categoryBadge[normalizedCategory] ??
                          "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3 text-right text-sm font-semibold ${
                        isReduction ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isReduction ? "-" : "+"}
                      {impact.toFixed(1)} kg
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={openLogModal}
        onClose={() => setOpenLogModal(false)}
        title="Record New Emission"
      >
        <AddLogForm
          onSubmit={async (data) => {
            try {
              await emissionsApi.create({
                ...data,
                unit: "kg",
              });
              setOpenLogModal(false);
              await loadDashboardData();
            } catch (error) {
              console.error("Failed to create log:", error);
              alert("Failed to save log. Please check if you are logged in.");
            }
          }}
        />
      </Modal>

      <div className="sr-only">
        Total tracked emissions: {totalEmissions.toFixed(2)} kg
      </div>
    </div>
  );
}
