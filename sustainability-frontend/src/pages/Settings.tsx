import { useMemo, useState } from "react";
import {
  Bell,
  Shield,
  User,
  SlidersHorizontal,
  BarChart3,
  Sun,
  Download,
  Leaf,
} from "lucide-react";

type ThemeMode = "light";
type UnitWeight = "kg" | "lbs";
type UnitDistance = "km" | "miles";

type ReminderSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

type SettingsState = {
  fullName: string;
  email: string;
  company: string;
  role: string;
  theme: ThemeMode;
  weightUnit: UnitWeight;
  distanceUnit: UnitDistance;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  publicProfile: boolean;
  dataSharing: boolean;
  reminders: ReminderSetting[];
};

const initialState: SettingsState = {
  fullName: "Alex Green",
  email: "alex.green@eco-workspace.com",
  company: "Eco Workspace",
  role: "Sustainability Lead",
  theme: "light",
  weightUnit: "kg",
  distanceUnit: "km",
  twoFactorEnabled: false,
  loginAlerts: true,
  publicProfile: false,
  dataSharing: false,
  reminders: [
    {
      id: "daily",
      title: "Daily Habit Reminder",
      description: "Get a gentle nudge to your daily eco-habits.",
      enabled: true,
    },
    {
      id: "weekly",
      title: "Weekly Progress Report",
      description: "Receive a summary of your CO2 savings via email.",
      enabled: true,
    },
    {
      id: "community",
      title: "Community Updates",
      description: "Stay informed about community challenges and leaderboards.",
      enabled: false,
    },
  ],
};

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "privacy", label: "Data & Privacy", icon: BarChart3 },
];

const Toggle = ({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`flex h-6 w-12 items-center rounded-full px-1 transition ${
      active ? "bg-green-500" : "bg-zinc-300"
    }`}
  >
    <span
      className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
        active ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [form, setForm] = useState<SettingsState>(initialState);
  const [savedSnapshot, setSavedSnapshot] = useState<SettingsState>(initialState);
  const [status, setStatus] = useState<string | null>(null);

  const hasChanges = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedSnapshot),
    [form, savedSnapshot],
  );

  const toggleReminder = (id: string) => {
    setForm((prev) => ({
      ...prev,
      reminders: prev.reminders.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    }));
  };

  const saveChanges = () => {
    setSavedSnapshot(form);
    setStatus("Changes saved successfully");
  };

  const discardChanges = () => {
    setForm(savedSnapshot);
    setStatus("Unsaved changes discarded");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 transition-colors duration-300 lg:p-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[220px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
            <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              Settings
            </p>
            <p className="mb-4 text-xs text-zinc-400">Manage your footprint experience</p>

            <div className="space-y-1">
              {sections.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      active
                        ? "bg-green-100 text-green-700"
                        : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 transition-colors">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700">
              <Leaf className="h-4 w-4" /> Impact Rank
            </p>
            <p className="text-xs text-green-800">You’re in the top 15% of eco-savers this month.</p>
          </div>
        </aside>

        <main className="space-y-5">
          <header>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900">Account Settings</h1>
            <p className="text-zinc-500">
              Customize your tracking tools and personalize your dashboard
              experience.
            </p>
          </header>

          <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
            <div className="flex items-center gap-4">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
                alt="Avatar"
                className="h-18 w-18 rounded-full bg-zinc-100"
              />
              <div>
                <h2 className="text-3xl font-semibold text-zinc-900">{form.fullName}</h2>
                <p className="text-sm text-zinc-500">{form.email}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide">
                  <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">Pro Member</span>
                  <span className="text-zinc-400">Since Jan 2023</span>
                </div>
              </div>
            </div>

            <button className="rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">
              Change Avatar
            </button>
          </section>

          {activeSection === "profile" && (
            <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
              <h2 className="text-3xl font-semibold text-zinc-900">Profile</h2>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Full Name
                  </span>
                  <input
                    value={form.fullName}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-green-400"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Email
                  </span>
                  <input
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-green-400"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Company
                  </span>
                  <input
                    value={form.company}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, company: event.target.value }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-green-400"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                    Role
                  </span>
                  <input
                    value={form.role}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, role: event.target.value }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-green-400"
                  />
                </label>
              </div>
            </section>
          )}

          {activeSection === "preferences" && (
            <section className="space-y-4">
              <h2 className="text-3xl font-semibold text-zinc-900">Personalization</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
                  <p className="mb-3 text-sm font-semibold text-zinc-700">Interface Theme</p>
                  <div className="grid grid-cols-1 gap-2 rounded-xl bg-zinc-100 p-1">
                    <button
                      onClick={() => setForm((prev) => ({ ...prev, theme: "light" }))}
                      className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
                        form.theme === "light"
                          ? "border border-green-300 bg-white text-green-700"
                          : "text-zinc-500"
                      }`}
                    >
                      <Sun className="h-4 w-4" /> Light
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
                  <p className="mb-3 text-sm font-semibold text-zinc-700">Tracking Units</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600">Weight</span>
                      <div className="rounded-lg bg-zinc-100 p-1">
                        <button
                          onClick={() => setForm((prev) => ({ ...prev, weightUnit: "kg" }))}
                          className={`rounded px-3 py-1 text-xs font-semibold ${
                            form.weightUnit === "kg" ? "bg-white text-zinc-900" : "text-zinc-500"
                          }`}
                        >
                          kg
                        </button>
                        <button
                          onClick={() => setForm((prev) => ({ ...prev, weightUnit: "lbs" }))}
                          className={`rounded px-3 py-1 text-xs font-semibold ${
                            form.weightUnit === "lbs" ? "bg-white text-zinc-900" : "text-zinc-500"
                          }`}
                        >
                          lbs
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600">Distance</span>
                      <div className="rounded-lg bg-zinc-100 p-1">
                        <button
                          onClick={() => setForm((prev) => ({ ...prev, distanceUnit: "km" }))}
                          className={`rounded px-3 py-1 text-xs font-semibold ${
                            form.distanceUnit === "km" ? "bg-white text-zinc-900" : "text-zinc-500"
                          }`}
                        >
                          km
                        </button>
                        <button
                          onClick={() =>
                            setForm((prev) => ({ ...prev, distanceUnit: "miles" }))
                          }
                          className={`rounded px-3 py-1 text-xs font-semibold ${
                            form.distanceUnit === "miles"
                              ? "bg-white text-zinc-900"
                              : "text-zinc-500"
                          }`}
                        >
                          miles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "notifications" && (
            <section className="space-y-3">
              <h2 className="text-3xl font-semibold text-zinc-900">Reminders & Updates</h2>
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors">
                {form.reminders.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-4 py-4 ${
                      index !== form.reminders.length - 1 ? "border-b border-zinc-100" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                      <p className="text-xs text-zinc-500">{item.description}</p>
                    </div>
                    <Toggle
                      active={item.enabled}
                      onToggle={() => toggleReminder(item.id)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "security" && (
            <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
              <h2 className="text-3xl font-semibold text-zinc-900">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Two-factor authentication</p>
                    <p className="text-xs text-zinc-500">Require a second step on sign in.</p>
                  </div>
                  <Toggle
                    active={form.twoFactorEnabled}
                    onToggle={() =>
                      setForm((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Login alerts</p>
                    <p className="text-xs text-zinc-500">Get alerted for new device sign-ins.</p>
                  </div>
                  <Toggle
                    active={form.loginAlerts}
                    onToggle={() => setForm((prev) => ({ ...prev, loginAlerts: !prev.loginAlerts }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Password</p>
                    <p className="text-xs text-zinc-500">Keep your account secure with regular updates.</p>
                  </div>
                  <button className="rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">
                    Change Password
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection === "privacy" && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors">
              <h2 className="mb-4 text-3xl font-semibold text-zinc-900">Data & Privacy</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Public Profile</p>
                    <p className="text-xs text-zinc-500">Show your rank and achievements in community pages.</p>
                  </div>
                  <Toggle
                    active={form.publicProfile}
                    onToggle={() =>
                      setForm((prev) => ({ ...prev, publicProfile: !prev.publicProfile }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Data Sharing</p>
                    <p className="text-xs text-zinc-500">Allow anonymized data for platform insights.</p>
                  </div>
                  <Toggle
                    active={form.dataSharing}
                    onToggle={() =>
                      setForm((prev) => ({ ...prev, dataSharing: !prev.dataSharing }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Data Export</p>
                    <p className="text-xs text-zinc-500">Download your tracking history in CSV or PDF.</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200">
                    <Download className="h-4 w-4" /> Export
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-red-600">Delete Account</p>
                    <p className="text-xs text-red-400">Permanently remove your account and all carbon data.</p>
                  </div>
                  <button className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100">
                    Delete
                  </button>
                </div>
              </div>
            </section>
          )}

          <div className="sticky bottom-4 z-10 flex items-center justify-end gap-4 rounded-2xl border border-zinc-200 bg-white/95 p-3 backdrop-blur transition-colors">
            <button
              onClick={discardChanges}
              disabled={!hasChanges}
              className="px-5 py-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-700 disabled:opacity-50"
            >
              Discard
            </button>
            <button
              onClick={saveChanges}
              disabled={!hasChanges}
              className="rounded-xl bg-green-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>

          {status && (
            <p className="text-right text-sm font-medium text-green-700">{status}</p>
          )}
        </main>
      </div>
    </div>
  );
}
