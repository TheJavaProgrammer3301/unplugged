import React, { useState } from "react";
import { useNavigate } from "react-router";
import "~/index.scss";
import "./journal-page.css";

export default function JournalPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState({
    today: "",
    feeling: "",
    goal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntries((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Journal Saved:", entries);
    alert("Journal saved!");
  };

  return (
    <div className="app-wrapper">
      <div className="phone-container journal-container">
        <div className="journal-header">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1>My Journal</h1>
        </div>

        <div className="journal-section">
          <label>How are you feeling today?</label>
          <textarea
            name="feeling"
            value={entries.feeling}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="journal-section">
          <label>What happened today?</label>
          <textarea
            name="today"
            value={entries.today}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="journal-section">
          <label>What's one goal for tomorrow?</label>
          <textarea
            name="goal"
            value={entries.goal}
            onChange={handleChange}
            rows={2}
          />
        </div>

        <button className="journal-save" onClick={handleSave}>
          Save Entry
        </button>

        <button className="journal-previous" onClick={() => navigate("/journal-entries")}>
          Previous Entries
        </button>
      </div>
    </div>
  );
}
