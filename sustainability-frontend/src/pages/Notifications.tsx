import { useMemo, useState } from "react";
import {
  Bell,
  Lightbulb,
  Bike,
  AlertTriangle,
  Users,
  Check,
} from "lucide-react";

type NotificationTab = "all" | "achievements" | "ai" | "tips";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  category: NotificationTab;
  section: "today" | "yesterday";
  unread: boolean;
  icon: "achievement" | "ai" | "activity" | "warning" | "community";
  actions?: { primary?: string; secondary?: string };
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New Milestone: Plastic Free Week!",
    message:
      "You’ve successfully completed 7 days without single-use plastics. You’ve saved approximately 1.2kg of waste!",
    time: "2h ago",
    category: "achievements",
    section: "today",
    unread: true,
    icon: "achievement",
    actions: { primary: "Share Impact", secondary: "Details" },
  },
  {
    id: 2,
    title: "AI Smart Tip: Energy Optimization",
    message:
      "Based on your recent utility sync, you could save 15% on energy by shifting laundry cycles to after 9 PM.",
    time: "5h ago",
    category: "ai",
    section: "today",
    unread: true,
    icon: "ai",
  },
  {
    id: 3,
    title: "Activity Logged: Commute",
    message:
      "Your 12km bike commute yesterday saved 3.4kg of CO2 emissions compared to driving.",
    time: "1d ago",
    category: "tips",
    section: "yesterday",
    unread: false,
    icon: "activity",
  },
  {
    id: 4,
    title: "Goal Off-Track: Water Usage",
    message:
      "You are currently 15% over your water usage goal for the week. Try shorter showers to get back on track!",
    time: "1d ago",
    category: "tips",
    section: "yesterday",
    unread: false,
    icon: "warning",
  },
  {
    id: 5,
    title: "New Local Recycling Event",
    message:
      "A tech waste recycling drive is happening this Saturday at Town Square. Earn 500 bonus Eco-Points for participating!",
    time: "1d ago",
    category: "all",
    section: "yesterday",
    unread: false,
    icon: "community",
  },
];

const iconNode = (icon: NotificationItem["icon"]) => {
  if (icon === "ai") return <Lightbulb className="h-4 w-4" />;
  if (icon === "activity") return <Bike className="h-4 w-4" />;
  if (icon === "warning") return <AlertTriangle className="h-4 w-4" />;
  if (icon === "community") return <Users className="h-4 w-4" />;
  return <Bell className="h-4 w-4" />;
};

const iconClass = (icon: NotificationItem["icon"]) => {
  if (icon === "ai") return "bg-blue-100 text-blue-600";
  if (icon === "activity") return "bg-zinc-100 text-zinc-600";
  if (icon === "warning") return "bg-amber-100 text-amber-600";
  if (icon === "community") return "bg-zinc-100 text-zinc-500";
  return "bg-green-100 text-green-600";
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [joinedChallenge, setJoinedChallenge] = useState(false);

  const filtered = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((item) => item.category === activeTab);
  }, [activeTab, notifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const todayItems = filtered.filter((item) => item.section === "today");
  const yesterdayItems = filtered.filter((item) => item.section === "yesterday");

  return (
    <div className="min-h-screen bg-zinc-50 p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-zinc-900">Updates</h1>
              <p className="text-zinc-500">Track your impact and stay on top of your green journey.</p>
            </div>
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              <Check className="h-4 w-4" /> Mark all as read
            </button>
          </div>

          <div className="mb-5 flex gap-6 border-b border-zinc-200">
            {([
              ["all", "All Notifications"],
              ["achievements", "Achievements"],
              ["ai", "AI Reminders"],
              ["tips", "Tips"],
            ] as [NotificationTab, string][]).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                  activeTab === id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">Today</p>
            {todayItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${iconClass(item.icon)}`}>{iconNode(item.icon)}</div>
                    <div>
                      <p className="text-2xl font-semibold text-zinc-900">{item.title}</p>
                      <p className="mt-1 text-zinc-600">{item.message}</p>

                      {item.actions && (
                        <div className="mt-3 flex gap-2">
                          {item.actions.primary ? (
                            <button className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-semibold text-white">
                              {item.actions.primary}
                            </button>
                          ) : null}
                          {item.actions.secondary ? (
                            <button className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-zinc-600">
                              {item.actions.secondary}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-zinc-400">{item.time}</p>
                    {item.unread && <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />}
                  </div>
                </div>
              </article>
            ))}

            <p className="pt-2 text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">Yesterday</p>
            {yesterdayItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${iconClass(item.icon)}`}>{iconNode(item.icon)}</div>
                    <div>
                      <p className="text-2xl font-semibold text-zinc-900">{item.title}</p>
                      <p className="mt-1 text-zinc-600">{item.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">{item.time}</p>
                    {item.unread && <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-green-500" />}
                  </div>
                </div>
              </article>
            ))}

            <div className="pt-4 text-center">
              <button className="rounded-xl border border-zinc-200 bg-white px-6 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
                Load Older Notifications
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <h2 className="text-sm font-black tracking-[0.14em] text-green-600 uppercase">Impact Summary</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-zinc-700">
                <span>CO2 Saved</span>
                <span className="font-semibold">42.5 kg</span>
              </div>
              <div className="flex items-center justify-between text-zinc-700">
                <span>Water Conserved</span>
                <span className="font-semibold">120 L</span>
              </div>
              <div className="flex items-center justify-between text-zinc-700">
                <span>Active Streaks</span>
                <span className="font-semibold">5 Days</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">Upcoming Reminders</h2>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl bg-zinc-100 p-3">
                <p className="text-sm font-semibold text-zinc-900">Empty Compost Bin</p>
                <p className="text-xs text-zinc-500">Today • 6:00 PM</p>
              </div>
              <div className="rounded-xl bg-zinc-100 p-3">
                <p className="text-sm font-semibold text-zinc-900">Water Office Plants</p>
                <p className="text-xs text-zinc-500">Tomorrow • 9:00 AM</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-green-500 p-4 text-zinc-900">
            <p className="text-xs font-black tracking-[0.14em] uppercase">Weekly Challenge</p>
            <h3 className="mt-1 text-4xl font-bold">Meatless Monday Marathon</h3>
            <div className="mt-3 flex items-center justify-between text-sm font-semibold">
              <span>+24 participants</span>
              <span>2 days left</span>
            </div>
            <button
              onClick={() => setJoinedChallenge((prev) => !prev)}
              className="mt-3 w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white"
            >
              {joinedChallenge ? "Joined" : "Join Now"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
