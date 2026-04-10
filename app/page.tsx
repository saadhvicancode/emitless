"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransportMode = "car" | "bus" | "metro" | "bike" | "walk";
type ScoreLevel    = "excellent" | "moderate" | "high";

interface Results {
  daily:   number;
  weekly:  number;
  monthly: number;
  score:   ScoreLevel;
  points:  number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMISSION_FACTORS: Record<TransportMode, number> = {
  car: 0.21, bus: 0.1, metro: 0.05, bike: 0, walk: 0,
};

const TRANSPORT_OPTIONS: { value: TransportMode; label: string; icon: string }[] = [
  { value: "car",   label: "Car",   icon: "🚗" },
  { value: "bus",   label: "Bus",   icon: "🚌" },
  { value: "metro", label: "Metro", icon: "🚇" },
  { value: "bike",  label: "Bike",  icon: "🚲" },
  { value: "walk",  label: "Walk",  icon: "🚶" },
];

const SCORE_CONFIG: Record<ScoreLevel, {
  label: string; dot: string; text: string; bg: string; border: string; bar: string; progress: number; message: string;
}> = {
  excellent: {
    label: "Excellent", dot: "bg-green-500", text: "text-green-700",
    bg: "bg-green-50", border: "border-green-200", bar: "bg-green-500",
    progress: 12, message: "You're already a green commuter. Keep the streak alive.",
  },
  moderate: {
    label: "Moderate", dot: "bg-amber-400", text: "text-amber-700",
    bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-400",
    progress: 52, message: "You're making progress — small shifts go a long way.",
  },
  high: {
    label: "High", dot: "bg-red-500", text: "text-red-700",
    bg: "bg-red-50", border: "border-red-200", bar: "bg-red-500",
    progress: 88, message: "Your commute has a heavy footprint. Let's fix that.",
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

const MOCK_CUMULATIVE = 240;
const MOCK_STREAK     = 3;

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
  const tips: { icon: string; title: string; body: string }[] = [];
  if (mode === "car")
    tips.push({ icon: "🚇", title: "Go carless", body: "Metro cuts your daily emissions by up to 76% on the same route." });
  if (daily > 5)
    tips.push({ icon: "🏠", title: "Try one WFH day", body: "A single work-from-home day reduces your weekly footprint by 20%." });
  if (tips.length === 0)
    tips.push({ icon: "🌱", title: "You're doing great", body: "Zero-emission commuting is the gold standard — challenge a teammate." });
  if (tips.length < 2)
    tips.push({ icon: "🔥", title: "Protect your streak", body: "Log your commute every day to keep your streak and unlock more rewards." });
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
        .sort((a, b) => b.points - a.points).slice(0, 5)
    : null;
  const treesNeeded = results ? Math.ceil(results.monthly / 1.75) : 0;
  const kmEquiv     = results ? Math.round(results.monthly / 0.21) : 0;
  const score       = results ? SCORE_CONFIG[results.score] : null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-white font-bold text-base tracking-tight">EmitLess</span>
            <span className="text-xs border border-green-500/40 text-green-400 px-2 py-0.5 rounded-full font-medium">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-4">
            {results && (
              <span className="text-xs font-medium text-orange-400 flex items-center gap-1">
                🔥 <span>{MOCK_STREAK}-day streak</span>
              </span>
            )}
            <span className="text-sm font-semibold text-white">
              {totalPoints}{" "}
              <span className="text-green-400 font-bold">pts</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center space-y-3 py-4">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none">
            Track. Reduce.{" "}
            <span className="text-green-500">Earn.</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Log your commute, know your carbon cost, and get rewarded for going green.
          </p>
        </div>

        {/* ── Calculator + Results ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Input Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your Commute</p>

            {/* Distance */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Distance (km)</label>
              <input
                type="number" min="0" value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 15"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-300 focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5 transition"
              />
            </div>

            {/* Mode */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Transport Mode</label>
              <div className="grid grid-cols-5 gap-2">
                {TRANSPORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                      mode === opt.value
                        ? "bg-black border-black text-white"
                        : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Days per Week</label>
              <input
                type="number" min="1" max="7" value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-300 focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5 transition"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-black hover:bg-gray-900 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all duration-150 tracking-tight"
            >
              Calculate →
            </button>
          </div>

          {/* Results */}
          {results && score ? (
            <div className="space-y-4">

              {/* CO2 Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Daily",   value: results.daily },
                  { label: "Weekly",  value: results.weekly },
                  { label: "Monthly", value: results.monthly },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{s.label}</p>
                    <p className="text-3xl font-black text-gray-900 mt-1 leading-none">{s.value}</p>
                    <p className="text-[10px] text-gray-300 mt-1.5 font-medium">kg CO₂</p>
                  </div>
                ))}
              </div>

              {/* Score */}
              <div className={`${score.bg} border ${score.border} rounded-2xl p-5 space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Carbon Level</span>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white border ${score.border} ${score.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${score.dot}`} />
                    {score.label}
                  </span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div
                    className={`${score.bar} h-1.5 rounded-full transition-all duration-700`}
                    style={{ width: `${score.progress}%` }}
                  />
                </div>
                <p className={`text-sm font-medium ${score.text}`}>{score.message}</p>
              </div>

              {/* Points + Streak */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500 rounded-2xl p-5 text-white">
                  <p className="text-green-100 text-[10px] font-semibold uppercase tracking-widest">Today's Points</p>
                  <p className="text-5xl font-black mt-1 leading-none">{results.points}</p>
                  <p className="text-green-200 text-xs mt-2">Total: {totalPoints} pts</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">Streak</p>
                  <p className="text-5xl font-black text-gray-900 mt-1 leading-none">🔥{MOCK_STREAK}</p>
                  <p className="text-gray-400 text-xs mt-2">days green</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-14 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl">
                🌍
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">Ready to calculate?</p>
                <p className="text-gray-400 text-sm mt-1">Fill in your commute details and hit Calculate.</p>
              </div>
            </div>
          )}
        </div>

        {results && (
          <>
            {/* ── Tips + Leaderboard ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Smart Tips */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Smart Tips</p>
                  <span className="text-[10px] font-bold border border-green-200 bg-green-50 text-green-600 px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Personalised
                  </span>
                </div>
                <div className="space-y-3">
                  {getTips(mode, results.daily).map((tip, i) => (
                    <div key={i} className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tip.title}</p>
                        <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">{tip.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Leaderboard</p>
                <div className="space-y-2">
                  {leaderboard!.map((entry, i) => {
                    const isYou  = entry.name === "You";
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <div
                        key={entry.name}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                          isYou
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <span className="w-7 text-sm font-bold text-center text-gray-300">
                          {i < 3 ? medals[i] : `${i + 1}`}
                        </span>
                        <span className={`flex-1 text-sm font-semibold ${isYou ? "text-green-700" : "text-gray-700"}`}>
                          {entry.name}{isYou && " 👤"}
                        </span>
                        <span className={`text-sm font-bold tabular-nums ${isYou ? "text-green-600" : "text-gray-400"}`}>
                          {entry.points} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Impact ──────────────────────────────────────────────────── */}
            <div className="bg-black rounded-2xl p-7 sm:p-9">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Monthly Impact</p>
                  <p className="text-white font-black text-2xl mt-1">Your footprint, visualised.</p>
                </div>
                <span className="text-3xl">🌍</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: results.monthly, unit: "kg CO₂", label: "emitted this month" },
                  { value: `${treesNeeded} trees`, unit: "🌳", label: "needed to offset this" },
                  { value: kmEquiv, unit: "km", label: "by car equivalent" },
                ].map((item, i) => (
                  <div key={i} className="border border-white/10 rounded-xl p-5">
                    <p className="text-3xl font-black text-white leading-none">{item.value}</p>
                    <p className="text-green-400 text-sm font-semibold mt-1">{item.unit}</p>
                    <p className="text-gray-500 text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Rewards ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Rewards</p>
                <span className="text-sm text-gray-400">
                  Balance:{" "}
                  <span className="font-black text-green-500">{totalPoints} pts</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REWARDS.map((reward) => {
                  const canRedeem = totalPoints >= reward.points;
                  return (
                    <div
                      key={reward.title}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                        canRedeem ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <span className="text-3xl flex-shrink-0">{reward.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{reward.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{reward.points} pts</p>
                      </div>
                      <button
                        disabled={!canRedeem}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                          canRedeem
                            ? "bg-black text-white hover:bg-gray-800 active:scale-95"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
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

      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-gray-300">
          <span className="flex items-center gap-1.5 font-medium text-gray-900">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            EmitLess
          </span>
          <span>Making every commute count 🌱</span>
        </div>
      </footer>
    </div>
  );
}
