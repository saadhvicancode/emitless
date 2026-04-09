import type { LeaderboardEntry } from "./types";

export const CURRENT_USER_ID = "you";

export const leaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Ananya Sharma",
    avatar: "AS",
    points: 980,
    rank: 1,
    co2Saved: 42.1,
  },
  {
    id: "2",
    name: "Rohan Mehta",
    avatar: "RM",
    points: 915,
    rank: 2,
    co2Saved: 38.6,
  },
  {
    id: "3",
    name: "Priya Nair",
    avatar: "PN",
    points: 870,
    rank: 3,
    co2Saved: 35.2,
  },
  {
    id: "4",
    name: "Vikram Das",
    avatar: "VD",
    points: 760,
    rank: 4,
    co2Saved: 29.8,
  },
  {
    id: CURRENT_USER_ID,
    name: "You",
    avatar: "ME",
    points: 0,
    rank: 5,
    co2Saved: 0,
    isCurrentUser: true,
  },
  {
    id: "6",
    name: "Sneha Kapoor",
    avatar: "SK",
    points: 610,
    rank: 6,
    co2Saved: 22.1,
  },
  {
    id: "7",
    name: "Arjun Pillai",
    avatar: "AP",
    points: 540,
    rank: 7,
    co2Saved: 19.4,
  },
];
