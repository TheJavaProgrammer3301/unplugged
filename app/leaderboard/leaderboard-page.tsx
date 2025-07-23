import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, List, ListItem, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./leaderboard-page.css";

const INSET = 32;

type LeaderboardItem = {
	name: string;
	id: string;
	value: number;
}

function LeaderboardSwitch({ leaderboardType, leaderboard, accountInfo }: { leaderboardType: string; leaderboard: SanitizedUserData[]; accountInfo: SanitizedUserData | null; }) {
	switch (leaderboardType) {
		case "streak":
			return <GenericLeaderboard
				color="#ffd700"
				items={leaderboard.map(entry => ({
					name: entry.name,
					id: entry.id,
					value: entry.streak
				}))}
				symbol="🔥"
				userId={accountInfo?.id ?? ""}
			/>
		case "diamonds":
			return <GenericLeaderboard
				color="#00c8ffff"
				items={leaderboard.sort((a, b) => b.diamonds - a.diamonds).map(entry => ({
					name: entry.name,
					id: entry.id,
					value: entry.diamonds
				}))}
				symbol="💎"
				userId={accountInfo?.id ?? ""}
			/>
		case "badges":
			return <GenericLeaderboard
				color="#a600ffff"
				items={leaderboard.sort((a, b) => b.badges.length - a.badges.length).map(entry => ({
					name: entry.name,
					id: entry.id,
					value: (() => { console.log(entry.badges); return entry.badges.length; })()
				}))}
				symbol="🏅"
				userId={accountInfo?.id ?? ""}
			/>
	}
}

function GenericLeaderboard({ color, items, symbol, userId }: { color: string; items: LeaderboardItem[]; symbol: string; userId: string }) {
	return (
		<List
			id="leaderboard-list"
			sx={{
				padding: 0,
				flexGrow: "1",
				gap: `${INSET / 4}px`,
				overflowY: "auto",
				scrollbarGutter: "stable",
				scrollBehavior: "smooth",
				maxHeight: "calc(100vh - 200px)"
			}}>
			{items.map((entry, index) => (
				<ListItem key={index} sx={{ padding: '0' }}>
					<Card
						sx={{
							width: "100%",
							borderRadius: "12px",
							backgroundColor: entry.id === userId
								? "rgba(255, 255, 255, 0.2)"
								: CURRENT_THEME.colors.assistantChatBackground,
							borderColor: entry.id === userId
								? color
								: CURRENT_THEME.colors.assistantChatBorder,
							border: entry.id === userId
								? `2px solid ${color}`
								: `1px solid ${CURRENT_THEME.colors.assistantChatBorder}`,
							boxShadow: entry.id === userId
								? `0 0 12px ${color}`
								: "0 2px 6px rgba(0, 0, 0, 0.2)",
							padding: "12px 16px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexDirection: "row"
						}}
						variant="outlined"
					>
						<Typography
							sx={{
								color: color,
								fontWeight: "600",
								fontSize: "1rem",
								minWidth: "2.5rem"
							}}
						>
							#{index + 1}
						</Typography>
						<Typography
							sx={{
								color: entry.id === userId ? "#fffacd" : "white",
								fontWeight: "600",
								flex: 1,
								textAlign: "left",
								marginLeft: "16px",
								wordBreak: "break-all"
							}}
						>
							{entry.name}
						</Typography>
						<Typography
							sx={{
								color: "#ffddcc",
								fontWeight: "600",
								wordBreak: "break-all"
							}}
						>
							{symbol} {entry.value}
						</Typography>
					</Card>
				</ListItem>
			))}
		</List>
	);
}

export default function LeaderboardPage({ leaderboardType, leaderboard, accountInfo }: { leaderboardType: string; leaderboard: SanitizedUserData[]; accountInfo: SanitizedUserData | null; }) {
	const navigate = useNavigate();

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
						onClick={() => navigate(-1)}
					>
						<ArrowBack />
						<Typography sx={{ color: "white" }}>Back</Typography>
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Typography level="h2" component="h1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
						🏆 Leaderboard
					</Typography>
				</Box>
				<Divider />
				<LeaderboardSwitch
					leaderboard={leaderboard}
					accountInfo={accountInfo}
					leaderboardType={leaderboardType}
				/>
			</Sheet>
		</CssVarsProvider>
	);
}
