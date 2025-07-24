import { ArrowBack, EmojiEvents } from '@mui/icons-material';
import { Box, Button, Divider, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { SanitizedUserData } from 'workers/read-api';
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';

const INSET = 32;

export default function ShopPage({ accountInfo }: { accountInfo: SanitizedUserData | null }) {
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
						Gems
					</Typography>
				</Box>
				<Divider />

				{/* Content Area - Add your components here */}
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						overflowY: "auto",
						scrollbarGutter: "stable",
						scrollBehavior: "smooth",
						alignItems: "stretch",
						justifyContent: "stretch",
						"&::-webkit-scrollbar": {
							width: 0
						}
					}}
				>
					<Box
						sx={{
							height: "50%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Typography
							sx={{ color: "white", fontWeight: "bold" }}
							level='h1'
						>You have</Typography>
						<Typography
							sx={{ color: "#00c8ffff", fontWeight: "bold", fontSize: "4em" }}
							level='h1'
						>{accountInfo?.diamonds ?? 0}</Typography>
						<Typography
							sx={{ color: "white", fontWeight: "bold" }}
							level='h1'
						>gems</Typography>
					</Box>
					<Box
						sx={{
							flexGrow: 1,
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between"
						}}
					>
						<Typography
							sx={{ color: "white", fontWeight: "bold" }}
							level='h2'
						>
							Use them to purchase quotes.
						</Typography>
						<Typography
							sx={{ color: "white", fontWeight: "bold" }}
							level='h2'
						>
							You can earn more by completing badges.
						</Typography>
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
							onClick={() => navigate("/leaderboard/diamonds")}
						>
							<EmojiEvents />
							Leaderboard
						</Button>
					</Box>
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
