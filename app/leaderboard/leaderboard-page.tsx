import React from "react";
import { useNavigate } from "react-router";
import "./leaderboard-page.css";
import "~/index.scss";


const mockLeaderboard = [
  { name: "You", streak: 17 },
  { name: "Alex", streak: 15 },
  { name: "Sam", streak: 12 },
  { name: "Jamie", streak: 10 },
  { name: "Riley", streak: 8 },
  { name: "Taylor", streak: 7 },
  { name: "Jordan", streak: 6 },
  { name: "Casey", streak: 5 },
  { name: "Drew", streak: 4 },
  { name: "Sky", streak: 3 },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <div className="phone-container">
        <div className="leaderboard-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>
          <h2>🏆 Leaderboard</h2>
        </div>
        <ul className="leaderboard-list">
          {mockLeaderboard.map((entry, index) => (
            <li key={index} className={`leaderboard-item ${entry.name === "You" ? "you" : ""}`}>
              <span className="rank">#{index + 1}</span>
              <span className="name">{entry.name}</span>
              <span className="streak">🔥 {entry.streak}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
