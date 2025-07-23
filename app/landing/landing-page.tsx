import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./landing-page.css";

const INSET = 32;

export default function LandingPage({ accountInfo }: { accountInfo: SanitizedUserData | null }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (accountInfo) navigate("/dashboard", { replace: true });
	}, [accountInfo]);

	if (accountInfo) return <></>;

	return (
		<CssVarsProvider theme={CURRENT_JOY_THEME}>
			<Sheet
				id="root"
				sx={{
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxSizing: "border-box",
					background: CURRENT_THEME.colors.primaryBackground,
					padding: `${INSET}px`
				}}
			>
				<Box
					sx={{
						width: "100%",
						maxWidth: "400px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center"
					}}
				>
					<Typography
						level="h1"
						sx={{
							fontSize: "2rem",
							fontWeight: "700",
							textAlign: "center",
							marginBottom: "48px",
							color: "white",
							// color: "#e6e0ff",
							// textShadow: "0 2px 6px rgba(75, 0, 130, 0.6)",
							lineHeight: 1.4
						}}
					>
						Welcome to<br />UNPLUGGED
					</Typography>

					<Stack spacing={2} sx={{ width: "100%" }}>
						<Button
							onClick={() => navigate("/login")}
							size="lg"
							// sx={{
							// 	background: "linear-gradient(135deg, #00c6ff, #0072ff)",
							// 	color: "#e0f7ff",
							// 	fontWeight: "600",
							// 	padding: "12px 16px",
							// 	borderRadius: "12px",
							// 	fontSize: "1rem",
							// 	textTransform: "uppercase",
							// 	letterSpacing: "0.05em",
							// 	width: "100%",
							// 	'&:hover': {
							// 		background: "linear-gradient(135deg, #0072ff, #00c6ff)",
							// 		transform: "scale(1.05)",
							// 		boxShadow: "0 6px 20px rgba(0, 198, 255, 0.9)"
							// 	}
							// }}
						>
							Log In
						</Button>

						<Button
							onClick={() => navigate("/signup")}
							size="lg"
							// sx={{
							// 	background: "linear-gradient(135deg, #00c6ff, #0072ff)",
							// 	color: "#e0f7ff",
							// 	fontWeight: "600",
							// 	padding: "12px 16px",
							// 	borderRadius: "12px",
							// 	fontSize: "1rem",
							// 	textTransform: "uppercase",
							// 	letterSpacing: "0.05em",
							// 	width: "100%",
							// 	'&:hover': {
							// 		background: "linear-gradient(135deg, #0072ff, #00c6ff)",
							// 		transform: "scale(1.05)",
							// 		boxShadow: "0 6px 20px rgba(0, 198, 255, 0.9)"
							// 	}
							// }}
						>
							Sign Up
						</Button>
					</Stack>
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
