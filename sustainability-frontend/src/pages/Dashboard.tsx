import { useState, useEffect, useCallback } from "react";
import Modal from "../components/ui/Modal";
import AddLogForm from "../components/logs/AddLogForm";
import TrendChart from "../components/charts/TrendChart";
import CategoryDonut from "../components/charts/CategoryDonut";
import { kpiApi } from "../services/kpi";
import { emissionsApi } from "../services/emissions";
import { api } from "../services/api";

export default function Dashboard() {
  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState<any | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [total, cat, mon, logs] = await Promise.all([
        kpiApi.total(),
        kpiApi.category(),
        kpiApi.monthly(),
        emissionsApi.list(),
      ]);
      setTotalEmissions(total.total_emissions);
      setCategoryData(cat);
      setMonthlyData(mon);
      setRecentLogs(logs.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const getAIAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const res = await api.get("/kpis/ai_advice/");
      setAiAdvice(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Sustainability Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time carbon footprint analysis.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={getAIAdvice}
            disabled={loadingAdvice}
            className="bg-white border px-5 py-2.5 rounded-xl font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingAdvice ? "⏳ Thinking..." : "✨ Get AI Insights"}
          </button>
          <button
            onClick={() => setOpenLogModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
          >
            + Add Log
          </button>
        </div>
      </div>

      {aiAdvice && (
        <div
          className={`p-5 rounded-2xl border transition-all animate-in slide-in-from-top-2 ${
            aiAdvice.status === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}
        >
          <p className="font-bold flex items-center gap-2 mb-1">
            <span>{aiAdvice.status === "warning" ? "⚠️" : "💡"}</span> AI
            Analysis
          </p>
          <p className="text-sm font-medium">{aiAdvice.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Emissions",
            value: `${totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO2e`,
            sub: "Live Data",
          },
          {
            label: "Active Categories",
            value: categoryData.length,
            sub: "Sources tracked",
          },
          {
            label: "Recent Logs",
            value: recentLogs.length,
            sub: "Data points",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {card.label}
            </p>
            <p className="text-3xl font-extrabold mt-2 text-gray-900">
              {card.value}
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-96">
          <TrendChart data={monthlyData} />
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-96">
          <CategoryDonut data={categoryData} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">CO2e Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm">
                  {new Date(log.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                    {log.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-right">
                  {log.co2e_impact || (log.value * 0.85).toFixed(2)} kg
                </td>
              </tr>
            ))}
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
            await emissionsApi.create({ company: 1, ...data });
            setOpenLogModal(false);
            loadDashboardData();
          }}
        />
      </Modal>
    </div>
  );
}
