import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Target,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/logs", label: "Logs", icon: FileText },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/community", label: "Community", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/reports", label: "Reports", icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r min-h-screen px-5 py-6 flex flex-col transition-colors duration-300">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-xl bg-green-500 shadow-lg shadow-green-500/20" />
        <div>
          <p className="font-bold text-lg leading-5">EcoTracker</p>
          <p className="text-xs text-gray-500">SaaS Dashboard</p>
        </div>
      </div>

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

      <div className="mt-6 space-y-3 pt-6 border-t">
        <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold">
            ?
          </span>
          Help Support
        </button>
        <button className="w-full text-left text-sm text-red-600 hover:text-red-700 flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
            <LogOut className="h-4 w-4" />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
