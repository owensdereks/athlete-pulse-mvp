// src/App.tsx
import { useMemo } from "react";
import { athletes, workouts } from "./data/mockData";
import { generateFocusList } from "./utils/logic";
import type { Alert } from "./utils/logic";
import "./App.css";

function App() {
  const alerts: Alert[] = useMemo(() => generateFocusList(athletes, workouts), []);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Client Pulse ❤️</h1>
        <p>Today: Feb 3, 2026</p>
      </header>

      <div className="alert-grid">
        {/* SECTION 1: GHOSTS (High Priority) */}
        <section className="alert-column priority-high">
          <h2>👻 Ghosts (Risk)</h2>
          {alerts.filter((a) => a.type === "GHOST").length === 0 && <p className="empty-state">No ghosts today!</p>}
          {alerts
            .filter((a) => a.type === "GHOST")
            .map((alert) => (
              <div key={alert.athleteId} className="card ghost-card">
                <h3>{alert.athleteName}</h3>
                <p>{alert.message}</p>
                <button>Text Now</button>
              </div>
            ))}
        </section>

        {/* SECTION 2: HYPE (Opportunities) */}
        <section className="alert-column priority-medium">
          <h2>🎉 Hype (Wins)</h2>
          {alerts.filter((a) => a.type === "HYPE").length === 0 && <p className="empty-state">No PRs today.</p>}
          {alerts
            .filter((a) => a.type === "HYPE")
            .map((alert) => (
              <div key={alert.athleteId} className="card hype-card">
                <h3>{alert.athleteName}</h3>
                <p>{alert.message}</p>
                <button>Send "🔥"</button>
              </div>
            ))}
        </section>

        {/* SECTION 3: HOUSEKEEPING (Info) */}
        <section className="alert-column priority-low">
          <h2>📋 Housekeeping</h2>
          {alerts.filter((a) => a.type !== "GHOST" && a.type !== "HYPE").map((alert) => (
            <div key={alert.athleteId} className="card info-card">
              <h3>{alert.athleteName}</h3>
              <span className="badge">{alert.type}</span>
              <p>{alert.message}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;