import React from "react";
import "./login-page.css";

export default function LoginPage() {
  return (
    <div className="app-wrapper">
      <div className="phone-container">
        <h1 className="login-title">Welcome to<br />UNPLUGGED</h1>
        <div className="login-buttons">
          <button className="login-button">Log In</button>
          <button className="signup-button">Sign Up</button>
        </div>
      </div>
    </div>
  );
}
