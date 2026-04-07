import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Car,
  Zap,
  UtensilsCrossed,
  Trash2,
  ShieldCheck,
  History,
  Bike,
  Bus,
  Check,
  Trees,
  TrendingDown,
  AlertCircle,
  Recycle,
} from "lucide-react";
import {
  emissionsApi,
  type EmissionCategory,
  type EmissionRecord,
} from "../services/emissions";

type CategoryKey = "Travel" | "Energy" | "Food" | "Waste";
type TransportMode = "Car" | "Transit" | "Bike/Walk";
type DietType = "Meat-based (Omnivore)" | "Balanced" | "Plant-based";

const categoryToBackend: Record<CategoryKey, EmissionCategory> = {
  Travel: "Transport",
  Energy: "Energy",
  Food: "Food",
  Waste: "Waste",
};

const impactFactor = {
  Travel: 0.21,
  Energy: 0.82,
  Food: 0.6,
  Waste: 0.52,
};

const formatShortDate = (isoDate: string) => {
  const target = new Date(`${isoDate}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";

  return target.toLocaleDateString(undefined, { weekday: "long" });
};

export default function Logs() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("Travel");
  const [transportMode, setTransportMode] = useState<TransportMode>("Car");
  const [distanceKm, setDistanceKm] = useState(15);
  const [electricity, setElectricity] = useState(12.4);
  const [renewable, setRenewable] = useState(true);
  const [dietType, setDietType] = useState<DietType>("Meat-based (Omnivore)");
  const [localSourcedMeals, setLocalSourcedMeals] = useState(false);
  const [wasteActions, setWasteActions] = useState<string[]>([
    "Full Recycling",
    "Zero Single-use Plastic",
  ]);

  const [loading, setLoading] = useState(false);
  const [recentLogs, setRecentLogs] = useState<EmissionRecord[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadRecentLogs = useCallback(async () => {
    try {
      const rows = await emissionsApi.list();
      const sorted = rows.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setRecentLogs(sorted.slice(0, 3));
    } catch (error) {
      console.error("Failed to load recent logs", error);
    }
  }, []);

  useEffect(() => {
    loadRecentLogs();
  }, [loadRecentLogs]);

  const travelValue = useMemo(() => {
    if (transportMode === "Bike/Walk") return 0;
    if (transportMode === "Transit") return distanceKm * 0.6;
    return distanceKm;
  }, [distanceKm, transportMode]);

  const foodBase = useMemo(() => {
    if (dietType === "Plant-based") return 2.8;
    if (dietType === "Balanced") return 4.1;
    return 6.2;
  }, [dietType]);

  const foodValue = useMemo(
    () => (localSourcedMeals ? foodBase * 0.8 : foodBase),
    [foodBase, localSourcedMeals],
  );

  const wasteValue = useMemo(() => Math.max(0.5, 4 - wasteActions.length * 0.9), [wasteActions]);

  const entryValue = useMemo(() => {
    if (activeCategory === "Travel") return Number(travelValue.toFixed(2));
    if (activeCategory === "Energy") {
      const adjusted = renewable ? electricity * 0.7 : electricity;
      return Number(adjusted.toFixed(2));
    }
    if (activeCategory === "Food") return Number(foodValue.toFixed(2));
    return Number(wasteValue.toFixed(2));
  }, [activeCategory, travelValue, renewable, electricity, foodValue, wasteValue]);

  const estimatedImpact = useMemo(
    () => Number((entryValue * impactFactor[activeCategory]).toFixed(2)),
    [entryValue, activeCategory],
  );

  const dailyLimit = 20;
  const dailyUsagePct = Math.min(100, Math.round((estimatedImpact / dailyLimit) * 100));
  const treesEquivalent = (estimatedImpact / 5).toFixed(1);

  const toggleWasteAction = (action: string) => {
    setWasteActions((previous) =>
      previous.includes(action)
        ? previous.filter((item) => item !== action)
        : [...previous, action],
    );
  };

  const handleDiscard = () => {
    setTransportMode("Car");
    setDistanceKm(15);
    setElectricity(12.4);
    setRenewable(true);
    setDietType("Meat-based (Omnivore)");
    setLocalSourcedMeals(false);
    setWasteActions(["Full Recycling", "Zero Single-use Plastic"]);
    setFeedback("Draft discarded");
  };

  const handleSave = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      await emissionsApi.create({
        category: categoryToBackend[activeCategory],
        value: entryValue,
        unit: activeCategory === "Travel" ? "km" : "kg",
        date: new Date().toISOString().split("T")[0],
      });
      await loadRecentLogs();
      window.dispatchEvent(new Event("emission:created"));
      setFeedback("Entry saved successfully");
    } catch (error) {
      console.error("Failed to save entry", error);
      setFeedback("Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  const categoryButton = (
    item: CategoryKey,
    icon: React.ReactNode,
    label: string,
  ) => (
    <button
      key={item}
      onClick={() => setActiveCategory(item)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
        activeCategory === item
          ? "bg-green-100 text-green-700"
          : "text-zinc-600 hover:bg-zinc-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-50 p-6 transition-colors duration-300 lg:p-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[250px_1fr_320px]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
            <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              Categories
            </p>
            <div className="space-y-1">
              {categoryButton("Travel", <Car className="h-4 w-4" />, "Travel")}
              {categoryButton("Energy", <Zap className="h-4 w-4" />, "Energy")}
              {categoryButton("Food", <UtensilsCrossed className="h-4 w-4" />, "Food")}
              {categoryButton("Waste", <Trash2 className="h-4 w-4" />, "Waste")}
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 transition-colors">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-green-600">
              Pro Tip
            </p>
            <p className="mt-2 text-sm leading-relaxed text-green-800">
              Logging your commute daily increases the accuracy of your monthly
              offset recommendations by 45%.
            </p>
          </div>
        </aside>

        <main className="space-y-5">
          <header>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
              Log Daily Activity
            </h1>
            <p className="text-zinc-500">
              Detailed data entry for today, {new Date().toLocaleDateString()}.
            </p>
          </header>

          <section className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
            <div className="mb-4 flex items-center gap-2 text-4xl font-semibold text-zinc-900">
              <span className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Car className="h-4 w-4" />
              </span>
              Travel Details
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700">Transport Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { label: "Car", icon: <Car className="h-4 w-4" /> },
                    { label: "Transit", icon: <Bus className="h-4 w-4" /> },
                    { label: "Bike/Walk", icon: <Bike className="h-4 w-4" /> },
                  ] as const).map((mode) => (
                    <button
                      key={mode.label}
                      onClick={() => setTransportMode(mode.label)}
                      className={`rounded-xl border px-3 py-3 text-center text-xs font-semibold transition ${
                        transportMode === mode.label
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="mb-1 flex justify-center">{mode.icon}</div>
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700">Distance Travelled (km)</p>
                <input
                  type="number"
                  min={0}
                  value={distanceKm}
                  onChange={(event) => setDistanceKm(Number(event.target.value) || 0)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-green-500"
                  placeholder="e.g. 15"
                />
                <p className="mt-2 text-xs text-zinc-400">Average commute is ~12km</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
            <div className="mb-4 flex items-center gap-2 text-4xl font-semibold text-zinc-900">
              <span className="rounded-lg bg-amber-100 p-2 text-amber-600">
                <Zap className="h-4 w-4" />
              </span>
              Energy & Utility
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-700">
                  <span>Daily Electricity Usage (kWh)</span>
                  <span className="font-semibold text-zinc-900">{electricity.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={0.1}
                  value={electricity}
                  onChange={(event) => setElectricity(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-green-500"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={renewable}
                  onChange={(event) => setRenewable(event.target.checked)}
                  className="h-4 w-4 accent-green-500"
                />
                Using Renewable Source
              </label>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-3xl font-semibold text-zinc-900">
                <span>🍜</span> Food Habits
              </div>
              <label className="text-sm font-medium text-zinc-700">Primary Diet Today</label>
              <select
                value={dietType}
                onChange={(event) => setDietType(event.target.value as DietType)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-green-500"
              >
                <option>Meat-based (Omnivore)</option>
                <option>Balanced</option>
                <option>Plant-based</option>
              </select>

              <label className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={localSourcedMeals}
                  onChange={(event) => setLocalSourcedMeals(event.target.checked)}
                  className="h-4 w-4 accent-green-500"
                />
                Locally Sourced Meals
              </label>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-3xl font-semibold text-zinc-900">
                <Recycle className="h-5 w-5 text-green-600" /> Waste & Plastic
              </div>
              <p className="text-sm text-zinc-700">What did you manage today?</p>
              <div className="mt-3 space-y-2">
                {["Full Recycling", "Composting", "Zero Single-use Plastic", "Reusable Bag Used"].map(
                  (action) => {
                    const active = wasteActions.includes(action);
                    return (
                      <button
                        key={action}
                        onClick={() => toggleWasteAction(action)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          active
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {action}
                      </button>
                    );
                  },
                )}
              </div>
            </section>
          </div>
        </main>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-linear-to-br from-zinc-900 via-zinc-900 to-green-950 p-5 text-white">
            <p className="text-xs font-medium text-zinc-300">Estimated Impact</p>
            <p className="mt-2 text-6xl font-bold">
              {estimatedImpact.toFixed(1)} <span className="text-2xl text-green-400">kg CO2e</span>
            </p>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-300 uppercase">
                <span>Daily Limit</span>
                <span>{dailyUsagePct}% reached</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-green-500" style={{ width: `${dailyUsagePct}%` }} />
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm text-zinc-200">
              <p className="flex items-start gap-2">
                <Trees className="mt-0.5 h-4 w-4 text-green-400" />
                Equivalent to <span className="font-semibold text-white">{treesEquivalent} trees</span> planted today.
              </p>
              <p className="flex items-start gap-2">
                <TrendingDown className="mt-0.5 h-4 w-4 text-green-400" />
                <span className="font-semibold text-white">12% lower</span> than your usual Thursday.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-lg font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
          >
            <ShieldCheck className="h-5 w-5" /> {loading ? "Saving..." : "Save Entry"}
          </button>

          <button
            onClick={handleDiscard}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-500 hover:bg-zinc-50"
          >
            Discard Draft
          </button>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              <History className="h-3 w-3" /> Recent Logs
            </p>
            <div className="space-y-2">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-zinc-500">No recent entries yet.</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">{formatShortDate(log.date)}</span>
                    <span className="font-semibold text-zinc-800">
                      {(log.co2e_impact || log.value).toFixed(1)} kg
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {feedback && (
            <div
              className={`rounded-xl border p-3 text-sm font-medium ${
                feedback.includes("success")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : feedback.includes("discard")
                    ? "border-zinc-200 bg-zinc-50 text-zinc-700"
                    : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {feedback}
              </span>
            </div>
          )}

          <div className="rounded-xl border-t border-zinc-200 pt-4 text-[11px] text-zinc-400">
            <p className="mb-2">Your data is encrypted and used only for calculation.</p>
            <div className="flex items-center gap-4 uppercase tracking-wider">
              <span>API Docs</span>
              <span>Privacy Policy</span>
              <span>Help Center</span>
            </div>
          </div>
        </aside>
      </div>

      {feedback && feedback.includes("success") && (
        <div className="fixed bottom-5 right-6 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow">
          <span className="inline-flex items-center gap-1">
            <Check className="h-4 w-4" /> Entry added to your log history
          </span>
        </div>
      )}
    </div>
  );
}
