// ...imports
import { useEffect, useState } from "react";
import type { Challenge } from "workers/read-api";
import "~/index.scss";
import "./mind-bank-page.css";

const challenges = [
	"No phone for 24 hours<br>Your streak will be saved",
	"Write in your journal",
	"Take a long walk",
	"Practice gratitude",
	"Do a digital detox",
	"Compliment 3 people",
	"Meditate for 10 minutes",
	"Drink only water today",
];

const MindBankPage = ({ dailyChallenge }: { dailyChallenge: Challenge | null }) => {
	const [rotation, setRotation] = useState(0);
	const [isSpinning, setIsSpinning] = useState(false);
	const [selectedChallenge, setSelectedChallenge] = useState(dailyChallenge?.challenge ?? "");
	const [canSpin, setCanSpin] = useState(true);
	const [timeLeft, setTimeLeft] = useState("");
	const [completed, setCompleted] = useState(dailyChallenge?.completed ?? false);

	const anglePerSlice = 360 / challenges.length;

	useEffect(() => {
		// const saved = localStorage.getItem("selectedChallenge");
		// if (saved) {
		// 	setSelectedChallenge(saved);
		// }

		// const completeFlag = localStorage.getItem("challengeCompleted");
		// if (completeFlag === "true") setCompleted(true);

		const lastSpin = dailyChallenge?.createdAt;
		const now = Date.now();

		if (lastSpin && now - lastSpin < 24 * 60 * 60 * 1000) {
			setCanSpin(false);
			const nextSpinTime = lastSpin + 24 * 60 * 60 * 1000;

			const updateTimer = () => {
				const diff = nextSpinTime - Date.now();
				if (diff <= 0) {
					setCanSpin(true);
					setTimeLeft("");
					return;
				}

				const hours = Math.floor(diff / (1000 * 60 * 60));
				const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((diff % (1000 * 60)) / 1000);

				setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
			};

			updateTimer();
			const interval = setInterval(updateTimer, 1000);
			return () => clearInterval(interval);
		}
	}, [dailyChallenge]);

	const spinWheel = () => {
		if (!canSpin || isSpinning) return;

		setIsSpinning(true);
		const randomSlice = Math.floor(Math.random() * challenges.length);
		const fullSpins = 5;
		const finalAngle = fullSpins * 360 + randomSlice * anglePerSlice + Math.random() * anglePerSlice;

		setRotation(finalAngle);

		setTimeout(async () => {
			const challenge = challenges[randomSlice];
			setSelectedChallenge(challenge);
			setCompleted(false);
			localStorage.setItem("selectedChallenge", challenge);
			localStorage.setItem("challengeCompleted", "false");
			setIsSpinning(false);

			await fetch("/api/challenge", {
				method: "POST",
				body: JSON.stringify({ challenge }),
				headers: { "Content-Type": "application/json" },
			});

			// localStorage.setItem("lastSpinDate", new Date().toDateString());
			setCanSpin(false);
			setRotation(fullSpins * 360 + randomSlice * anglePerSlice + anglePerSlice / 2);
		}, 3500);
	};

	const markComplete = async () => {
		if (!selectedChallenge || completed) return;

		await fetch("/api/challenge", {
			method: "PUT",
			body: JSON.stringify({ completed: true }),
			headers: { "Content-Type": "application/json" },
		});

		setCompleted(true);
		// localStorage.setItem("challengeCompleted", "true");
	};

	return (
		<div className="app-wrapper">
			<div className="phone-container mind-bank">
				<div className="top-bar">
					<div className="back-button-container">
						<button className="back-button" onClick={() => window.history.back()}>← Back</button>
					</div>
					<h1 className="mind-title">Mind Bank</h1>
				</div>

				<div className="wheel-wrapper">
					<div
						className={`wheel ${isSpinning ? "spinning" : ""}`}
						style={{ transform: `rotate(${rotation}deg)` }}
					>
						{challenges.map((_, index) => (
							<div
								key={index}
								className="wheel-slice"
								style={{ transform: `rotate(${index * anglePerSlice}deg)` }}
							/>
						))}
					</div>
					<div className="wheel-arrow">▼</div>
				</div>

				<button className="spin-button" onClick={spinWheel} disabled={!canSpin}>
					{canSpin ? "Spin for Challenge" : `Next spin in ${timeLeft}`}
				</button>

				<div className="challenge-box">
					<h2>Challenge</h2>
					<p
						dangerouslySetInnerHTML={{
							__html: selectedChallenge || "Spin the wheel to receive a challenge!",
						}}
					/>
				</div>

				{selectedChallenge && (
					<button
						className="complete-button"
						onClick={markComplete}
						disabled={completed}
					>
						{completed ? "Challenge Completed!" : "I completed the challenge"}
					</button>
				)}
			</div>
		</div>
	);
};

export default MindBankPage;
