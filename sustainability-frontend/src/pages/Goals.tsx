import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Flame,
  Bike,
  Droplets,
  Zap,
  Leaf,
  Lock,
  Target,
  PlusCircle,
} from "lucide-react";

type GoalStatus = "in-progress" | "critical" | "almost-there";
type BadgeFilter = "all" | "unlocked" | "locked";

type GoalItem = {
  id: number;
  icon: "co2" | "water" | "bike";
  title: string;
  description: string;
  progress: number;
  progressText: string;
  daysLeft: string;
  status: GoalStatus;
};

type BadgeItem = {
  id: number;
  icon: "leaf" | "zap" | "flame" | "lock";
  label: string;
  date: string;
  unlocked: boolean;
};

type MilestoneItem = {
  id: number;
  period: string;
  title: string;
  note: string;
};

const initialGoals: GoalItem[] = [
  {
    id: 1,
    icon: "co2",
    title: "Reduce CO2 by 10%",
    description: "Monthly household energy consumption target.",
    progress: 65,
    progressText: "6.5kg / 10kg",
    daysLeft: "12 days left",
    status: "in-progress",
  },
  {
    id: 2,
    icon: "water",
    title: "Water Wise",
    description: "Limit shower time to under 5 minutes daily.",
    progress: 20,
    progressText: "4 / 20 days",
    daysLeft: "5 days left",
    status: "critical",
  },
  {
    id: 3,
    icon: "bike",
    title: "Green Commuter",
    description: "Bike to work at least 3 times per week.",
    progress: 92,
    progressText: "11 / 12 trips",
    daysLeft: "2 days left",
    status: "almost-there",
  },
];

const badges: BadgeItem[] = [
  {
    id: 1,
    icon: "leaf",
    label: "Eco Starter",
    date: "EARNED NOV 12",
    unlocked: true,
  },
  {
    id: 2,
    icon: "zap",
    label: "Watt-Saver",
    date: "EARNED DEC 04",
    unlocked: true,
  },
  {
    id: 3,
    icon: "flame",
    label: "7-Day Streak",
    date: "EARNED DEC 15",
    unlocked: true,
  },
  {
    id: 4,
    icon: "lock",
    label: "Solar Pioneer",
    date: "LOCKED",
    unlocked: false,
  },
  { id: 5, icon: "lock", label: "Waste Zero", date: "LOCKED", unlocked: false },
  { id: 6, icon: "lock", label: "Dirt Hero", date: "LOCKED", unlocked: false },
];

const milestones: MilestoneItem[] = [
  {
    id: 1,
    period: "Yesterday",
    title: "Completed 'Meat-free Week'",
    note: "Reduced food impact by 4.2kg this week.",
  },
  {
    id: 2,
    period: "3 days ago",
    title: "Reached 10-day activity streak",
    note: "Consistent low-emission entries unlocked a new badge.",
  },
  {
    id: 3,
    period: "Last week",
    title: "Saved 42kg CO2 this month",
    note: "Your transport and energy choices are creating measurable impact.",
  },
];

const statusStyles: Record<GoalStatus, string> = {
  "in-progress": "bg-green-50 text-green-600",
  critical: "bg-orange-50 text-orange-600",
  "almost-there": "bg-emerald-50 text-emerald-500",
};

const statusText: Record<GoalStatus, string> = {
  "in-progress": "In Progress",
  critical: "Critical",
  "almost-there": "Almost There",
};

const goalIcon = (icon: GoalItem["icon"]) => {
  if (icon === "water") return <Droplets className="h-4 w-4" />;
  if (icon === "bike") return <Bike className="h-4 w-4" />;
  return <span className="text-xs font-bold">CO₂</span>;
};

const badgeIcon = (icon: BadgeItem["icon"], unlocked: boolean) => {
  const className = `h-8 w-8 ${unlocked ? "text-green-500" : "text-slate-300"}`;
  if (icon === "zap") return <Zap className={className} />;
  if (icon === "flame") return <Flame className={className} />;
  if (icon === "lock") return <Lock className={className} />;
  return <Leaf className={className} />;
};

export default function Goals() {
  const [activeGoals] = useState<GoalItem[]>(initialGoals);
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>("all");
  const [showAllGoals, setShowAllGoals] = useState(false);

  const visibleGoals = showAllGoals ? activeGoals : activeGoals.slice(0, 3);

  const visibleBadges = useMemo(() => {
    if (badgeFilter === "unlocked") {
      return badges.filter((badge) => badge.unlocked);
    }

    if (badgeFilter === "locked") {
      return badges.filter((badge) => !badge.unlocked);
    }

    return badges;
  }, [badgeFilter]);

  const dayStreak = 12;
  const badgeCount = badges.filter((badge) => badge.unlocked).length;

  return (
    <div className="min-h-screen bg-zinc-50 p-8 transition-colors duration-300">
      <main className="space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
              Your Sustainability Journey
            </h1>
            <p className="text-2xl text-zinc-500">
              You&apos;ve saved 42kg of CO2 this month. Keep up the momentum to
              reach your next milestone!
            </p>
          </div>

          <div className="flex gap-3">
            <div className="min-w-24 rounded-2xl border border-zinc-200 bg-white p-4 text-center transition-colors">
              <p className="text-4xl font-bold text-green-500">{dayStreak}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Day Streak
              </p>
            </div>
            <div className="min-w-24 rounded-2xl border border-zinc-200 bg-white p-4 text-center transition-colors">
              <p className="text-4xl font-bold text-green-500">{badgeCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Badges
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-4xl font-semibold text-zinc-900">
              <Target className="h-5 w-5 text-green-500" /> Active Goals
            </h2>
            <button
              onClick={() => setShowAllGoals((previous) => !previous)}
              className="text-sm font-semibold text-green-600 hover:underline"
            >
              {showAllGoals ? "Show less" : "View all goals"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {visibleGoals.map((goal) => (
              <article
                key={goal.id}
                className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-zinc-100 p-3 text-zinc-600">
                    {goalIcon(goal.icon)}
                  </div>
                  <span
                    className={`rounded-md px-3 py-1 text-[10px] font-black uppercase ${statusStyles[goal.status]}`}
                  >
                    {statusText[goal.status]}
                  </span>
                </div>

                <div>
                  <h3 className="text-3xl font-semibold text-zinc-900">
                    {goal.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {goal.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-zinc-900">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between pt-1 text-[10px] text-zinc-500">
                    <span>{goal.progressText}</span>
                    <span>{goal.daysLeft}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-4xl font-semibold text-zinc-900">
              <Trophy className="h-5 w-5 text-green-500" /> Badge Gallery
            </h2>

            <div className="flex rounded-lg bg-zinc-200 p-1">
              {(["all", "unlocked", "locked"] as BadgeFilter[]).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setBadgeFilter(filter)}
                    className={`rounded px-3 py-1 text-[10px] font-black uppercase transition ${
                      badgeFilter === filter
                        ? "bg-black text-white"
                        : "text-zinc-500 hover:bg-zinc-300"
                    }`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {visibleBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center space-y-3 text-center"
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                    badge.unlocked
                      ? "border-green-500 bg-white"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  {badgeIcon(badge.icon, badge.unlocked)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {badge.label}
                  </p>
                  <p className="text-[10px] font-black tracking-wider text-zinc-500">
                    {badge.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors">
          <h2 className="text-4xl font-semibold text-zinc-900">
            Recent Milestones
          </h2>
          <div className="relative mt-6 space-y-8 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-zinc-200">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="relative pl-8">
                <div className="absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-green-500 bg-white">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {milestone.period}
                </p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">
                  {milestone.title}
                </p>
                <p className="text-sm text-zinc-500">{milestone.note}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Link
        to="/set-goals"
        className="fixed bottom-7 left-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition hover:bg-green-600"
      >
        <PlusCircle className="h-4 w-4" /> Set New Goal
      </Link>
    </div>
  );
}
