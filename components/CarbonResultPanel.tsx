"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { CarbonResult, CommuteInput } from "@/lib/types";
import { getTips } from "@/lib/calculations";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  result: CarbonResult | null;
  input: CommuteInput;
  calculated: boolean;
}

const SCORE_CONFIG = {
  excellent: {
    label: "Excellent",
    color: "text-brand-600",
    bg: "bg-brand-50",
    border: "border-brand-200",
    bar: "bg-brand-500",
    width: "w-[20%]",
    emoji: "🌱",
  },
  moderate: {
    label: "Moderate",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    bar: "bg-yellow-400",
    width: "w-[55%]",
    emoji: "⚡",
  },
  high: {
    label: "High",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-400",
    width: "w-[90%]",
    emoji: "🔥",
  },
};

export default function CarbonResultPanel({ result, input, calculated }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (calculated) {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [result, calculated]);

  if (!calculated || !result) {
    return (
      <div className="card flex flex-col items-center justify-center min-h-[420px] gap-4 text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl">
          🌍
        </div>
        <div>
          <p className="text-gray-700 font-semibold text-base">Your impact report awaits</p>
          <p className="text-gray-400 text-sm mt-1">
            Fill in your commute details and hit Calculate to see your carbon footprint, score, and tips.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-2">
          {["CO₂ Daily", "Points", "Score"].map((label) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <div className="w-8 h-2.5 bg-gray-200 rounded mb-2 mx-auto animate-pulse" />
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sc = SCORE_CONFIG[result.score];
  const tips = getTips(input);

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Top row: CO2 stats + Score */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Daily */}
        <StatCard
          label="Daily CO₂"
          value={result.dailyCO2}
          unit="kg"
          icon="📅"
          highlight
        />
        {/* Weekly */}
        <StatCard
          label="Weekly CO₂"
          value={result.weeklyCO2}
          unit="kg"
          icon="📆"
        />
        {/* Monthly */}
        <StatCard
          label="Monthly CO₂"
          value={result.monthlyCO2}
          unit="kg"
          icon="🗓"
        />
      </div>

      {/* Score + Points row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Score */}
        <div className={clsx("card p-5 border", sc.border, sc.bg)}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Carbon Score
          </p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{sc.emoji}</span>
            <div>
              <p className={clsx("text-xl font-bold", sc.color)}>{sc.label}</p>
              <p className="text-xs text-gray-400">
                {result.dailyCO2} kg CO₂ per day
              </p>
            </div>
          </div>
          {/* Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={clsx("h-full rounded-full transition-all duration-700", sc.bar, sc.width)}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Points */}
        <div className="card p-5 bg-gradient-to-br from-brand-600 to-brand-700 border-0 text-white">
          <p className="text-xs font-semibold text-brand-200 uppercase tracking-wide mb-3">
            Points Earned Today
          </p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-bold tracking-tight">
              <AnimatedNumber value={result.points} />
            </span>
            <span className="text-brand-200 text-sm mb-1">pts</span>
          </div>
          <p className="text-brand-200 text-xs mt-1">
            {result.points >= 80
              ? "🔥 Top performer territory!"
              : result.points >= 50
              ? "👍 Good going — keep it green"
              : "📈 Lower emissions = more points"}
          </p>
          <div className="mt-4 pt-3 border-t border-brand-500 flex items-center gap-2">
            <span className="text-brand-200 text-xs">🌳 Trees needed to offset monthly:</span>
            <span className="font-bold text-sm">{result.treesNeeded}</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="card p-5 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            AI-Powered Tips
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-colors group"
              >
                <span className="text-2xl shrink-0">{tip.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">
                    {tip.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {tip.description}
                  </p>
                  <span className="inline-block mt-1.5 text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    {tip.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact equivalence */}
      <ImpactBar co2={result.monthlyCO2} trees={result.treesNeeded} />
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className={clsx("card p-4", highlight && "ring-2 ring-brand-200")}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <span className="text-base">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">
          <AnimatedNumber value={value} decimals={2} />
        </span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">CO₂ equivalent</p>
    </div>
  );
}

function ImpactBar({ co2, trees }: { co2: number; trees: number }) {
  const km = Math.round(co2 * 6);
  const phones = Math.round(co2 * 121);

  return (
    <div className="card p-4 bg-gray-50 border-dashed">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        What does {co2} kg CO₂/month equal?
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <EquivCard icon="🌳" value={trees} label="trees to offset" />
        <EquivCard icon="🚗" value={km} label="km driven equiv." />
        <EquivCard icon="📱" value={phones} label="phone charges" />
      </div>
    </div>
  );
}

function EquivCard({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-bold text-gray-800 text-lg">{value.toLocaleString()}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
