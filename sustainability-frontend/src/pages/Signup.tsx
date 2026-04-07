import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  X,
} from "lucide-react";
import { api } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/accounts/register/", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed", error);
      alert("Registration failed. Please try again.");
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
              EcoTrack
            </span>
          </div>

          <Link
            to="/login"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200"
            aria-label="Close"
          >
            <X size={18} />
          </Link>
        </div>
      </header>

      <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-green-100/35 via-transparent to-green-100/30" />

        <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
              Join the Movement
            </h1>
            <p className="mt-2 text-lg text-zinc-500">
              Start tracking your sustainable habits today.
            </p>
          </div>

          <div className="mt-5 h-30 overflow-hidden rounded-xl bg-linear-to-br from-green-950 via-green-900 to-emerald-700">
            <div className="h-full w-full bg-linear-to-t from-black/20 via-transparent to-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Full Name
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 focus-within:border-green-500">
                <User className="h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  className="w-full bg-transparent text-zinc-900 outline-none"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 focus-within:border-green-500">
                <Mail className="h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  className="w-full bg-transparent text-zinc-900 outline-none"
                  placeholder="nature@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 focus-within:border-green-500">
                <Lock className="h-4 w-4 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-transparent text-zinc-900 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-zinc-400 hover:text-zinc-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
            <div className="h-px flex-1 bg-zinc-200" />
            Or continue with
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            Sign up with Google
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 font-semibold text-green-600 hover:underline"
            >
              Log in
            </Link>
          </p>

          <p className="mt-5 text-center text-[11px] text-zinc-400 uppercase tracking-wide">
            By creating an account, you agree to our
            <button type="button" className="mx-1 underline">
              Terms of Service
            </button>
            and
            <button type="button" className="ml-1 underline">
              Privacy Policy
            </button>
          </p>

          <p className="mt-6 text-center text-xs text-zinc-400">
            © 2024 EcoTrack Sustainability. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
