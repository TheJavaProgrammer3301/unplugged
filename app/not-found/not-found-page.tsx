import React from "react";
import "./not-found-page.css";

export default function NotFoundPage() {
  return (
    <div className="app-wrapper">
      <div className="phone-container notfound-container">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">Oops! The page<br />you’re looking for<br />doesn’t exist.</p>
        <div className="notfound-emoji" role="img" aria-label="confused face">
          🤔
        </div>
        <button
          className="back-home-button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
