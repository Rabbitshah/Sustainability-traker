import { useMemo, useState } from "react";
import {
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Users,
} from "lucide-react";

type LeaderboardScope = "global" | "friends" | "local";

type Warrior = {
  rank: number;
  name: string;
  points: number;
  trend: number;
  avatar: string;
};

type FriendActivity = {
  id: number;
  name: string;
  action: string;
  points: number;
  avatar: string;
};

const leaderboardData: Record<LeaderboardScope, Warrior[]> = {
  global: [
    { rank: 1, name: "Alex Rivers", points: 2450, trend: 12, avatar: "AR" },
    { rank: 2, name: "EcoSam", points: 2310, trend: 5, avatar: "ES" },
    { rank: 3, name: "GreenLeaf_99", points: 2180, trend: 18, avatar: "GL" },
    { rank: 4, name: "Jordan Sustainability", points: 2040, trend: 2, avatar: "JS" },
    { rank: 5, name: "NatureLover", points: 1950, trend: -1, avatar: "NL" },
  ],
  friends: [
    { rank: 8, name: "Marcus Green", points: 1580, trend: 9, avatar: "MG" },
    { rank: 13, name: "Elena Watts", points: 1410, trend: 6, avatar: "EW" },
    { rank: 22, name: "Davi Costa", points: 1215, trend: 12, avatar: "DC" },
    { rank: 27, name: "You", points: 1080, trend: 7, avatar: "YU" },
    { rank: 31, name: "Tina Carbon", points: 970, trend: -2, avatar: "TC" },
  ],
  local: [
    { rank: 1, name: "CityHero", points: 1180, trend: 8, avatar: "CH" },
    { rank: 2, name: "Alex Rivers", points: 1120, trend: 5, avatar: "AR" },
    { rank: 3, name: "You", points: 1080, trend: 7, avatar: "YU" },
    { rank: 4, name: "ZeroWasteKate", points: 1060, trend: 4, avatar: "ZW" },
    { rank: 5, name: "LeafRunner", points: 1010, trend: -1, avatar: "LR" },
  ],
};

const friendActivity: FriendActivity[] = [
  {
    id: 1,
    name: "Marcus Green",
    action: "Planted 5 trees today",
    points: 50,
    avatar: "MG",
  },
  {
    id: 2,
    name: "Elena Watts",
    action: "Joined Solar Challenge",
    points: 20,
    avatar: "EW",
  },
  {
    id: 3,
    name: "Davi Costa",
    action: "Zero Waste Week",
    points: 120,
    avatar: "DC",
  },
];

const tabText: Record<LeaderboardScope, string> = {
  global: "Global",
  friends: "Friends",
  local: "Local",
};

const rankBadgeClass = (rank: number) => {
  if (rank === 1) return "bg-amber-100 text-amber-700";
  if (rank === 2) return "bg-zinc-200 text-zinc-600";
  if (rank === 3) return "bg-orange-100 text-orange-700";
  return "bg-zinc-100 text-zinc-600";
};

export default function Community() {
  const [scope, setScope] = useState<LeaderboardScope>("global");
  const [search, setSearch] = useState("");
  const [joinedChallenge, setJoinedChallenge] = useState(false);

  const rows = useMemo(() => {
    const base = leaderboardData[scope];
    const query = search.trim().toLowerCase();

    if (!query) return base;

    return base.filter((item) => item.name.toLowerCase().includes(query));
  }, [scope, search]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-3xl font-semibold text-zinc-900">
          <Users className="h-5 w-5 text-green-500" /> Community Leaderboard
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2 text-zinc-400">
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search warriors..."
              className="w-50 bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
            />
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-500">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.75fr]">
        <section>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">Top Eco-Warriors</h1>
          <p className="mt-1 text-zinc-500">
            Global rankings based on verified environmental impact scores
          </p>

          <div className="mt-5 flex gap-6 border-b border-zinc-200">
            {(["global", "friends", "local"] as LeaderboardScope[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setScope(tab)}
                className={`border-b-2 px-2 pb-3 text-sm font-semibold transition ${
                  scope === tab
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {tabText[tab]}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Warrior</th>
                  <th className="px-4 py-3">Impact Score</th>
                  <th className="px-4 py-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {rows.map((item) => (
                  <tr key={`${item.rank}-${item.name}`} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${rankBadgeClass(item.rank)}`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
                          {item.avatar}
                        </div>
                        <span className="font-medium text-zinc-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
                        {item.points.toLocaleString()} pts
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-semibold ${
                          item.trend >= 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {item.trend >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {Math.abs(item.trend)}%
                      </span>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-500">
                      No warriors found for this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-zinc-900">Friends Activity</h2>
              <button className="text-xs font-semibold text-green-600 hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {friendActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.action}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">+{item.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-zinc-900 to-green-950 p-4 text-white shadow-lg">
            <span className="inline-block rounded-full bg-green-500 px-2 py-1 text-[10px] font-black uppercase">
              Featured
            </span>
            <h3 className="mt-2 text-3xl font-semibold">Plastic-Free Month</h3>
            <p className="mt-2 text-sm text-zinc-200">
              Join 1,200 others in reducing single-use plastic. Big rewards for top participants!
            </p>

            <div className="mt-4 flex -space-x-2">
              {["A", "B", "C", "+1k"].map((item) => (
                <span
                  key={item}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-700 text-xs font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>

            <button
              onClick={() => setJoinedChallenge((prev) => !prev)}
              className="mt-4 w-full rounded-xl bg-green-500 py-2.5 font-semibold text-zinc-900 transition hover:bg-green-400"
            >
              {joinedChallenge ? "Joined" : "Join Challenge"}
            </button>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-zinc-900">Your Rank</p>
            <p className="mt-1 text-5xl font-bold text-zinc-900">#142</p>
            <p className="text-xs font-semibold text-zinc-500 uppercase">Top 5% globally</p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full w-4/5 bg-green-500" />
            </div>
            <p className="mt-2 text-center text-xs text-zinc-500">
              Earn 150 more pts to reach #100!
            </p>
          </div>
        </aside>
      </div>

      <button className="fixed bottom-7 left-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-lg shadow-green-500/25 transition hover:bg-green-400">
        <Users className="h-4 w-4" /> Invite Friends
      </button>
    </div>
  );
}
