import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-end border-b border-slate-200 bg-white px-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="flex w-80 items-center gap-2 rounded-xl border border-slate-200 bg-gray-100 px-3 py-2 transition-colors">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            className="w-full bg-transparent text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-500"
            placeholder="Search footprints..."
          />
        </div>

        <button
          onClick={() => navigate("/notifications")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-2 text-gray-700 transition-colors hover:bg-gray-50"
            aria-label="Profile menu"
            title="Profile menu"
          >
            <UserCircle2 className="h-6 w-6 text-green-600" />
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
