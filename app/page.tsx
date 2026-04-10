"use client";

import { useState } from "react";

type TransportMode = "car" | "bus" | "metro" | "bike" | "walk";

const EMISSION_FACTORS: Record<TransportMode, number> = {
  car: 0.21,
  bus: 0.1,
  metro: 0.05,
  bike: 0,
  walk: 0,
};

type ScoreLevel = "excellent" | "moderate" | "high";

const SCORE_CONFIG: Record<
  ScoreLevel,
  { label: string; message: string; badge: string; text: string }
> = {
  excellent: {
    label: "Excellent",
    message: "Great job! You're low impact 🌱",
    badge: "bg-green-100 border-green-200",
    text: "text-green-700",
  },
  moderate: {
    label: "Moderate",
    message: "Good, but room to improve",
    badge: "bg-yellow-100 border-yellow-200",
    text: "text-yellow-700",
  },
  high: {
    label: "High",
    message: "Consider switching to greener options",
    badge: "bg-red-100 border-red-200",
    text: "text-red-700",
  },
};

function getScore(dailyCO2: number): ScoreLevel {
  if (dailyCO2 < 2) return "excellent";
  if (dailyCO2 <= 5) return "moderate";
  return "high";
}

interface Results {
  daily: number;
  weekly: number;
  monthly: number;
  score: ScoreLevel;
}

export default function HomePage() {
  const [distance, setDistance] = useState<string>("");
  const [mode, setMode] = useState<TransportMode>("car");
  const [days, setDays] = useState<string>("");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const km = parseFloat(distance);
    const daysNum = parseFloat(days);
    if (!km || !daysNum) return;

    const factor = EMISSION_FACTORS[mode];
    const daily = km * factor;
    const weekly = daily * daysNum;
    const monthly = weekly * 4;

    setResults({
      daily: Math.round(daily * 100) / 100,
      weekly: Math.round(weekly * 100) / 100,
      monthly: Math.round(monthly * 100) / 100,
      score: getScore(daily),
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">EmitLess 🌱</h1>
            <p className="mt-1 text-sm text-gray-500">
              Calculate your daily commute carbon footprint
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                min="0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 15"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Transport mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transport mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as TransportMode)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              >
                <option value="car">🚗 Car</option>
                <option value="bus">🚌 Bus</option>
                <option value="metro">🚇 Metro</option>
                <option value="bike">🚲 Bike</option>
                <option value="walk">🚶 Walk</option>
              </select>
            </div>

            {/* Days per week */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days per week
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={calculate}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-150"
          >
            Calculate
          </button>

          {/* Results */}
          {results && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 space-y-3">
              <h2 className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                Your emissions
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Daily</span>
                  <span className="font-semibold text-gray-900">
                    {results.daily} kg CO₂
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Weekly</span>
                  <span className="font-semibold text-gray-900">
                    {results.weekly} kg CO₂
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Monthly</span>
                  <span className="font-semibold text-gray-900">
                    {results.monthly} kg CO₂
                  </span>
                </div>
              </div>

              {/* Score badge */}
              {(() => {
                const cfg = SCORE_CONFIG[results.score];
                return (
                  <div className={`border rounded-xl p-4 ${cfg.badge}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${cfg.text}`}>
                        Your carbon level:{" "}
                        <span className="font-bold">{cfg.label}</span>
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${cfg.text}`}>{cfg.message}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
