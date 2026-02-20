import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <h2 className="text-sm text-gray-500">User Dashboard Overview</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2 w-80">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search footprints..."
          />
        </div>

        <button className="h-10 w-10 rounded-xl border bg-white flex items-center justify-center text-gray-600">
          <Bell className="h-5 w-5" />
        </button>

        <button className="h-10 w-10 rounded-full border bg-white flex items-center justify-center">
          <UserCircle2 className="h-6 w-6 text-green-600" />
        </button>
      </div>
    </header>
  );
}
