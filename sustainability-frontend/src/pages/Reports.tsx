import { Download, FileText, BarChart3, ShieldCheck } from "lucide-react";

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-500 mt-1">
            Generate compliance-ready sustainability summaries
          </p>
        </div>

        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Report
        </button>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Emissions</p>
            <BarChart3 className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold mt-2">12,606.50</p>
          <p className="text-sm text-gray-500 mt-1">kg CO₂e tracked</p>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Compliance Status</p>
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold mt-2">Ready</p>
          <p className="text-sm text-gray-500 mt-1">Report meets baseline format</p>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Last Generated</p>
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold mt-2">Today</p>
          <p className="text-sm text-gray-500 mt-1">Download updated version</p>
        </div>
      </div>

      {/* Export options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">Export Options</h2>
          <p className="text-sm text-gray-500 mt-1">
            Download your sustainability data in multiple formats.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl border bg-gray-50">
              <div>
                <p className="font-medium">PDF Sustainability Report</p>
                <p className="text-sm text-gray-500">
                  Compliance-ready summary for audits
                </p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
                Download PDF
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border bg-gray-50">
              <div>
                <p className="font-medium">CSV Export</p>
                <p className="text-sm text-gray-500">
                  Raw emissions dataset for analysis
                </p>
              </div>
              <button className="border px-4 py-2 rounded-xl text-sm font-medium bg-white hover:bg-gray-100">
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Preview / Highlights */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="text-lg font-semibold">Report Highlights</h2>
          <p className="text-sm text-gray-500 mt-1">
            Key findings generated for your organization.
          </p>

          <div className="mt-5 space-y-3">
            <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
              ✅ Electricity emissions contributed the most this month.
            </div>

            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
              ⚠️ Fuel consumption increased by 12% compared to last month.
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              💡 Switching to LED lighting can reduce electricity footprint.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

