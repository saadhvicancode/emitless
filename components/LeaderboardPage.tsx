"use client";

import { useState } from "react";
import clsx from "clsx";
import { leaderboardData, CURRENT_USER_ID } from "@/lib/mockData";
import type { LeaderboardEntry } from "@/lib/types";

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function LeaderboardPage() {
  const [userPoints, setUserPoints] = useState(420);

  // Merge user points into leaderboard and re-rank
  const merged: LeaderboardEntry[] = leaderboardData
    .map((e) =>
      e.id === CURRENT_USER_ID ? { ...e, points: userPoints } : e
    )
    .sort((a, b) => b.points - a.points)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const currentUser = merged.find((e) => e.id === CURRENT_USER_ID)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4 space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span>🏆</span> Weekly Leaderboard
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Green Commute Rankings
        </h1>
        <p className="text-gray-400 text-sm">
          Updated daily · Bangalore GCC Hub · Week 14, 2024
        </p>
      </div>

      {/* Current user spotlight */}
      <div className="card p-5 bg-gradient-to-r from-brand-600 to-brand-700 text-white border-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-bold">
              ME
            </div>
            <div>
              <p className="text-brand-100 text-xs font-medium uppercase tracking-wide">Your Standing</p>
              <p className="text-xl font-bold">
                #{currentUser.rank} out of {merged.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="Points" value={currentUser.points.toString()} />
            <Stat label="CO₂ Saved" value={`${currentUser.co2Saved} kg`} />
            <Stat
              label="Status"
              value={
                currentUser.rank === 1
                  ? "Champion 🏆"
                  : currentUser.rank <= 3
                  ? "Top 3 🌟"
                  : "Climbing 📈"
              }
            />
          </div>
        </div>

        {/* Adjust points (demo) */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-brand-200 text-xs shrink-0">Simulate your points (demo):</p>
            <input
              type="range"
              min={0}
              max={1000}
              value={userPoints}
              onChange={(e) => setUserPoints(Number(e.target.value))}
              className="flex-1 max-w-48 accent-white"
            />
            <span className="text-white font-bold text-sm">{userPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-800">All Participants</p>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
            {merged.length} employees
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {merged.map((entry) => (
            <LeaderboardRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BadgeCard
          icon="🌱"
          title="Green Starter"
          description="Log 5 days of zero-emission commutes"
          earned
        />
        <BadgeCard
          icon="⚡"
          title="Metro Master"
          description="Use public transit 20 days straight"
          earned={false}
        />
        <BadgeCard
          icon="🏆"
          title="Team Champion"
          description="Reach #1 on the leaderboard"
          earned={currentUser.rank === 1}
        />
      </div>
    </div>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const isTop3 = entry.rank <= 3;
  const barWidth = Math.max(8, Math.round((entry.points / 1000) * 100));

  return (
    <div
      className={clsx(
        "flex items-center gap-4 px-5 py-4 transition-colors",
        entry.isCurrentUser
          ? "bg-brand-50 hover:bg-brand-100/60"
          : "hover:bg-gray-50/80"
      )}
    >
      {/* Rank */}
      <div className="w-8 text-center shrink-0">
        {MEDAL[entry.rank] ? (
          <span className="text-xl">{MEDAL[entry.rank]}</span>
        ) : (
          <span
            className={clsx(
              "text-sm font-bold",
              entry.isCurrentUser ? "text-brand-600" : "text-gray-400"
            )}
          >
            #{entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={clsx(
          "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
          entry.isCurrentUser
            ? "bg-brand-500 text-white"
            : isTop3
            ? "bg-amber-100 text-amber-700"
            : "bg-gray-100 text-gray-500"
        )}
      >
        {entry.avatar}
      </div>

      {/* Name + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={clsx(
              "text-sm font-semibold truncate",
              entry.isCurrentUser ? "text-brand-700" : "text-gray-800"
            )}
          >
            {entry.name}
          </p>
          {entry.isCurrentUser && (
            <span className="text-xs bg-brand-100 text-brand-600 font-semibold px-1.5 py-0.5 rounded-full shrink-0">
              You
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full max-w-40">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-500",
              entry.isCurrentUser ? "bg-brand-500" : isTop3 ? "bg-amber-400" : "bg-gray-300"
            )}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* CO2 saved */}
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-xs text-gray-400">CO₂ saved</p>
        <p className="text-sm font-semibold text-gray-700">{entry.co2Saved} kg</p>
      </div>

      {/* Points */}
      <div className="text-right shrink-0 w-20">
        <p className="text-xs text-gray-400">Points</p>
        <p
          className={clsx(
            "text-sm font-bold",
            entry.isCurrentUser ? "text-brand-600" : "text-gray-800"
          )}
        >
          {entry.points.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-brand-200 text-xs">{label}</p>
      <p className="text-white font-bold text-sm">{value}</p>
    </div>
  );
}

function BadgeCard({
  icon,
  title,
  description,
  earned,
}: {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
}) {
  return (
    <div
      className={clsx(
        "card p-4 flex items-start gap-3 transition-all",
        earned ? "border-brand-200 bg-brand-50" : "opacity-60 grayscale"
      )}
    >
      <div
        className={clsx(
          "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0",
          earned ? "bg-brand-100" : "bg-gray-100"
        )}
      >
        {icon}
      </div>
      <div>
        <p className={clsx("text-sm font-semibold", earned ? "text-brand-700" : "text-gray-600")}>
          {title}
          {earned && <span className="ml-1.5 text-xs bg-brand-200 text-brand-700 px-1.5 py-0.5 rounded-full">Earned</span>}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
