export type TransportMode = "car" | "bus" | "metro" | "bike" | "walk";

export interface CommuteInput {
  distanceKm: number;
  mode: TransportMode;
  daysPerWeek: number;
}

export interface CarbonResult {
  dailyCO2: number;
  weeklyCO2: number;
  monthlyCO2: number;
  score: ScoreLevel;
  points: number;
  treesNeeded: number;
}

export type ScoreLevel = "excellent" | "moderate" | "high";

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  co2Saved: number;
  isCurrentUser?: boolean;
}

export interface Tip {
  id: string;
  icon: string;
  title: string;
  description: string;
  impact: string;
}
