import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, CircleHelp } from "lucide-react";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/accounts/login/", {
        username: email,
        password,
      });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
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
            <span className="text-2xl font-semibold text-zinc-900">
              Sustainability Tracker
            </span>
          </div>

          <button className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600">
            Support
          </button>
        </div>
      </header>

      <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-green-100/50 via-transparent to-green-100/40" />

        <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
              Start Your Journey
            </h1>
            <p className="mt-2 text-lg text-zinc-500">
              Track your impact and live more sustainably every day.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 rounded-xl border border-zinc-200 bg-zinc-100 p-1 text-sm font-semibold">
            <span className="rounded-lg bg-white py-2 text-center text-zinc-900">
              Login
            </span>
            <Link
              to="/signup"
              className="rounded-lg py-2 text-center text-green-700 transition hover:bg-zinc-200/70"
            >
              Sign Up
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-green-500"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-green-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-green-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
            <div className="h-px flex-1 bg-zinc-200" />
            OR CONTINUE WITH
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-zinc-500">
            By continuing, you agree to our
            <button type="button" className="mx-1 underline">
              Terms of Service
            </button>
            and
            <button type="button" className="ml-1 underline">
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>

      <footer className="border-t border-zinc-200 bg-zinc-50 py-4">
        <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-sm text-green-700">
          <CircleHelp size={14} /> Helping 12,000+ people track their footprint
        </p>
      </footer>
      </div>
  );
}
