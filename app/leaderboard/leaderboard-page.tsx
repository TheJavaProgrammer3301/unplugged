import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, List, ListItem, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./leaderboard-page.css";

const INSET = 32;

export default function LeaderboardPage({ leaderboard, accountInfo }: { leaderboard: SanitizedUserData[]; accountInfo: SanitizedUserData | null; }) {
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
					{leaderboard.map((entry, index) => (
						<ListItem key={index} sx={{ padding: '0' }}>
							<Card
								sx={{
									width: "100%",
									borderRadius: "12px",
									backgroundColor: entry.id === accountInfo?.id
										? "rgba(255, 255, 255, 0.2)"
										: CURRENT_THEME.colors.assistantChatBackground,
									borderColor: entry.id === accountInfo?.id
										? "#ffd700"
										: CURRENT_THEME.colors.assistantChatBorder,
									border: entry.id === accountInfo?.id
										? "2px solid #ffd700"
										: `1px solid ${CURRENT_THEME.colors.assistantChatBorder}`,
									boxShadow: entry.id === accountInfo?.id
										? "0 0 12px #ffd700"
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
										color: "#ffd700",
										fontWeight: "600",
										fontSize: "1rem",
										minWidth: "2.5rem"
									}}
								>
									#{index + 1}
								</Typography>
								<Typography
									sx={{
										color: entry.id === accountInfo?.id ? "#fffacd" : "white",
										fontWeight: "600",
										flex: 1,
										textAlign: "left",
										marginLeft: "16px"
									}}
								>
									{entry.name}
								</Typography>
								<Typography
									sx={{
										color: "#ffddcc",
										fontWeight: "600"
									}}
								>
									🔥 {entry.streak}
								</Typography>
							</Card>
						</ListItem>
					))}
				</List>
			</Sheet>
		</CssVarsProvider>
	);
}
