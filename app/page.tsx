"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransportMode = "car" | "bus" | "metro" | "bike" | "walk";
type ScoreLevel = "excellent" | "moderate" | "high";

interface Results {
  daily: number;
  weekly: number;
  monthly: number;
  score: ScoreLevel;
  points: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMISSION_FACTORS: Record<TransportMode, number> = {
  car: 0.21,
  bus: 0.1,
  metro: 0.05,
  bike: 0,
  walk: 0,
};

const TRANSPORT_OPTIONS: { value: TransportMode; label: string; icon: string }[] = [
  { value: "car",   label: "Car",   icon: "🚗" },
  { value: "bus",   label: "Bus",   icon: "🚌" },
  { value: "metro", label: "Metro", icon: "🚇" },
  { value: "bike",  label: "Bike",  icon: "🚲" },
  { value: "walk",  label: "Walk",  icon: "🚶" },
];

const SCORE_CONFIG: Record<
  ScoreLevel,
  { label: string; color: string; bg: string; border: string; bar: string; progress: number; message: string }
> = {
  excellent: {
    label: "Excellent", color: "text-emerald-700", bg: "bg-emerald-50",
    border: "border-emerald-200", bar: "bg-emerald-500", progress: 15,
    message: "You're already low-impact. Keep it up! 🌱",
  },
  moderate: {
    label: "Moderate", color: "text-amber-700", bg: "bg-amber-50",
    border: "border-amber-200", bar: "bg-amber-400", progress: 52,
    message: "Good start — small changes can make a big difference ✨",
  },
  high: {
    label: "High", color: "text-red-700", bg: "bg-red-50",
    border: "border-red-200", bar: "bg-red-500", progress: 88,
    message: "Consider switching to a greener commute option 🌿",
  },
};

const MOCK_LEADERBOARD = [
  { name: "Aisha K.",  points: 340 },
  { name: "Marcus L.", points: 295 },
  { name: "Priya S.",  points: 260 },
  { name: "James T.",  points: 180 },
];

const REWARDS = [
  { title: "₹500 Swiggy Voucher", points: 300, icon: "🍔" },
  { title: "Free Uber Ride",       points: 250, icon: "🚖" },
  { title: "Plant 5 Trees",        points: 200, icon: "🌱" },
  { title: "Amazon Coupon",        points: 150, icon: "📦" },
];

const MOCK_CUMULATIVE  = 240;
const MOCK_STREAK      = 3;

// ─── Logic ────────────────────────────────────────────────────────────────────

function getScore(daily: number): ScoreLevel {
  if (daily < 2)  return "excellent";
  if (daily <= 5) return "moderate";
  return "high";
}

function getPoints(daily: number): number {
  if (daily < 2)  return 100;
  if (daily <= 5) return 50;
  return 10;
}

function getTips(mode: TransportMode, daily: number) {
  const tips: { icon: string; text: string }[] = [];
  if (mode === "car")
    tips.push({ icon: "🚇", text: "Switching to metro or bus could cut your daily emissions by up to 76%." });
  if (daily > 5)
    tips.push({ icon: "📅", text: "Even one WFH day per week reduces your monthly footprint by 20%." });
  if (tips.length === 0)
    tips.push({ icon: "🌱", text: "You're already making a green choice — challenge a colleague to match you!" });
  if (tips.length < 2)
    tips.push({ icon: "💡", text: "Log your commute daily to keep your streak alive and unlock more rewards." });
  return tips.slice(0, 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [distance, setDistance] = useState("");
  const [mode, setMode]         = useState<TransportMode>("car");
  const [days, setDays]         = useState("");
  const [results, setResults]   = useState<Results | null>(null);

  function calculate() {
    const km = parseFloat(distance);
    const d  = parseFloat(days);
    if (!km || !d || km <= 0 || d <= 0) return;

    const daily   = km * EMISSION_FACTORS[mode];
    const weekly  = daily * d;
    const monthly = weekly * 4.33;

    setResults({
      daily:   Math.round(daily   * 100) / 100,
      weekly:  Math.round(weekly  * 100) / 100,
      monthly: Math.round(monthly * 100) / 100,
      score:   getScore(daily),
      points:  getPoints(daily),
    });
  }

  const totalPoints = results ? MOCK_CUMULATIVE + results.points : MOCK_CUMULATIVE;

  const leaderboard = results
    ? [...MOCK_LEADERBOARD, { name: "You", points: totalPoints }]
        .sort((a, b) => b.points - a.points)
        .slice(0, 5)
    : null;

  const treesNeeded = results ? Math.ceil(results.monthly / 1.75) : 0;
  const kmEquiv     = results ? Math.round(results.monthly / 0.21) : 0;

  const score = results ? SCORE_CONFIG[results.score] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">

      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="text-lg font-bold text-gray-900 tracking-tight">EmitLess</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold ml-1">Beta</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 hidden sm:inline">Points</span>
            <span className="font-bold text-emerald-600">{totalPoints} pts</span>
            {results && (
              <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                🔥 {MOCK_STREAK}-day streak
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-3 pt-2 pb-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Track. Reduce.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              Earn.
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto">
            Log your commute, see your carbon footprint, earn rewards, and compete with your team.
          </p>
        </div>

        {/* ── Calculator + Results ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Input Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-800 text-base">Your Commute</h2>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Distance (km)</label>
              <input
                type="number" min="0" value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 15"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Transport Mode</label>
              <div className="grid grid-cols-5 gap-2">
                {TRANSPORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all duration-150 ${
                      mode === opt.value
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm"
                        : "border-gray-200 text-gray-400 hover:border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Days per Week</label>
              <input
                type="number" min="1" max="7" value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md"
            >
              Calculate My Footprint →
            </button>
          </div>

          {/* Results Panel */}
          {results && score ? (
            <div className="space-y-4">

              {/* CO2 Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Daily",   value: results.daily },
                  { label: "Weekly",  value: results.weekly },
                  { label: "Monthly", value: results.monthly },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{s.label}</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{s.value}</p>
                    <p className="text-xs text-gray-300 mt-0.5">kg CO₂</p>
                  </div>
                ))}
              </div>

              {/* Score */}
              <div className={`${score.bg} border ${score.border} rounded-2xl p-5 space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Carbon Level</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${score.bg} ${score.border} ${score.color}`}>
                    {score.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${score.bar} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${score.progress}%` }}
                  />
                </div>
                <p className={`text-sm ${score.color}`}>{score.message}</p>
              </div>

              {/* Points + Streak */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-4 text-white">
                  <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">Today's Points</p>
                  <p className="text-4xl font-extrabold mt-1">{results.points}</p>
                  <p className="text-emerald-200 text-xs mt-1">Total: {totalPoints} pts</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wide">Green Streak</p>
                  <p className="text-4xl font-extrabold text-orange-500 mt-1">🔥 {MOCK_STREAK}</p>
                  <p className="text-orange-300 text-xs mt-1">days in a row</p>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-12 space-y-3">
              <span className="text-6xl">🌍</span>
              <p className="text-gray-400 text-sm max-w-xs">
                Enter your commute details and hit Calculate to see your carbon footprint.
              </p>
            </div>
          )}
        </div>

        {results && (
          <>
            {/* ── Tips + Leaderboard ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Smart Tips */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <h2 className="font-semibold text-gray-800">Smart Tips</h2>
                  <span className="text-xs bg-blue-50 text-blue-500 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                    Personalised
                  </span>
                </div>
                <div className="space-y-3">
                  {getTips(mode, results.daily).map((tip, i) => (
                    <div key={i} className="flex gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                      <p className="text-sm text-gray-600 leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <h2 className="font-semibold text-gray-800">Leaderboard</h2>
                </div>
                <div className="space-y-2">
                  {leaderboard!.map((entry, i) => {
                    const isYou = entry.name === "You";
                    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                    return (
                      <div
                        key={entry.name}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                          isYou
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <span className="w-6 text-center text-sm font-bold text-gray-400">
                          {medal ?? `${i + 1}`}
                        </span>
                        <span className={`flex-1 text-sm font-medium ${isYou ? "text-emerald-700" : "text-gray-700"}`}>
                          {entry.name}{isYou && " 👤"}
                        </span>
                        <span className={`text-sm font-bold ${isYou ? "text-emerald-600" : "text-gray-400"}`}>
                          {entry.points} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Impact Visualization ────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 sm:p-8 text-white">
              <h2 className="font-semibold text-lg mb-1">🌍 Your Monthly Impact</h2>
              <p className="text-emerald-100 text-sm mb-6">Here's what your commute footprint looks like in real terms.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/15 backdrop-blur rounded-2xl p-5 text-center">
                  <p className="text-4xl font-extrabold">{results.monthly}</p>
                  <p className="text-emerald-100 text-sm mt-1">kg CO₂ this month</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-2xl p-5 text-center">
                  <p className="text-4xl font-extrabold">🌳 {treesNeeded}</p>
                  <p className="text-emerald-100 text-sm mt-1">trees needed to offset</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-2xl p-5 text-center">
                  <p className="text-4xl font-extrabold">{kmEquiv}</p>
                  <p className="text-emerald-100 text-sm mt-1">km equivalent by car</p>
                </div>
              </div>
            </div>

            {/* ── Rewards ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <h2 className="font-semibold text-gray-800">Rewards</h2>
                </div>
                <span className="text-sm text-gray-400">
                  You have{" "}
                  <span className="font-bold text-emerald-600">{totalPoints} pts</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REWARDS.map((reward) => {
                  const canRedeem = totalPoints >= reward.points;
                  return (
                    <div
                      key={reward.title}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                        canRedeem
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <span className="text-3xl flex-shrink-0">{reward.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{reward.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{reward.points} pts required</p>
                      </div>
                      <button
                        disabled={!canRedeem}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                          canRedeem
                            ? "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Redeem
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-gray-300">
        EmitLess · Making every commute count 🌱
      </footer>
    </div>
  );
}
