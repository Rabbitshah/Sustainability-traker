import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Target,
  Users,
  Bell,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/logs", label: "Logs", icon: FileText },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/community", label: "Community", icon: Users },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-100 bg-white px-5 py-6 transition-colors duration-300">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 flex items-center gap-2 text-left"
      >
        <div className="h-10 w-10 rounded-xl bg-green-500 shadow-lg shadow-green-500/20" />
        <div>
          <p className="text-lg leading-5 font-bold text-zinc-900 transition-colors">EcoTracker</p>
          <p className="text-xs text-gray-500 transition-colors">SaaS Dashboard</p>
        </div>
      </button>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                 ${
                   isActive
                     ? "bg-green-50 text-green-700 shadow-sm"
                     : "text-gray-700 hover:bg-gray-50"
                 }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
        <button
          onClick={() => navigate("/community")}
          className="flex w-full items-center gap-2 text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 font-bold">
            ?
          </span>
          Help & Support
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 text-left text-sm text-red-600 transition-colors hover:text-red-700"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
            <LogOut className="h-4 w-4" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
