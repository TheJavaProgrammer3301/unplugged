import React from "react";
import "./weekly-summary-page.css";
import "~/index.scss";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface WeeklySummaryProps {
  challengeCompletedDays: string[]; // e.g. ["Mon", "Wed", "Fri"]
  aiTalkCount: number;
  journalEntriesCount: number;
}

const exampleData: WeeklySummaryProps = {
  challengeCompletedDays: ["Mon", "Wed", "Fri", "Sat"],
  aiTalkCount: 10,
  journalEntriesCount: 15,
};

export default function WeeklySummary() {
  const stats = exampleData; // Replace with your real data source

  return (
    <div className="app-wrapper">
      <div className="phone-container weekly-summary">
        <div className="top-bar">
          <button className="back-button" onClick={() => window.history.back()}>
            ← Back
          </button>
          <h1 className="page-title">Weekly Summary</h1>
        </div>

        <section className="challenge-completion">
          <h2>Challenges Completed</h2>
          <div className="days-row">
            {daysOfWeek.map((day) => {
              const completed = stats.challengeCompletedDays.includes(day);
              return (
                <div
                  key={day}
                  className={`day-circle ${completed ? "completed" : ""}`}
                  title={completed ? `${day}: Completed` : `${day}: Not completed`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </section>

        <section className="ai-talks">
          <h2>AI Conversations</h2>
          <div className="stat-number">{stats.aiTalkCount}</div>
        </section>

        <section className="journal-entries">
          <h2>Journal Entries</h2>
          <div className="stat-number">{stats.journalEntriesCount}</div>
        </section>
      </div>
    </div>
  );
}
