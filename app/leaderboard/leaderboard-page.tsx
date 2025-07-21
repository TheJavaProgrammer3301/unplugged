import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/index.scss";
import "./leaderboard-page.css";

export default function LeaderboardPage({ leaderboard, accountInfo }: { leaderboard: SanitizedUserData[]; accountInfo: SanitizedUserData | null; }) {
	const navigate = useNavigate();

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				<div className="leaderboard-header">
					<button className="back-button" onClick={() => navigate(-1)}>
						←
					</button>
					<h2>🏆 Leaderboard</h2>
				</div>
				<ul className="leaderboard-list">
					{leaderboard.map((entry, index) => (
						<li key={index} className={`leaderboard-item ${entry.id === accountInfo?.id ? "you" : ""}`}>
							<span className="rank">#{index + 1}</span>
							<span className="name">{entry.name}</span>
							<span className="streak">🔥 {entry.streak}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
