import type { Athlete } from "../data/mockData";

export interface Alert {
  athleteId: number;
  athleteName: string;
  type: "GHOST" | "HYPE" | "SHUFFLE" | "NEWBIE" | "WARNING";
  priority: number;
  message: string;
}

export type AthleteStatus = "critical" | "warning" | "on-track";

export const getAthleteStatus = (athlete: Athlete): AthleteStatus => {
  const today = new Date();

  // Compute daysSinceContact
  const contactDate = athlete.lastContactedDate
    ? new Date(athlete.lastContactedDate)
    : new Date(athlete.memberSince);

  const daysSinceContact = Math.floor((today.getTime() - contactDate.getTime()) / (1000 * 3600 * 24));

  // Compute tenureStatus
  const memberDate = new Date(athlete.memberSince);
  const daysSinceMember = Math.floor((today.getTime() - memberDate.getTime()) / (1000 * 3600 * 24));
  const tenureStatus = daysSinceMember < 90 ? 'new' : 'tenured';

  // Apply thresholds
  if (tenureStatus === 'tenured' && daysSinceContact >= 7) {
    return "critical";
  } else if (tenureStatus === 'new' && daysSinceContact >= 3) {
    return "critical";
  } else if (tenureStatus === 'tenured' && daysSinceContact >= 6) {
    return "warning";
  } else if (tenureStatus === 'new' && daysSinceContact >= 2) {
    return "warning";
  }

  return "on-track";
};

export const generateFocusList = (athletes: Athlete[]): Alert[] => {
  const alerts: Alert[] = [];
  const today = new Date();

  athletes.forEach((athlete) => {
    // 1. Compute daysSinceContact
    const contactDate = athlete.lastContactedDate
      ? new Date(athlete.lastContactedDate)
      : new Date(athlete.memberSince); // Fallback if never contacted

    const daysSinceContact = Math.floor((today.getTime() - contactDate.getTime()) / (1000 * 3600 * 24));

    // 2. Compute tenureStatus
    const memberDate = new Date(athlete.memberSince);
    const daysSinceMember = Math.floor((today.getTime() - memberDate.getTime()) / (1000 * 3600 * 24));
    const tenureStatus = daysSinceMember < 90 ? 'new' : 'tenured';

    // 3. Apply thresholds

    // GHOST alerts (priority 1)
    if (tenureStatus === 'tenured' && daysSinceContact >= 7) {
      alerts.push({
        athleteId: athlete.id,
        athleteName: athlete.firstName,
        type: "GHOST",
        priority: 1,
        message: `No contact in ${daysSinceContact} days`
      });
    } else if (tenureStatus === 'new' && daysSinceContact >= 3) {
      alerts.push({
        athleteId: athlete.id,
        athleteName: athlete.firstName,
        type: "GHOST",
        priority: 1,
        message: `No contact in ${daysSinceContact} days`
      });
    }
    // Warning alerts (priority 2) - within 1 day of threshold
    else if (tenureStatus === 'tenured' && daysSinceContact >= 6) {
      alerts.push({
        athleteId: athlete.id,
        athleteName: athlete.firstName,
        type: "WARNING",
        priority: 2,
        message: `Last contact ${daysSinceContact} days ago — check in soon`
      });
    } else if (tenureStatus === 'new' && daysSinceContact >= 2) {
      alerts.push({
        athleteId: athlete.id,
        athleteName: athlete.firstName,
        type: "WARNING",
        priority: 2,
        message: `Last contact ${daysSinceContact} days ago — check in soon`
      });
    }
  });

  // Sort by priority ascending, then daysSinceContact descending
  return alerts.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Extract days from message for secondary sort
    const getDays = (msg: string) => {
      const match = msg.match(/(\d+) days/);
      return match ? parseInt(match[1]) : 0;
    };
    return getDays(b.message) - getDays(a.message);
  });
};