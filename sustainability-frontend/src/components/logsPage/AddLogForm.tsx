import { useState } from "react";

export type LogFormData = {
  date: string;
  category: string;
  value: number;
};

type Props = {
  onSubmit: (data: LogFormData) => void;
};

export default function AddLogForm({ onSubmit }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    date: today,
    category: "Transport",
    value: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const parsedValue = Number(form.value);
        if (!form.date || !form.category) {
          setError("Date and category are required.");
          return;
        }

        if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
          setError("Emission value must be greater than 0.");
          return;
        }

        onSubmit({
          date: form.date,
          category: form.category,
          value: parsedValue,
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-2 rounded-xl border outline-none"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-2 rounded-xl border outline-none"
        >
          <option>Transport</option>
          <option>Energy</option>
          <option>Food</option>
          <option>Waste</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Emission Value (kg CO2e)</label>
        <input
          type="number"
          name="value"
          value={form.value}
          onChange={handleChange}
          min={0.01}
          step="any"
          placeholder="Enter emission value"
          className="w-full mt-2 px-4 py-2 rounded-xl border outline-none"
          required
        />
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={() =>
            setForm({
              date: today,
              category: "Transport",
              value: "",
            })
          }
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 font-medium"
        >
          Clear
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium"
        >
          Save Log
        </button>
      </div>
    </form>
  );
}
