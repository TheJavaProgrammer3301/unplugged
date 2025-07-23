import "~/index.scss";
import "./badges-page.css";

interface Badge {
  title: string;
  description: string;
  icon: string; // use emojis or icons
  earned: boolean;
  secret?: boolean;
}

const badges: Badge[] = [
  { title: "First Spin", description: "Completed your first challenge", icon: "🎯", earned: true, secret: false },
  { title: "Good Boy", description: "Have a 30 day streak", icon: "💧", earned: false, secret: false },
  { title: "Congressional Hearing", description: "Write 50 journal entries", icon: "🧘", earned: true, secret: false },
  { title: "Obedient User", description: "Completed 20 challenges", icon: "🌟", earned: false, secret: false },
  { title: "Chatty Fella", description: "Have 100 AI chats", icon: "📵", earned: true, secret: false },
  { title: "Goonsplosion", description: "Mention gooning in a journal entry", icon: "", earned: false, secret: true },
  { title: "Mystery Meatloaf", description: "Play 10,000 songs using Theryn", icon: "", earned: false, secret: true },
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
          {badges
            .filter(badge => !badge.secret || badge.earned)
            .map((badge, i) => (
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
