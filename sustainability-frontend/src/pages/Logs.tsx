import { useState, useEffect } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { emissionsApi } from "../services/emissions";
import Modal from "../components/ui/Modal";
import AddLogForm from "../components/logs/AddLogForm";

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await emissionsApi.list();
      setLogs(data);
    } catch (error) {
      console.error("Failed to load logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.activity &&
        log.activity.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs</h1>
          <p className="text-gray-500 mt-1">
            Track emissions by recording daily activities
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Log
        </button>
      </div>

      {/* Filters row */}
      <div className="bg-white rounded-2xl border p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-3 py-2 w-full md:w-96">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search category or activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="border px-4 py-2 rounded-xl font-medium bg-white hover:bg-gray-50 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border p-5">
        <div className="grid grid-cols-5 text-sm text-gray-500 border-b pb-2">
          <p>Date</p>
          <p>Activity</p>
          <p>Category</p>
          <p>Status</p>
          <p className="text-right">Impact</p>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="py-8 text-center text-gray-500">
              Loading logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No logs found.</div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-5 py-3 text-sm items-center hover:bg-gray-50 transition-colors"
              >
                <p className="text-gray-600">
                  {new Date(log.date).toLocaleDateString()}
                </p>
                <p className="font-medium">{log.activity || "N/A"}</p>
                <p>
                  <span className="px-2 py-1 rounded-lg text-xs bg-green-50 text-green-700 font-medium">
                    {log.category}
                  </span>
                </p>

                <p>
                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                    Recorded
                  </span>
                </p>

                <p className="text-right font-semibold text-gray-900">
                  {log.co2e_impact
                    ? `${log.co2e_impact.toFixed(2)} kg`
                    : "0 kg"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Emission"
      >
        <AddLogForm
          onSubmit={async (data) => {
            await emissionsApi.create({ company: 1, ...data });
            setIsModalOpen(false);
            loadLogs();
          }}
        />
      </Modal>
    </div>
  );
}
