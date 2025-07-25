import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, Sheet, Snackbar, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import type { Challenge } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./mind-bank-page.css";

const INSET = 32;

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
	const [selectedChallenge, setSelectedChallenge] = useState(dailyChallenge?.challenge);
	const [canSpin, setCanSpin] = useState(true);
	const [timeLeft, setTimeLeft] = useState("");
	const [completed, setCompleted] = useState(dailyChallenge?.completed ?? false);
	const [badge, setBadge] = useState("");

	const navigate = useNavigate();

	const anglePerSlice = 360 / challenges.length;

	useEffect(() => {
		const lastSpin = dailyChallenge?.createdAt;
		const now = Date.now();

		if (lastSpin && now - lastSpin < 24 * 60 * 60 * 1000) {
			setCanSpin(false);
		}
	}, [dailyChallenge]);

	useEffect(() => {
		if (!canSpin) {
			const lastSpin = dailyChallenge?.createdAt || Date.now();
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
	}, [canSpin, dailyChallenge]);

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

			setCanSpin(false);
			setRotation(fullSpins * 360 + randomSlice * anglePerSlice + anglePerSlice / 2);
		}, 3500);
	};

	const markComplete = async () => {
		if (!selectedChallenge || completed) return;

		const response = await fetch("/api/challenge", {
			method: "PUT",
			body: JSON.stringify({ completed: true }),
			headers: { "Content-Type": "application/json" },
		});

		const body = await response.json() as { [key: string]: boolean };

		if (body.firstSpin) {
			setBadge("First Spin");
		} else if (body.goodBoy) {
			setBadge("Obedient User");
		}

		setCompleted(true);
	};

	return (
		<CssVarsProvider theme={CURRENT_JOY_THEME}>
			<Sheet
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					boxSizing: "border-box",
					background: CURRENT_THEME.colors.primaryBackground,
					padding: `${INSET}px`,
					gap: `${INSET / 2}px`
				}}
				id="root"
			>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Button
						color='danger'
						sx={{ padding: "6px 12px", gap: "8px", color: "white" }}
						onClick={() => navigate("/dashboard")}
					>
						<ArrowBack />
						<Typography sx={{ color: "white" }}>Back</Typography>
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Typography level="h2" component="h1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
						Mind Bank
					</Typography>
				</Box>
				<Divider />

				<Box sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
					gap: `${INSET / 2}px`,
					flexGrow: 1
				}}>
					<Box sx={{
						position: "relative",
						margin: "16px 0",
						flexGrow: 1,
						aspectRatio: 1,
						alignSelf: "center",
						maxWidth: "100%",
					}}>
						<Box
							sx={{
								top: "50%",
								position: "relative",
								transform: `translateY(-50%)`,
								aspectRatio: 1,
								background: "red"
							}}
						>
							<Box
								className={`wheel ${isSpinning ? "spinning" : ""}`}
								sx={{
									borderRadius: "50%",
									top: "50%",
									position: "relative",
									transition: "transform 3.5s cubic-bezier(0.33, 1, 0.68, 1)",
									background: `conic-gradient(
									#6a00ff 0% 12.5%,
									#302b63 12.5% 25%,
									#0f0c29 25% 37.5%,
									#4b0082 37.5% 50%,
									#6a00ff 50% 62.5%,
									#302b63 62.5% 75%,
									#0f0c29 75% 87.5%,
									#4b0082 87.5% 100%
								)`,
									border: "4px solid #fff",
									transform: `translateY(-50%) rotate(${rotation}deg)`,
									aspectRatio: 1
								}}
							>
								{challenges.map((_, index) => (
									<Box
										key={index}
										sx={{
											position: "absolute",
											width: "50%",
											height: "2px",
											background: "#ffffffaa",
											top: "50%",
											left: "50%",
											transformOrigin: "left",
											transform: `rotate(${index * anglePerSlice}deg)`
										}}
									/>
								))}
							</Box>
							<Typography
								sx={{
									position: "absolute",
									top: "0",
									left: "50%",
									transition: "transform 3.5s cubic-bezier(0.33, 1, 0.68, 1)",
									transform: `translate(-50%, -50%)`,
									fontSize: "1.5rem",
									color: "#fff"
								}}
							>
								▼
							</Typography>
						</Box>
					</Box>

					<Button
						onClick={spinWheel}
						disabled={!canSpin}
						sx={{
							background: canSpin ? "linear-gradient(90deg, #6a00ff, #302b63)" : "gray",
							color: "white",
							fontSize: "1rem",
							fontWeight: "bold",
							padding: "12px 16px",
							borderRadius: "12px",
							width: "100%",
							cursor: canSpin ? "pointer" : "not-allowed",
							'&:hover': canSpin ? {
								background: "linear-gradient(90deg, #302b63, #6a00ff)"
							} : {}
						}}
					>
						{canSpin ? "Spin for Challenge" : `Next spin in ${timeLeft}`}
					</Button>

					<Card
						sx={{
							backgroundColor: "rgba(255, 255, 255, 0.1)",
							borderColor: "rgba(255, 255, 255, 0.2)",
							borderRadius: "16px",
							textAlign: "center",
							padding: "16px"
						}}
						variant="outlined"
					>
						<Typography level="h3" sx={{ color: "#fff", marginBottom: "8px" }}>
							Challenge
						</Typography>
						<Typography
							sx={{ color: "#fff" }}
						>
							{selectedChallenge ?? "Spin the wheel to receive a challenge!"}
						</Typography>

						{selectedChallenge && (
							<Button
								onClick={markComplete}
								disabled={completed}
								sx={{
									background: completed ? "#444" : "linear-gradient(135deg, #27ae60, #2ecc71)",
									color: "white",
									fontWeight: "bold",
									padding: "12px",
									borderRadius: "12px",
									width: "100%",
									opacity: completed ? 0.6 : 1,
									cursor: completed ? "not-allowed" : "pointer",
									'&:hover': !completed ? {
										background: "linear-gradient(135deg, #2ecc71, #27ae60)"
									} : {}
								}}
							>
								{completed ? "Challenge Completed!" : "I completed the challenge"}
							</Button>
						)}
					</Card>
				</Box>

				<Snackbar
					open={badge !== ""}
					autoHideDuration={3000}
					variant="soft"
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
					color="success"
					onClose={() => setBadge("")}
				>
					Badge complete: {badge}
				</Snackbar>
			</Sheet>
		</CssVarsProvider>
	);
};

export default MindBankPage;
