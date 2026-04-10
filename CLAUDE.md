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

EmitLess is a single-page Next.js 14 (App Router) carbon footprint calculator for commutes. It's a polished, YC-style MVP.

**All logic lives in `app/page.tsx`** — no separate lib files or components yet.

### Page sections (top to bottom)

1. **Sticky header** — logo, total points, streak badge
2. **Hero** — tagline
3. **Calculator + Results** (2-col grid on desktop)
   - Left: input card (distance, transport mode selector, days/week, calculate button)
   - Right: CO2 stats grid, score with progress bar, points + streak cards
4. **Smart Tips + Leaderboard** (2-col grid)
5. **Impact Visualization** — gradient banner with monthly CO2, trees, km equivalent
6. **Rewards** — grid of redeemable rewards (unlocked based on total points)

All sections below the calculator are hidden until `results` is non-null.

### Data flow

1. User fills inputs → `calculate()` on button click
2. `results` state set with: daily/weekly/monthly CO2, score, points
3. `totalPoints = MOCK_CUMULATIVE (240) + results.points`
4. Leaderboard: `MOCK_LEADERBOARD` + `{ name: "You", points: totalPoints }`, sorted, top 5

### Key constants

- `MOCK_CUMULATIVE = 240` — baseline points before today
- `MOCK_STREAK = 3` — hardcoded streak days
- `MOCK_LEADERBOARD` — 4 mock users

### Emission factors (kg CO2/km)

| Mode  | Factor |
|-------|--------|
| Car   | 0.21   |
| Bus   | 0.10   |
| Metro | 0.05   |
| Bike  | 0      |
| Walk  | 0      |

### Score + points (based on daily CO2)

| Daily CO2 | Level     | Color  | Points | Progress bar |
|-----------|-----------|--------|--------|--------------|
| < 2 kg    | Excellent | Green  | 100    | 15%          |
| 2–5 kg    | Moderate  | Yellow | 50     | 52%          |
| > 5 kg    | High      | Red    | 10     | 88%          |

### Smart tips (`getTips`)

- mode = car → suggest metro/bus
- daily > 5 → suggest WFH/carpool
- else → positive reinforcement
- Always returns exactly 2 tips

### Rewards

- 4 hardcoded rewards in `REWARDS`
- Redeem button enabled when `totalPoints >= reward.points`
- No backend — button click does nothing (UI only)

### Styling

- Tailwind only, no UI library
- Background: `bg-gradient-to-br from-emerald-50 via-white to-teal-50`
- Cards: `bg-white rounded-2xl border border-gray-100 shadow-sm`
- Primary button: gradient `from-emerald-500 to-teal-500`
- Transport mode: button grid (5 cols) with active emerald highlight
- Impact section: full-width emerald-to-teal gradient banner

## Git / GitHub

- Repo: https://github.com/saadhvicancode/emitless
- Branch: `main`
- Commit and push after every meaningful change so the user can revert if needed
