# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev -- -p 3005   # Start dev server (ports 3000–3002 are taken by other system processes)
npm run build            # Production build
npm run lint             # ESLint
```

No test suite configured.

## Architecture

EmitLess is a single-page Next.js 14 (App Router) carbon footprint calculator for commutes.

**All logic lives in `app/page.tsx`** — there are no separate lib files or components yet.

### Data flow

1. User fills in distance (km), transport mode, days/week
2. `calculate()` runs on button click — multiplies distance × emission factor × days
3. Results (daily/weekly/monthly CO2 + score + points) stored in `useState`
4. Results card, score badge, smart tips, and leaderboard all render conditionally when results is non-null

### Emission factors (kg CO2/km)

| Mode  | Factor |
|-------|--------|
| Car   | 0.21   |
| Bus   | 0.10   |
| Metro | 0.05   |
| Bike  | 0      |
| Walk  | 0      |

### Score + points logic (based on daily CO2)

| Daily CO2 | Level     | Color  | Points |
|-----------|-----------|--------|--------|
| < 2 kg    | Excellent | Green  | 100    |
| 2–5 kg    | Moderate  | Yellow | 50     |
| > 5 kg    | High      | Red    | 10     |

### Smart tips logic (`getTips`)

- mode = car → "Try metro or bus"
- daily > 5 → "Reduce commute days or carpool"
- otherwise → "Keep up the good work"
- Returns max 2 tips, shown as gray cards

### Leaderboard

- 4 hardcoded mock users in `MOCK_USERS`
- After calculate, "You" is injected with the computed points
- Combined array sorted by points descending, top 5 shown
- "You" row highlighted with green background + border

### Styling

- Tailwind CSS only, no extra UI library
- `bg-gray-50` page background, white card with `rounded-2xl shadow-md`
- Green accent: `bg-green-500` button
- Score badge uses conditional Tailwind classes from `SCORE_CONFIG` map

## Git / GitHub

- Repo: https://github.com/saadhvicancode/emitless
- Branch: `main`
- Commit and push after every meaningful change so the user can revert if needed
