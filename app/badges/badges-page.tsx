import { ArrowBack, EmojiEvents } from '@mui/icons-material';
import { Box, Button, Card, Divider, Grid, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./badges-page.css";

const INSET = 32;

interface Badge {
	title: string;
	description: string;
	icon: string; // use emojis or icons
	secret?: boolean;
}

const badges: Badge[] = [
	{ title: "First Spin", description: "Completed your first challenge", icon: "🎯", secret: false },
	{ title: "Consistent", description: "Have a 3 day streak", icon: "💧", secret: false },
	{ title: "Certified Author", description: "Write 5 journal entries", icon: "🧘", secret: false },
	{ title: "The Challenger", description: "Completed 3 challenges", icon: "🌟", secret: false },
	{ title: "Rainforest Destroyer", description: "Create 5 AI chats", icon: "📵", secret: false },
	{ title: "Top Dawg", description: "Be in first place on a leaderboard", icon: "💦", secret: true },
	{ title: "Mystery Meatloaf", description: "Play 10 songs using Theryn", icon: "🍖", secret: true },
];

export default function BadgesPage({ accountInfo }: { accountInfo: SanitizedUserData }) {
	const navigate = useNavigate();

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
						Your Badges
					</Typography>
				</Box>
				<Divider />

				{/* Badge Grid */}
				<Box
					sx={{
						flexGrow: 1,
						overflowY: "auto",
						scrollbarGutter: "stable",
						scrollBehavior: "smooth",
						"&::-webkit-scrollbar": {
							width: 0
						}
					}}
				>
					<Grid container spacing={1} sx={{ margin: 0 }}>
						{badges
							.filter(badge => /*!badge.secret || accountInfo.badges.includes(badge.title)*/true)
							.map((badge, i) => {
								const isEarned = accountInfo.badges.includes(badge.title);
								return (
									<Grid key={i} xs={6}>
										<Card
											sx={{
												background: "rgba(255, 255, 255, 0.08)",
												borderRadius: "12px",
												padding: "12px",
												color: "white",
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												minHeight: "120px",
												boxShadow: "0 2px 4px rgba(255, 255, 255, 0.08)",
												opacity: isEarned ? 1 : 0.35,
												filter: isEarned ? "none" : "grayscale(100%)",
												textAlign: "center"
											}}
											variant="plain"
										>
											<Typography
												sx={{
													fontSize: "1.5rem",
													marginBottom: "8px"
												}}
											>
												{badge.icon}
											</Typography>
											<Typography
												level="title-sm"
												sx={{
													color: "white",
													fontWeight: "bold",
													fontSize: "0.85rem",
													marginBottom: "4px"
												}}
											>
												{badge.title}
											</Typography>
											<Typography
												level="body-xs"
												sx={{
													color: "#ccc",
													fontSize: "0.65rem",
													textAlign: "center",
													lineHeight: 1.2
												}}
											>
												{badge.description}
											</Typography>
										</Card>
									</Grid>
								);
							})}
					</Grid>
				</Box>

				<Button
					sx={{
						width: "100%",
						background: "linear-gradient(135deg, #ffd700, #f5c518)",
						color: "#2c1f00",
						fontWeight: "bold",
						padding: "12px 16px",
						borderRadius: "12px",
						fontSize: "1rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "8px",
						'&:hover': {
							background: "#2c1f00",
							color: "#f5c518",
						}
					}}
					onClick={() => navigate("/leaderboard/badges")}
				>
					<EmojiEvents />
					Leaderboard
				</Button>
			</Sheet>
		</CssVarsProvider>
	);
}
