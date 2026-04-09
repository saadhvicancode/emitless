import type { TransportMode, CommuteInput, CarbonResult, ScoreLevel, Tip } from "./types";

export const EMISSION_FACTORS: Record<TransportMode, number> = {
  car: 0.21,
  bus: 0.10,
  metro: 0.05,
  bike: 0,
  walk: 0,
};

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  car: "Car",
  bus: "Bus",
  metro: "Metro / Train",
  bike: "Bicycle",
  walk: "Walking",
};

export const TRANSPORT_ICONS: Record<TransportMode, string> = {
  car: "🚗",
  bus: "🚌",
  metro: "🚇",
  bike: "🚲",
  walk: "🚶",
};

function getScore(dailyCO2: number): ScoreLevel {
  if (dailyCO2 < 2) return "excellent";
  if (dailyCO2 <= 5) return "moderate";
  return "high";
}

function getPoints(dailyCO2: number, daysPerWeek: number): number {
  // Max 100 pts/day at 0 CO2, scales down
  const basePoints = Math.max(0, 100 - dailyCO2 * 20);
  return Math.round(basePoints * (daysPerWeek / 5));
}

function getTrees(monthlyCO2: number): number {
  // One tree absorbs ~21 kg CO2/year → ~1.75 kg/month
  return Math.ceil(monthlyCO2 / 1.75);
}

export function calculate(input: CommuteInput): CarbonResult {
  const { distanceKm, mode, daysPerWeek } = input;
  const factor = EMISSION_FACTORS[mode];
  const dailyCO2 = distanceKm * factor;
  const weeklyCO2 = dailyCO2 * daysPerWeek;
  const monthlyCO2 = weeklyCO2 * 4.33;

  return {
    dailyCO2: Math.round(dailyCO2 * 100) / 100,
    weeklyCO2: Math.round(weeklyCO2 * 100) / 100,
    monthlyCO2: Math.round(monthlyCO2 * 100) / 100,
    score: getScore(dailyCO2),
    points: getPoints(dailyCO2, daysPerWeek),
    treesNeeded: getTrees(monthlyCO2),
  };
}

export function getTips(input: CommuteInput): Tip[] {
  const { mode, distanceKm } = input;
  const tips: Tip[] = [];

  if (mode === "car") {
    tips.push({
      id: "switch-metro",
      icon: "🚇",
      title: "Switch to Metro",
      description: `Taking the metro for your ${distanceKm} km commute cuts your emissions by 76% vs. driving.`,
      impact: "Save ~" + Math.round(distanceKm * (0.21 - 0.05)) + " kg CO₂/day",
    });
    tips.push({
      id: "carpool",
      icon: "🤝",
      title: "Carpool with colleagues",
      description: "Splitting your commute with just one colleague halves your per-person emissions immediately.",
      impact: "Save ~" + Math.round(distanceKm * 0.21 * 0.5 * 100) / 100 + " kg CO₂/day",
    });
  }

  if (mode === "bus" && distanceKm <= 10) {
    tips.push({
      id: "switch-bike",
      icon: "🚲",
      title: "Try cycling",
      description: `${distanceKm} km is very bikeable! Zero emissions and a health boost.`,
      impact: "Save 100% emissions",
    });
  }

  if (mode === "metro" || mode === "bus") {
    tips.push({
      id: "wfh",
      icon: "🏠",
      title: "Work from home 1 day",
      description: "Even one WFH day per week reduces your weekly commute footprint by 20%.",
      impact: "Save 20% weekly CO₂",
    });
  }

  if (mode === "bike" || mode === "walk") {
    tips.push({
      id: "keep-it-up",
      icon: "🌱",
      title: "You're a carbon champion!",
      description: "Zero-emission commuting is the gold standard. Encourage a colleague to join you.",
      impact: "Inspire others to save",
    });
    tips.push({
      id: "offset",
      icon: "🌳",
      title: "Go further — plant a tree",
      description: "Your commute is already green. Consider a verified tree-planting offset for other life emissions.",
      impact: "Amplify your impact",
    });
  }

  if (EMISSION_FACTORS[mode] * distanceKm > 5) {
    tips.push({
      id: "reduce-days",
      icon: "📅",
      title: "Negotiate a hybrid schedule",
      description: "High emissions + long distance? Two WFH days per week can cut your monthly footprint by 40%.",
      impact: "Save up to 40% monthly CO₂",
    });
  }

  return tips.slice(0, 2);
}
