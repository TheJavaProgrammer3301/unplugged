import type { SanitizedUserData } from "workers/read-api";
import "~/index.scss";
import "./badges-page.css";

interface Badge {
	title: string;
	description: string;
	icon: string; // use emojis or icons
	secret?: boolean;
}

const badges: Badge[] = [
	{ title: "First Spin", description: "Completed your first challenge", icon: "🎯", secret: false },
	{ title: "Good Boy", description: "Have a 3 day streak", icon: "💧", secret: false },
	{ title: "Congressional Hearing", description: "Write 5 journal entries", icon: "🧘", secret: false },
	{ title: "Obedient User", description: "Completed 3 challenges", icon: "🌟", secret: false },
	{ title: "Chatty Fella", description: "Have 5 AI chats", icon: "📵", secret: false },
	{ title: "Goonsplosion", description: "Mention gooning in a chat with Theryn", icon: "💦", secret: true },
	{ title: "Mystery Meatloaf", description: "Play 10 songs using Theryn", icon: "🍖", secret: true },
];

export default function BadgesPage({ accountInfo }: { accountInfo: SanitizedUserData }) {
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
						.filter(badge => /*!badge.secret || accountInfo.badges.includes(badge.title)*/true)
						.map((badge, i) => (
							<div
								key={i}
								className={`badge-card ${accountInfo.badges.includes(badge.title) ? "earned" : "locked"}`}
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
