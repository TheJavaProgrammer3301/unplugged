import type { SanitizedUserData } from "workers/read-api";
import "~/index.scss";
import "./streak-page.css";

const today = new Date();
const getMonthDays = (month: number, year: number) => {
	const date = new Date(year, month, 1);
	const days = [];
	while (date.getMonth() === month) {
		days.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return days;
};

export default function StreakPage({ accountInfo, activeDays }: { accountInfo: SanitizedUserData, activeDays: string[] }) {
	const daysThisMonth = getMonthDays(today.getMonth(), today.getFullYear());

	const isActive = (date: Date) =>
		activeDays.includes(date.toISOString().slice(0, 10));

	return (
		<div className="app-wrapper">
			<div className="phone-container streak-page">
				<div className="top-bar">
					<button className="back-button" onClick={() => window.history.back()}>
						← Back
					</button>
					<h1 className="page-title">Streak</h1>
				</div>

				<div className="streak-display">
					🔥 {accountInfo.streak}-day streak
				</div>

				<div className="calendar">
					{daysThisMonth.map((date) => (
						<div
							key={date.toISOString()}
							className={`calendar-day ${isActive(date) ? "active" : ""}`}
						>
							{date.getDate()}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
