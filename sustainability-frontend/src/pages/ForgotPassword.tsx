import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Sun, Undo2, Mail, ArrowRight, Shield } from "lucide-react";
import { api } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/accounts/forgot-password/", { email });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 text-white">
              <Leaf size={14} />
            </div>
            <span className="text-2xl font-semibold text-zinc-900">Sustainability Tracker</span>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500"
            aria-label="Theme"
          >
            <Sun size={16} />
          </button>
        </div>
      </header>

      <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-green-100/35 via-transparent to-green-100/30" />

        <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="h-1 rounded-t-2xl bg-green-500" />

          <div className="space-y-5 p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Undo2 size={22} />
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Forgot password?</h1>
              <p className="mt-2 text-zinc-500">
                No worries, we&apos;ll send you reset instructions to your inbox.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                Reset instructions were sent to <span className="font-semibold">{email}</span>.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Email Address</label>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 focus-within:border-green-500">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-zinc-900 outline-none"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700"
              >
                <Undo2 size={14} /> Back to Login
              </Link>
            </div>
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Shield size={12} /> Secure sustainability platform
            </span>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-zinc-400">
        © 2024 Sustainability Tracker. All rights reserved.
      </footer>
    </div>
  );
}
