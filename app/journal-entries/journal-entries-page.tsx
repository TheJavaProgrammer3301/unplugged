import { useNavigate } from "react-router";
import "~/index.scss";
import "./journal-entries-page.css";

const mockEntries = [
  {
    id: "entry1",
    title: "Gratitude Reflection",
    timestamp: "2025-07-17 9:00 AM",
  },
  {
    id: "entry2",
    title: "Hard Day at Work",
    timestamp: "2025-07-16 8:15 PM",
  },
  {
    id: "entry3",
    title: "Random Thoughts",
    timestamp: "2025-07-15 10:45 AM",
  },
];

export default function JournalEntriesPage() {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <div className="phone-container">
        <div className="journal-entries-header">
          <button className="back-button" onClick={() => navigate("/journal")}>
            ← Back
          </button>
          <h1>Journal Entries</h1>
        </div>

        <div className="entry-list">
          {mockEntries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-info">
                <h2 className="entry-title">{entry.title}</h2>
                <span className="entry-timestamp">{entry.timestamp}</span>
              </div>
              <button
                className="open-entry-button"
                onClick={() => navigate(`/journal/${entry.id}`)}
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
