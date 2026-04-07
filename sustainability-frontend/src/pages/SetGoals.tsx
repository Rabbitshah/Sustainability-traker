import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, X, Circle, Footprints, Recycle, Zap, ArrowRight } from "lucide-react";

type GoalOption = "co2" | "recycling" | "energy";

type OptionItem = {
  id: GoalOption;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const options: OptionItem[] = [
  {
    id: "co2",
    title: "Reduce CO2 Footprint",
    description:
      "Track and lower emissions from your daily commute, long-distance travel, and dietary choices.",
    icon: <Footprints className="h-4 w-4" />,
  },
  {
    id: "recycling",
    title: "Improve Recycling Habits",
    description:
      "Master the art of sorting waste. Get localized guides on what can and cannot be recycled.",
    icon: <Recycle className="h-4 w-4" />,
  },
  {
    id: "energy",
    title: "Save Energy at Home",
    description:
      "Reduce electricity and gas bills by optimizing appliance usage and identifying energy leaks.",
    icon: <Zap className="h-4 w-4" />,
  },
];

export default function SetGoals() {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<GoalOption>("co2");

  const handleContinue = () => {
    localStorage.setItem("primaryGoal", selectedGoal);
    navigate("/goals");
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 text-white">
            <Leaf size={14} />
          </div>
          <span className="text-2xl font-semibold text-zinc-900">Sustainability Tracker</span>
        </div>

        <Link
          to="/goals"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500 transition hover:bg-zinc-300"
          aria-label="Close"
        >
          <X size={18} />
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-6">
            <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              Step 1 of 3
            </p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-3xl font-semibold text-zinc-900">Setting up your profile</p>
              <p className="text-sm font-semibold text-green-600">33% Complete</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full w-1/3 bg-green-500" />
            </div>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-zinc-900">What is your primary goal?</h1>
              <p className="mt-2 text-zinc-500">
                Select the area you want to focus on first. We&apos;ll tailor your dashboard and recommendations based on your choice.
              </p>
            </div>

            <div className="space-y-3">
              {options.map((item) => {
                const active = selectedGoal === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGoal(item.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-green-500 bg-green-50"
                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <Circle
                          className={`h-4 w-4 ${active ? "fill-green-500 text-green-500" : "text-zinc-300"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="flex items-center gap-2 text-2xl font-semibold text-zinc-900">
                          <span className={active ? "text-green-600" : "text-zinc-500"}>{item.icon}</span>
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-600">{item.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-6 py-5">
            <button
              type="button"
              onClick={() => navigate("/goals")}
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-700"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
