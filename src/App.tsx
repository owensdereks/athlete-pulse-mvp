import { useState, useEffect } from "react";
import { getAthletes, addAthlete } from "./utils/athleteStorage";
import { generateFocusList, getAthleteStatus } from "./utils/logic";
import { getLastContactedDate, logContact } from "./utils/contactStorage";
import { AddAthleteModal } from "./components/AddAthleteModal";
import { CSVUpload } from "./components/CSVUpload";
import type { Athlete } from "./data/mockData";
import type { Alert, AthleteStatus } from "./utils/logic";
import "./App.css";

function App() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize athletes with localStorage data on mount
  useEffect(() => {
    const storedAthletes = getAthletes();
    const athletesWithContactData = storedAthletes.map((athlete) => {
      const storedContactDate = getLastContactedDate(athlete.id);
      return {
        ...athlete,
        lastContactedDate: storedContactDate || athlete.lastContactedDate,
      };
    });
    setAthletes(athletesWithContactData);
    setAlerts(generateFocusList(athletesWithContactData));
  }, []);

  const handleLogContact = (athleteId: number) => {
    // Log to localStorage
    logContact(athleteId);

    // Update athlete in state with today's date
    const today = new Date().toISOString().split('T')[0];
    const updatedAthletes = athletes.map((athlete) =>
      athlete.id === athleteId
        ? { ...athlete, lastContactedDate: today }
        : athlete
    );

    // Update state and regenerate alerts
    setAthletes(updatedAthletes);
    setAlerts(generateFocusList(updatedAthletes));
  };

  const handleAddAthlete = (athleteData: Omit<Athlete, 'id'>) => {
    const newAthlete = addAthlete(athleteData);
    const updatedAthletes = [...athletes, newAthlete];
    setAthletes(updatedAthletes);
    setAlerts(generateFocusList(updatedAthletes));
  };

  const handleCSVUpload = (newAthletes: Array<Omit<Athlete, 'id'>>) => {
    const addedAthletes = newAthletes.map((athleteData) => addAthlete(athleteData));
    const updatedAthletes = [...athletes, ...addedAthletes];
    setAthletes(updatedAthletes);
    setAlerts(generateFocusList(updatedAthletes));
  };

  const getDaysSinceContact = (athleteId: number): number => {
    const athlete = athletes.find((a) => a.id === athleteId);
    if (!athlete) return 0;

    const contactDate = athlete.lastContactedDate
      ? new Date(athlete.lastContactedDate)
      : new Date(athlete.memberSince);

    const today = new Date();
    return Math.floor((today.getTime() - contactDate.getTime()) / (1000 * 3600 * 24));
  };

  const getStatusBadge = (status: AthleteStatus) => {
    switch (status) {
      case "critical":
        return { emoji: "🔴", text: "Critical", className: "status-critical" };
      case "warning":
        return { emoji: "🟡", text: "Needs Check-in", className: "status-warning" };
      case "on-track":
        return { emoji: "🟢", text: "On Track", className: "status-on-track" };
    }
  };

  const todayString = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const focusAlerts = alerts.filter((a) => a.type === "GHOST" || a.type === "WARNING");

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-left">
          <h1>Client Pulse</h1>
          <p className="header-date">Today: {todayString}</p>
        </div>
        <div className="header-right">
          <CSVUpload onUpload={handleCSVUpload} />
          <button
            className="btn-add-athlete"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Add Athlete
          </button>
        </div>
      </header>

      {/* SECTION 1: FOCUS LIST (Needs Attention) */}
      <section className="focus-section">
        <h2 className="section-header">🎯 NEEDS ATTENTION</h2>
        <div className="section-divider"></div>

        {focusAlerts.length === 0 ? (
          <div className="empty-state">
            <p>You're all caught up! 🎉</p>
          </div>
        ) : (
          <div className="focus-list">
            {focusAlerts.map((alert) => {
              const athlete = athletes.find((a) => a.id === alert.athleteId);
              if (!athlete) return null;
              const status = getAthleteStatus(athlete);
              const statusBadge = getStatusBadge(status);

              return (
                <div key={alert.athleteId} className={`focus-card ${statusBadge.className}`}>
                  <div className="focus-card-content">
                    <div className="focus-card-info">
                      <h3>{athlete.firstName} {athlete.lastName}</h3>
                      <p className="days-since">{getDaysSinceContact(alert.athleteId)} days since last contact</p>
                      <span className={`status-badge ${statusBadge.className}`}>
                        {statusBadge.emoji} {statusBadge.text}
                      </span>
                    </div>
                    <button
                      className="btn-contacted"
                      onClick={() => handleLogContact(alert.athleteId)}
                    >
                      ✓ Contacted
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: FULL ROSTER */}
      <section className="roster-section">
        <h2 className="section-header">👥 FULL ROSTER</h2>
        <div className="section-divider"></div>

        <div className="roster-table">
          <div className="roster-header">
            <div className="roster-col-name">Athlete</div>
            <div className="roster-col-days">Days Since Contact</div>
            <div className="roster-col-status">Status</div>
            <div className="roster-col-action">Action</div>
          </div>

          {athletes.map((athlete) => {
            const status = getAthleteStatus(athlete);
            const statusBadge = getStatusBadge(status);

            return (
              <div key={athlete.id} className="roster-row">
                <div className="roster-col-name">
                  <strong>{athlete.firstName} {athlete.lastName}</strong>
                  {athlete.email && <span className="athlete-email">{athlete.email}</span>}
                </div>
                <div className="roster-col-days">
                  {getDaysSinceContact(athlete.id)} days
                </div>
                <div className="roster-col-status">
                  <span className={`status-badge ${statusBadge.className}`}>
                    {statusBadge.emoji} {statusBadge.text}
                  </span>
                </div>
                <div className="roster-col-action">
                  <button
                    className="btn-contacted-small"
                    onClick={() => handleLogContact(athlete.id)}
                  >
                    ✓ Contacted
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AddAthleteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAthlete}
      />
    </div>
  );
}

export default App;