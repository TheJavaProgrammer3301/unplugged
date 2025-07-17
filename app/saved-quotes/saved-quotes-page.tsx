import React from "react";
import "./saved-quotes-page.css";

interface Quote {
  text: string;
  category: "motivation" | "acceptance" | "loss" | "loneliness";
}

const savedQuotes: Quote[] = [
  { text: "\"The only way out is through.\"", category: "acceptance" },
  { text: "\"You are stronger than you think.\"", category: "motivation" },
  { text: "\"Healing isn't linear.\"", category: "loss" },
  { text: "\"Even the darkest night will end and the sun will rise.\"", category: "loneliness" },
  { text: "\"Progress, not perfection.\"", category: "motivation" },
  { text: "\"It's okay to rest.\"", category: "acceptance" },
];

export default function SavedQuotesPage() {
  return (
    <div className="app-wrapper">
      <div className="phone-container saved-quotes">
        <div className="top-bar">
          <div className="back-button-container">
            <button className="back-button" onClick={() => window.history.back()}>
              ← Back
            </button>
          </div>
          <h1 className="mind-title">Saved Quotes</h1>
        </div>

        <div className="quote-list">
          {savedQuotes.map((quote, i) => (
            <div key={i} className={`quote-card ${quote.category}`}>
              {quote.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
