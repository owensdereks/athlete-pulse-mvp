export interface Athlete {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  memberSince: string;
}

export interface Workout {
  id: number;
  athleteId: number;
  title: string;
  workoutDate: string;
  completedDate: string | null;
  ifPlanned: number;
  ifActual: number;
  tssPlanned: number;
  tssActual: number;
}

export const athletes: Athlete[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    memberSince: "2025-12-01",
  },
  {
    id: 2,
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.c@example.com",
    memberSince: "2024-06-15",
  },
  {
    id: 3,
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex.r@example.com",
    memberSince: "2025-11-20",
  },
  {
    id: 4,
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.d@example.com",
    memberSince: "2023-08-10",
  },
];

export const workouts: Workout[] = [
  {
    id: 101,
    athleteId: 1,
    title: "Endurance Base",
    workoutDate: "2026-01-30",
    completedDate: "2026-02-04",
    ifPlanned: 0.65,
    ifActual: 0,
    tssPlanned: 80,
    tssActual: 0,
  },
  {
    id: 102,
    athleteId: 1,
    title: "Recovery Ride",
    workoutDate: "2026-02-01",
    completedDate: null,
    ifPlanned: 0.5,
    ifActual: 0,
    tssPlanned: 40,
    tssActual: 0,
  },
  {
    id: 201,
    athleteId: 2,
    title: "VO2 Max Intervals",
    workoutDate: "2026-02-03",
    completedDate: "2026-02-03",
    ifPlanned: 0.85,
    ifActual: 0.92,
    tssPlanned: 120,
    tssActual: 165,
  },
  {
    id: 202,
    athleteId: 2,
    title: "Sweet Spot",
    workoutDate: "2026-02-01",
    completedDate: "2026-02-01",
    ifPlanned: 0.75,
    ifActual: 0.76,
    tssPlanned: 90,
    tssActual: 92,
  },
  {
    id: 301,
    athleteId: 3,
    title: "Foundation Build",
    workoutDate: "2026-02-02",
    completedDate: "2026-02-02",
    ifPlanned: 0.6,
    ifActual: 0.62,
    tssPlanned: 65,
    tssActual: 68,
  },
  {
    id: 401,
    athleteId: 4,
    title: "Tempo Ride",
    workoutDate: "2026-01-31",
    completedDate: "2026-02-02",
    ifPlanned: 0.78,
    ifActual: 0.79,
    tssPlanned: 95,
    tssActual: 97,
  },
  {
    id: 402,
    athleteId: 4,
    title: "Threshold Work",
    workoutDate: "2026-02-01",
    completedDate: "2026-02-03",
    ifPlanned: 0.82,
    ifActual: 0.81,
    tssPlanned: 110,
    tssActual: 108,
  },
];
