import React from "react";
import "./badges-page.css";

interface Badge {
  title: string;
  description: string;
  icon: string; // use emojis or icons
  earned: boolean;
}

const badges: Badge[] = [
  { title: "First Spin", description: "Completed your first challenge", icon: "🎯", earned: true },
  { title: "Hydrated Hero", description: "Drank only water for a day", icon: "💧", earned: false },
  { title: "Mindful Master", description: "Meditated for 10 minutes", icon: "🧘", earned: true },
  { title: "Social Star", description: "Complimented 3 people", icon: "🌟", earned: false },
  { title: "Digital Detox", description: "No phone for 24h", icon: "📵", earned: true },
];

export default function BadgesPage() {
  return (
    <div className="app-wrapper">
      <div className="phone-container badges-page">
        <div className="top-bar">
          <div className="back-button-container">
            <button className="back-button" onClick={() => window.history.back()}>
              ← Back
            </button>
          </div>
          <h1 className="mind-title">Your Badges</h1>
        </div>

        <div className="badge-grid">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`badge-card ${badge.earned ? "earned" : "locked"}`}
            >
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-text">
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
