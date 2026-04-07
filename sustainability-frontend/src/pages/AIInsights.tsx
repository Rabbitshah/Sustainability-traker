import { useMemo, useState } from "react";
import {
  RotateCcw,
  Bolt,
  MessageSquareText,
  Send,
  Check,
} from "lucide-react";
import { api } from "../services/api";

type Recommendation = {
  id: number;
  title: string;
  subtitle: string;
  reduction: string;
  difficulty: "Low" | "Medium";
  badge: string;
  badgeClass: string;
};

type PlanStep = {
  id: number;
  window: string;
  title: string;
  tasks: { id: number; text: string; done: boolean }[];
};

type ChatItem = {
  id: number;
  role: "assistant" | "user";
  text: string;
  time: string;
};

const initialRecommendations: Recommendation[] = [
  {
    id: 1,
    title: "Switch to Public Transport",
    subtitle: "Potential reduction",
    reduction: "25kg CO2/wk",
    difficulty: "Low",
    badge: "High Impact",
    badgeClass: "bg-green-500",
  },
  {
    id: 2,
    title: "Energy Optimization",
    subtitle: "Potential reduction",
    reduction: "12kg CO2/wk",
    difficulty: "Medium",
    badge: "Smart Choice",
    badgeClass: "bg-blue-500",
  },
  {
    id: 3,
    title: "Reduce Office Waste",
    subtitle: "Potential reduction",
    reduction: "5kg CO2/wk",
    difficulty: "Low",
    badge: "Quick Win",
    badgeClass: "bg-orange-500",
  },
];

const initialPlan: PlanStep[] = [
  {
    id: 1,
    window: "Days 1-2 • Setup & Transit",
    title: "Audit commuting habits",
    tasks: [
      { id: 1, text: "Download local transit app and map out office route.", done: true },
      { id: 2, text: "Commit to one 'car-free' commute day.", done: false },
    ],
  },
  {
    id: 2,
    window: "Days 3-5 • Energy Efficiency",
    title: "Smart device scheduling",
    tasks: [
      { id: 1, text: "Configure smart thermostat to eco-mode during sleep hours.", done: false },
      { id: 2, text: "Unplug 'vampire' appliances in the kitchen.", done: false },
    ],
  },
  {
    id: 3,
    window: "Days 6-7 • Maintenance",
    title: "Zero-waste weekend",
    tasks: [
      { id: 1, text: "Try a meat-free recipe for Sunday dinner.", done: false },
      { id: 2, text: "Check local recycling guidelines for electronics.", done: false },
    ],
  },
];

const initialChat: ChatItem[] = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! I've analyzed your utility bills and commute patterns. How can I help you reach your net-zero goal today?",
    time: "10:45 AM",
  },
  {
    id: 2,
    role: "user",
    text: "How can I further reduce my office's electricity consumption?",
    time: "10:46 AM",
  },
  {
    id: 3,
    role: "assistant",
    text: "Based on your data, your office peaks at 2 PM. Try setting monitor brightness to 70% and ensure all peripherals are on a smart power strip that cuts off at 6 PM. This could save another 4kg CO2 monthly.",
    time: "10:47 AM",
  },
];

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const recommendationPreview = [
  "Office Waste",
  "Lower heating costs",
  "Transit gains",
];

export default function AIInsights() {
  const [recommendations] = useState<Recommendation[]>(initialRecommendations);
  const [adoptedIds, setAdoptedIds] = useState<number[]>([]);
  const [planSteps, setPlanSteps] = useState<PlanStep[]>(initialPlan);
  const [chat, setChat] = useState<ChatItem[]>(initialChat);
  const [message, setMessage] = useState("");
  const [loadingRegenerate, setLoadingRegenerate] = useState(false);
  const [liveStatus, setLiveStatus] = useState(
    "AI model updated 2 hours ago • Analyzing real-time trends",
  );

  const completedTaskCount = useMemo(
    () =>
      planSteps.reduce(
        (total, step) => total + step.tasks.filter((task) => task.done).length,
        0,
      ),
    [planSteps],
  );

  const totalTaskCount = useMemo(
    () => planSteps.reduce((total, step) => total + step.tasks.length, 0),
    [planSteps],
  );

  const toggleTask = (stepId: number, taskId: number) => {
    setPlanSteps((previous) =>
      previous.map((step) =>
        step.id !== stepId
          ? step
          : {
              ...step,
              tasks: step.tasks.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task,
              ),
            },
      ),
    );
  };

  const adoptRecommendation = (id: number) => {
    setAdoptedIds((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
  };

  const regenerateInsights = async () => {
    setLoadingRegenerate(true);
    try {
      const response = await api.get("/kpis/ai_advice/");
      const content =
        typeof response.data?.message === "string"
          ? response.data.message
          : "Insights refreshed using your latest activity trends.";
      setLiveStatus(`Updated just now • ${content}`);

      setChat((previous) => [
        ...previous,
        {
          id: Date.now(),
          role: "assistant",
          text: content,
          time: nowTime(),
        },
      ]);
    } catch {
      setLiveStatus("Unable to refresh from server • Using latest local trends");
    } finally {
      setLoadingRegenerate(false);
    }
  };

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMsg: ChatItem = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: nowTime(),
    };

    const assistantMsg: ChatItem = {
      id: Date.now() + 1,
      role: "assistant",
      text: "Great question. Start with transport and HVAC first—they have the largest and fastest ROI in your current profile.",
      time: nowTime(),
    };

    setChat((previous) => [...previous, userMsg, assistantMsg]);
    setMessage("");
  };

  return (
    <div className="min-h-screen space-y-6 bg-zinc-50 p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
            AI Sustainability Insights
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-green-500" /> {liveStatus}
          </p>
        </div>
        <button
          onClick={regenerateInsights}
          disabled={loadingRegenerate}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
        >
          <RotateCcw size={14} />
          {loadingRegenerate ? "Refreshing..." : "Regenerate"}
        </button>
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-3xl font-semibold text-zinc-900">
          <Bolt className="h-5 w-5 text-green-500" /> Immediate Recommendations
        </h2>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {recommendations.map((item, index) => {
            const adopted = adoptedIds.includes(item.id);
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div className="relative mb-4 h-36 overflow-hidden rounded-xl bg-zinc-100">
                  <div
                    className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-black uppercase text-white ${item.badgeClass}`}
                  >
                    {item.badge}
                  </div>
                  <div className="h-full w-full bg-linear-to-br from-zinc-200 via-zinc-100 to-zinc-200" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-bold text-zinc-400">
                    {index === 0 ? "BUS" : index === 1 ? "ENERGY" : "WASTE"}
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-xs text-zinc-500">
                  {item.subtitle}: <span className="font-semibold text-green-500">{item.reduction}</span>
                </p>
                <p className="text-xs text-zinc-500">Difficulty: {item.difficulty}</p>

                <button
                  onClick={() => adoptRecommendation(item.id)}
                  disabled={adopted}
                  className="mt-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:border-green-200 disabled:bg-green-50 disabled:text-green-700"
                >
                  {adopted ? "Adopted" : "Adopt Recommendation"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-semibold text-zinc-900">Action Plan: Next 7 Days</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Generated Today
            </span>
          </div>

          <div className="space-y-4">
            {planSteps.map((step) => (
              <div key={step.id} className="relative pl-6">
                <span className="absolute left-1 top-3 h-2 w-2 rounded-full bg-green-500" />
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-green-500">
                    {step.window}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-zinc-900">{step.title}</h3>
                  <div className="mt-3 space-y-2">
                    {step.tasks.map((task) => (
                      <label key={task.id} className="flex items-start gap-2 text-sm text-zinc-600">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(step.id, task.id)}
                          className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-green-500"
                        />
                        <span className={task.done ? "line-through text-zinc-400" : ""}>{task.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs font-medium text-zinc-500">
            Progress: {completedTaskCount}/{totalTaskCount} tasks completed
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 flex items-center gap-2 text-3xl font-semibold text-zinc-900">
            <MessageSquareText className="h-5 w-5 text-green-500" /> Ask AI Expert
          </h2>

          <div className="h-108 space-y-3 overflow-y-auto rounded-xl bg-zinc-50 p-3">
            {chat.map((item) => (
              <div
                key={item.id}
                className={`max-w-[92%] rounded-xl px-3 py-2 text-sm ${
                  item.role === "assistant"
                    ? "bg-white text-zinc-700"
                    : "ml-auto bg-green-500 text-white"
                }`}
              >
                <p>{item.text}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    item.role === "assistant" ? "text-zinc-400" : "text-green-100"
                  }`}
                >
                  {item.role === "assistant" ? "AI Assistant" : "You"} • {item.time}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {recommendationPreview.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="Ask about your habits..."
                className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-zinc-400"
              />
              <button
                onClick={sendMessage}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {adoptedIds.length > 0 && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          <span className="inline-flex items-center gap-1">
            <Check size={14} /> {adoptedIds.length} recommendation(s) adopted.
          </span>
        </div>
      )}
    </div>
  );
}
