import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import { getCategoryFromQuote } from "workers/shared";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./saved-quotes-page.css";

const INSET = 32;

export default function SavedQuotesPage({ accountInfo }: { accountInfo: SanitizedUserData | null }) {
	const navigate = useNavigate();

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'motivation': return '#ff4b4b';
			case 'loss': return '#000000';
			case 'acceptance': return '#2ecc71';
			case 'loneliness': return '#3498db';
			default: return '#6a00ff';
		}
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
						Saved Quotes
					</Typography>
				</Box>
				<Divider />

				{/* Quote List */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
						overflowY: "auto",
						flexGrow: 1,
						scrollbarGutter: "stable",
						scrollBehavior: "smooth",
						"&::-webkit-scrollbar": {
							width: 0
						}
					}}
				>
					{accountInfo?.savedQuotes.map((quote, i) => {
						const category = getCategoryFromQuote(quote) || 'default';
						return (
							<Card
								key={i}
								sx={{
									background: "linear-gradient(135deg, #1e1e2f, #2d2d3e)",
									borderRadius: "12px",
									padding: "16px",
									color: "white",
									fontSize: "1rem",
									boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
									display: "flex",
									justifyContent: "flex-start",
									alignItems: "center",
									borderLeft: `6px solid ${getCategoryColor(category)}`,
									lineHeight: 1.4
								}}
								variant="plain"
							>
								<Typography sx={{ color: "white", textAlign: "left" }}>
									{quote}
								</Typography>
							</Card>
						);
					})}
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
