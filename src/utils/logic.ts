import type { Athlete, Workout } from "../data/mockData";

export interface Alert {
  athleteId: number;
  athleteName: string;
  type: "GHOST" | "HYPE" | "SHUFFLE" | "NEWBIE";
  priority: number;
  message: string;
}

export const generateFocusList = (athletes: Athlete[], workouts: Workout[]): Alert[] => {
  const alerts: Alert[] = [];
  // Hardcoded "Today" to match the mock data dates
  const today = new Date("2026-02-03"); 

  athletes.forEach((athlete) => {
    // Get workouts for this specific athlete
    const athleteWorkouts = workouts.filter((w) => w.athleteId === athlete.id);

    // ---------------------------------------------------------
    // RULE 1: GHOST PROTOCOL (High Priority)
    // Trigger: Missed 2+ workouts in the past
    // ---------------------------------------------------------
    const missed = athleteWorkouts.filter(w => w.completedDate === null && new Date(w.workoutDate) < today);
    
    if (missed.length >= 2) {
      alerts.push({ 
        athleteId: athlete.id, 
        athleteName: athlete.firstName, 
        type: "GHOST", 
        priority: 1, 
        message: `Missed ${missed.length} recent workouts` 
      });
    }

    // ---------------------------------------------------------
    // RULE 2: HYPE BELL (Wins)
    // Trigger: High intensity workout completed today
    // ---------------------------------------------------------
    const bigWins = athleteWorkouts.filter(w => {
        const isToday = w.completedDate === "2026-02-03";
        const isHard = w.ifActual > 0.85 || w.tssActual > 150;
        return isToday && isHard;
    });

    if (bigWins.length > 0) {
      alerts.push({ 
        athleteId: athlete.id, 
        athleteName: athlete.firstName, 
        type: "HYPE", 
        priority: 2, 
        message: `Crushed "${bigWins[0].title}"!` 
      });
    }

    // ---------------------------------------------------------
    // RULE 3: NEWBIE SHIELD (Retention)
    // Trigger: Member for < 90 days
    // ---------------------------------------------------------
    const joinDate = new Date(athlete.memberSince);
    const daysSince = (today.getTime() - joinDate.getTime()) / (1000 * 3600 * 24);

    if (daysSince < 90 && daysSince > 0) {
        // Only flag if they aren't already a Ghost (to avoid double alerts)
        const isGhost = alerts.some(a => a.athleteId === athlete.id && a.type === "GHOST");
        if (!isGhost) {
            alerts.push({ 
                athleteId: athlete.id, 
                athleteName: athlete.firstName, 
                type: "NEWBIE", 
                priority: 3, 
                message: `Day ${Math.floor(daysSince)} check-in` 
            });
        }
    }

    // ---------------------------------------------------------
    // RULE 4: SCHEDULE SHUFFLE (Instability)
    // Trigger: Completed date != Planned date
    // ---------------------------------------------------------
    const shuffled = athleteWorkouts.filter(w => w.completedDate && w.workoutDate !== w.completedDate);
    
    if (shuffled.length > 0) {
        alerts.push({ 
            athleteId: athlete.id, 
            athleteName: athlete.firstName, 
            type: "SHUFFLE", 
            priority: 3, 
            message: "Moved workouts around" 
        });
    }
  });

  // Sort by Priority (1 is highest)
  return alerts.sort((a, b) => a.priority - b.priority);
};