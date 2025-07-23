import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, Grid, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./streak-page.css";

const INSET = 32;

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
	const navigate = useNavigate();

	const isActive = (date: Date) =>
		activeDays.includes(date.toISOString().slice(0, 10));

	return (
		<CssVarsProvider theme={CURRENT_JOY_THEME}>
			<Sheet
				id="root"
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					boxSizing: "border-box",
					background: CURRENT_THEME.colors.primaryBackground,
					padding: `${INSET}px`,
					gap: `${INSET / 2}px`
				}}
			>
				<Box sx={{ all: 'unset', display: "flex", alignItems: "center" }}>
					<Button
						color='danger'
						sx={{ padding: "6px 12px", gap: "8px", color: "white" }}
						onClick={() => window.history.back()}
					>
						<ArrowBack />
						<Typography sx={{ color: "white" }}>Back</Typography>
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Typography level="h2" component="h1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
						Streak
					</Typography>
				</Box>
				<Divider />

				<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: `${INSET / 2}px` }}>
					<Typography
						level="h3"
						sx={{
							textAlign: "center",
							color: "#ffce00",
							fontWeight: "bold",
							marginBottom: "8px"
						}}
					>
						🔥 {accountInfo.streak}-day streak
					</Typography>

					<Card
						sx={{
							padding: "12px",
							backgroundColor: "rgba(255, 255, 255, 0.03)",
							borderColor: CURRENT_THEME.colors.assistantChatBorder,
							borderRadius: "12px"
						}}
						variant="outlined"
					>
						<Grid container spacing={0.5} sx={{ gridTemplateColumns: "repeat(7, 1fr)", display: "grid" }}>
							{daysThisMonth.map((date) => (
								<Grid key={date.toISOString()}>
									<Box
										sx={{
											width: "100%",
											padding: "8px 0",
											backgroundColor: isActive(date) ? "#6a00ff" : "#2b2b40",
											borderRadius: "8px",
											textAlign: "center",
											fontSize: "0.9rem",
											color: isActive(date) ? "#fff" : "#aaa",
											fontWeight: isActive(date) ? "bold" : "normal",
											boxShadow: isActive(date) ? "0 0 8px #6a00ffaa" : "none",
											minHeight: "36px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										}}
									>
										{date.getDate()}
									</Box>
								</Grid>
							))}
						</Grid>
					</Card>

					<Box sx={{ marginTop: "auto" }}>
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
							onClick={() => navigate("/leaderboard")}
						>
							🏆 Leaderboard
						</Button>
					</Box>
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
