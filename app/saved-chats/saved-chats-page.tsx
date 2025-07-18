import { useNavigate } from "react-router";
import "~/index.scss";
import "./saved-chats-page.css";

const mockChats = [
  {
    id: 1,
    title: "Dream Analysis",
    timestamp: "2025-07-15 10:24 AM",
  },
  {
    id: 2,
    title: "Handling Anxiety",
    timestamp: "2025-07-14 9:03 PM",
  },
  {
    id: 3,
    title: "Loneliness Chat",
    timestamp: "2025-07-13 5:45 PM",
  },
];

export default function SavedChatsPage({ savedChats }: { savedChats: {
    id: string;
    lastUpdatedAt: number;
    name: string;
}[] }) {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      <div className="phone-container">
        <div className="saved-chats-header">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1>Saved Chats</h1>
        </div>

        <div className="chat-list">
          {savedChats.map((chat) => (
            <div key={chat.id} className="chat-card">
              <div className="chat-info">
                <h2 className="chat-title">{chat.name}</h2>
                <span className="chat-timestamp">{new Date(chat.lastUpdatedAt).toLocaleString()}</span>
              </div>
              <button
                className="open-chat-button"
                onClick={() => navigate(`/ai-chat/${chat.id}`)}
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
