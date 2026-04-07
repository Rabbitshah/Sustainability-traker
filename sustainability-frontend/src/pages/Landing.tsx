import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Leaf,
  Sparkles,
  FileText,
  Share2,
} from "lucide-react";

const featureCards = [
  {
    title: "Carbon Tracking",
    description:
      "Real-time data visualization of your daily emissions. Seamlessly integrates with your banking and utility apps.",
    icon: <BarChart3 size={18} />,
    iconClass: "bg-green-100 text-green-600",
    linkClass: "text-green-600 hover:text-green-700",
  },
  {
    title: "AI-Powered Tips",
    description:
      "Personalized suggestions powered by machine learning to reduce waste and save energy based on your unique habits.",
    icon: <Sparkles size={18} />,
    iconClass: "bg-blue-100 text-blue-600",
    linkClass: "text-blue-600 hover:text-blue-700",
  },
  {
    title: "Smart Reports",
    description:
      "Generate beautiful PDF reports to share your progress with stakeholders, family, or your social community.",
    icon: <FileText size={18} />,
    iconClass: "bg-purple-100 text-purple-600",
    linkClass: "text-purple-600 hover:text-purple-700",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-zinc-100/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-white">
              <Leaf size={15} />
            </div>
            <span className="text-sm font-semibold">EcoTrack</span>
          </div>

          <nav className="hidden items-center gap-8 text-xs font-medium text-zinc-600 md:flex">
            <a href="#features" className="hover:text-zinc-900">
              Features
            </a>
            <a href="#pricing" className="hover:text-zinc-900">
              Pricing
            </a>
            <a href="#about" className="hover:text-zinc-900">
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/signup"
              className="rounded-md bg-green-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-6 py-14 md:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Now powered by AI
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-zinc-900 md:text-6xl">
              Track your impact. <span className="text-green-500">Reduce</span>{" "}
              your footprint.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-zinc-600">
              The all-in-one dashboard to monitor your carbon emissions, receive
              AI-driven eco-tips, and generate professional sustainability
              reports.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                Start Tracking for Free
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-green-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Watch Demo
              </Link>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-zinc-300 bg-linear-to-br from-zinc-900 via-zinc-800 to-slate-900 p-8 shadow-lg">
            <div className="mx-auto max-w-4xl rounded-xl border border-zinc-700 bg-zinc-800/90 p-5">
              <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
                <div className="rounded-lg bg-zinc-700/60 p-4">
                  <div className="mx-auto mb-3 h-24 w-24 rounded-full border-8 border-green-300/80 bg-zinc-800" />
                  <p className="text-center text-xs font-medium text-zinc-300">
                    57.3% efficiency
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-700/60 p-4">
                  <div className="mx-auto mb-3 h-24 w-24 rounded-full border-8 border-green-200/80 border-r-zinc-500 bg-zinc-800" />
                  <p className="text-center text-xs font-medium text-zinc-300">
                    39% progress
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="h-24 rounded-lg bg-zinc-700/60" />
                <div className="h-24 rounded-lg bg-zinc-700/60" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3 md:gap-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                CO2 Reduced
              </p>
              <p className="mt-2 text-4xl font-bold text-zinc-900">1.2M+</p>
              <p className="mt-1 text-xs font-semibold text-green-500">
                +12% MoM
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                Active Eco-Warriors
              </p>
              <p className="mt-2 text-4xl font-bold text-zinc-900">50,000+</p>
              <p className="mt-1 text-xs font-semibold text-green-500">
                +5% MoM
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                Trees Equivalent
              </p>
              <p className="mt-2 text-4xl font-bold text-zinc-900">2.5M</p>
              <p className="mt-1 text-xs font-semibold text-green-500">
                +18% MoM
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 md:text-5xl">
              Everything you need to lead a sustainable life
            </h2>
            <p className="mt-4 text-zinc-600">
              Our platform provides the advanced tools and real-time insights
              necessary to make a measurable difference in the fight against
              climate change.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <div
                  className={`mb-6 flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconClass}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  {feature.description}
                </p>
                <a
                  href="#"
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition ${feature.linkClass}`}
                >
                  Learn more <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="overflow-hidden rounded-[28px] bg-linear-to-r from-green-900 via-emerald-900 to-slate-900 px-6 py-14 text-center text-white md:px-12">
            <h3 className="mx-auto max-w-2xl text-4xl font-bold leading-tight tracking-tight">
              Ready to build a greener future?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-200">
              Join 50,000+ eco-warriors and start tracking your carbon footprint
              for free today. No credit card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-400"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-zinc-400/60 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="about" className="border-t border-zinc-200 bg-zinc-100">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-white">
                <Leaf size={15} />
              </div>
              <span className="text-sm font-semibold">EcoTrack</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-600">
              Empowering individuals and businesses to measure and minimize
              their environmental impact through data and AI.
            </p>
            <div className="mt-4 flex items-center gap-3 text-zinc-500">
              <button
                type="button"
                className="rounded-full border border-zinc-300 p-2 transition hover:bg-zinc-200"
                aria-label="Share"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase">
              Product
            </p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>Features</li>
              <li>Integrations</li>
              <li>Pricing</li>
              <li>Roadmap</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase">
              Company
            </p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li>About Us</li>
              <li>Careers</li>
              <li>Sustainability</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase">
              Newsletter
            </p>
            <p className="mt-4 text-sm text-zinc-600">
              The latest in sustainability tech, delivered to your inbox.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-green-500 placeholder:text-zinc-400 focus:ring-2"
              />
              <button
                type="button"
                className="rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-zinc-500">
            <p>© 2024 EcoTracking. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-zinc-700">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-zinc-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-zinc-700">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
