"use client";

import { useState } from "react";
import clsx from "clsx";
import type { CommuteInput, TransportMode } from "@/lib/types";
import { TRANSPORT_LABELS, TRANSPORT_ICONS } from "@/lib/calculations";

const MODES: TransportMode[] = ["car", "bus", "metro", "bike", "walk"];

interface Props {
  initial: CommuteInput;
  onCalculate: (input: CommuteInput) => void;
}

export default function CarbonTracker({ initial, onCalculate }: Props) {
  const [mode, setMode] = useState<TransportMode>(initial.mode);
  const [distance, setDistance] = useState(initial.distanceKm);
  const [days, setDays] = useState(initial.daysPerWeek);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCalculate({ distanceKm: distance, mode, daysPerWeek: days });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 flex flex-col gap-6 h-full"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Commute Details</h2>
        <p className="text-sm text-gray-400 mt-0.5">Enter your typical daily commute</p>
      </div>

      {/* Transport Mode */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Mode of Transport
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={clsx(
                "flex flex-col items-center gap-1 py-3 px-1 rounded-xl border-2 text-xs font-medium transition-all duration-150",
                mode === m
                  ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                  : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-white"
              )}
            >
              <span className="text-xl">{TRANSPORT_ICONS[m]}</span>
              <span className="leading-tight text-center hidden sm:block">
                {TRANSPORT_LABELS[m].split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">
          {TRANSPORT_ICONS[mode]} {TRANSPORT_LABELS[mode]}
        </p>
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Distance (one way)
          </label>
          <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
            {distance} km
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={80}
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>1 km</span>
          <span>80 km</span>
        </div>
      </div>

      {/* Days per week */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Days per Week
          </label>
          <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
            {days} day{days !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={clsx(
                "flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150",
                days === d
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-100 bg-gray-50 text-gray-500 hover:border-brand-200 hover:bg-brand-50"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md mt-auto text-sm tracking-wide"
      >
        Calculate My Footprint →
      </button>
    </form>
  );
}
