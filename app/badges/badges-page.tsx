import { Button } from "@mui/joy";
import { useNavigate } from "react-router";
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
	const navigate = useNavigate();
	
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

				<Button
					sx={{
						width: "100%",
						background: "linear-gradient(135deg, #ffd700, #f5c518)",
						color: "#2c1f00",
						fontWeight: "bold",
						padding: "12px 16px",
						borderRadius: "12px",
						boxShadow: "0 4px 10px rgba(255, 215, 0, 0.3)",
						fontSize: "1rem",
						'&:hover': {
							transform: "scale(1.02)",
							boxShadow: "0 6px 14px rgba(255, 215, 0, 0.45)"
						}
					}}
					onClick={() => navigate("/leaderboard/badges")}
				>
					🏆 Leaderboard
				</Button>
			</div>
		</div>
	);
}
