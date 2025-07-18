import React from "react";
import "./streak-page.css";

interface StreakPageProps {
  accountInfo: {
    streak: number;
    activeDays: string[]; // e.g. ["2025-07-15", "2025-07-16"]
  };
}

const today = new Date();
const getMonthDays = (month: number, year: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export default function StreakPage() {
  const accountInfo = {
    streak: 5,
    activeDays: ["2025-07-14", "2025-07-15", "2025-07-16", "2025-07-17", "2025-07-18"],
  };

  const daysThisMonth = getMonthDays(today.getMonth(), today.getFullYear());

  const isActive = (date: Date) =>
    accountInfo.activeDays.includes(date.toISOString().slice(0, 10));

  return (
    <div className="app-wrapper">
      <div className="phone-container streak-page">
        <div className="top-bar">
          <button className="back-button" onClick={() => window.history.back()}>
            ← Back
          </button>
          <h1 className="page-title">Streak</h1>
        </div>

        <div className="streak-display">
          🔥 {accountInfo.streak}-day streak
        </div>

        <div className="calendar">
          {daysThisMonth.map((date) => (
            <div
              key={date.toISOString()}
              className={`calendar-day ${isActive(date) ? "active" : ""}`}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
