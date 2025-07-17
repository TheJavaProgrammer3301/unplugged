import React from "react";
import "./profile-page.css";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = {
    name: "John Burger",
    username: "jburger",
    email: "john@example.com",
    joined: "January 2024",
    bio: "Lover of quotes, conversation, and creativity. 🌌",
  };

  return (
    <div className="app-wrapper">
      <div className="phone-container">
        <div className="profile-header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <h2 className="profile-title">Your Profile</h2>
        </div>

        <div className="profile-avatar">
          <img
            src="/images/avatar-placeholder.png"
            alt="User Avatar"
            className="avatar-img"
          />
        </div>

        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> @{user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {user.joined}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
        </div>

        <button className="edit-profile-button">Edit Profile</button>
      </div>
    </div>
  );
}
