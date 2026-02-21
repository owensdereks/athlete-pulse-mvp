export const getLastContactedDate = (athleteId: number): string | null => {
  const key = `contact_log_${athleteId}`;
  const stored = localStorage.getItem(key);
  return stored;
};

export const logContact = (athleteId: number): void => {
  const key = `contact_log_${athleteId}`;
  const today = new Date().toISOString().split('T')[0]; // ISO date string: "2026-02-03"
  localStorage.setItem(key, today);
};
