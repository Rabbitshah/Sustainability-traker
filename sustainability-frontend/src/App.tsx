import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      {/* 🟢 Root wrapper ensures consistent background across the entire viewport */}
      <div className="flex bg-gray-50 min-h-screen transition-colors duration-300">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Theme state is passed to Topbar for the toggle button */}
          <Topbar />

          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/reports" element={<Reports />} />

              <Route
                path="/goals"
                element={<div className="p-6">Goals Page</div>}
              />
              <Route
                path="/community"
                element={<div className="p-6">Community Page</div>}
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
