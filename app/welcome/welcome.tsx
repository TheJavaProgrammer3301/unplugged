import React from "react";
import "./welcome.css"; // Make sure this is imported

export default function Dashboard() {
  return (
    <div className="app-wrapper">
      {/* Phone Container */}
      <div className="phone-container">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="dot-group">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="stats">
            <div className="stat-box">💰 500 💎 35</div>
            <div className="stat-box">🔥 27</div>
          </div>
        </div>

        {/* Greeting */}
        <h1 className="greeting">Hello, {'{username}'}</h1>

        {/* Feature Buttons Grid */}
        <div className="button-grid">
          <button className="feature-button">Quote Bank</button>
          <button className="feature-button">Journal</button>
          <button className="feature-button">Daily Routine</button>
          <button className="feature-button">Mind Bank</button>
        </div>

        {/* AI Therapy Section */}
        <div className="ai-therapy">
          <span>AI Therapy</span>
			<img
				src="app\welcome\theryn-ai-logo.png" // Replace with your actual image path
				alt="Theryn AI Logo"
			/>
        </div>
      </div>
    </div>
  );
}
