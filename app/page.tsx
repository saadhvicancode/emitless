"use client";

import { useState } from "react";
import CarbonTracker from "@/components/CarbonTracker";
import CarbonResultPanel from "@/components/CarbonResultPanel";
import type { CommuteInput, CarbonResult } from "@/lib/types";
import { calculate } from "@/lib/calculations";

const DEFAULT_INPUT: CommuteInput = {
  distanceKm: 12,
  mode: "car",
  daysPerWeek: 5,
};

export default function HomePage() {
  const [input, setInput] = useState<CommuteInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [calculated, setCalculated] = useState(false);

  function handleCalculate(newInput: CommuteInput) {
    setInput(newInput);
    const r = calculate(newInput);
    setResult(r);
    setCalculated(true);
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          GCC Carbon Tracker · Beta
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Know your footprint.{" "}
          <span className="text-brand-600">Earn your green.</span>
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto">
          Log your daily commute and see exactly how much CO₂ you emit — then compete with colleagues to drive it down.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Tracker — 2 cols */}
        <div className="lg:col-span-2">
          <CarbonTracker initial={input} onCalculate={handleCalculate} />
        </div>

        {/* Results — 3 cols */}
        <div className="lg:col-span-3">
          <CarbonResultPanel result={result} input={input} calculated={calculated} />
        </div>
      </div>
    </div>
  );
}
