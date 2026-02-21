import type { Athlete } from "../data/mockData";
import { athletes as mockAthletes } from "../data/mockData";

const STORAGE_KEY = "athletes";

export const getAthletes = (): Athlete[] => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse athletes from localStorage:", e);
      // Fall through to seed with mock data
    }
  }

  // Seed with mock data on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAthletes));
  return mockAthletes;
};

export const saveAthletes = (athletes: Athlete[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(athletes));
};

export const addAthlete = (athleteData: Omit<Athlete, 'id'>): Athlete => {
  const athletes = getAthletes();

  const newAthlete: Athlete = {
    ...athleteData,
    id: Date.now(), // Generate numeric ID from timestamp
  };

  athletes.push(newAthlete);
  saveAthletes(athletes);

  return newAthlete;
};
