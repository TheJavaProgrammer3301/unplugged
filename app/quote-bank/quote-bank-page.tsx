import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, FormControl, FormLabel, Option, Select, Sheet, Stack, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import { allQuotes } from "workers/shared";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./quote-bank-page.css";

const INSET = 32;

function shuffleArray<T>(array: T[]): T[] {
	const newArr = [...array];
	for (let i = newArr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArr[i], newArr[j]] = [newArr[j], newArr[i]];
	}
	return newArr;
}

export default function QuoteBankPage({ accountInfo }: { accountInfo: SanitizedUserData | null }) {
	const [filter, setFilter] = useState("all");
	const [gems, setGems] = useState(accountInfo?.diamonds ?? 0);
	const [unlockedTexts, setUnlockedTexts] = useState<string[]>(accountInfo?.savedQuotes ?? []);
	const navigate = useNavigate();

	const filteredQuotes = useMemo(() => {
		const filtered =
			filter === "all" ? allQuotes : allQuotes.filter((q) => q.category === filter);
		return shuffleArray(filtered);
	}, [filter]);

	const handleUnlock = async (quoteText: string) => {
		if (gems >= 10 && !unlockedTexts.includes(quoteText)) {
			await fetch("/api/quotes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ quote: quoteText }),
			});

			setGems((g) => g - 10);
			setUnlockedTexts((prev) => [...prev, quoteText]);
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'motivation': return '#ff4b4b';
			case 'loss': return '#000000';
			case 'acceptance': return '#2ecc71';
			case 'loneliness': return '#3498db';
			default: return 'transparent';
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
						Quote Bank
					</Typography>
				</Box>
				<Divider />

				{/* Gem Display */}
				<Card
					sx={{
						textAlign: "center",
						backgroundColor: "#222",
						color: "#ffd700",
						fontWeight: "bold",
						fontSize: "1.1rem",
						padding: "12px",
						borderRadius: "10px",
						borderColor: "rgba(255, 255, 255, 0.3)",
						background: "transparent"
					}}
				>
					<Stack
						direction="row"
						spacing={1}
						justifyContent="center"
						alignItems="center"
					>
						<Typography sx={{ color: "#ffd700", fontWeight: "bold" }}>
							💎 Gems: {gems}
						</Typography>
					</Stack>
				</Card>

				{/* Filter Controls */}
				<FormControl>
					<FormLabel sx={{ color: "white", fontSize: "0.9rem" }}>Filter:</FormLabel>
					<Select
						value={filter}
						variant='outlined'
						onChange={(_, value) => setFilter(value as string)}
						sx={{
							borderWidth: 0,
							backgroundColor: "rgb(50, 50, 50)",
							color: "white",
							"&:hover": {
								backgroundColor: "#185EA5"
							}
						}}
					>
						<Option value="all">All</Option>
						<Option value="motivation">Motivation</Option>
						<Option value="acceptance">Acceptance</Option>
						<Option value="loss">Loss</Option>
						<Option value="loneliness">Loneliness</Option>
					</Select>
				</FormControl>

				{/* Quote List */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
						// maxHeight: "380px",
						overflowY: "auto",
						flexGrow: 1,
						scrollbarGutter: "stable",
						scrollBehavior: "smooth",
						"&::-webkit-scrollbar": {
							width: 0
						}
					}}
				>
					{filteredQuotes.map((quote, index) => {
						const isUnlocked = unlockedTexts.includes(quote.text);
						return (
							<Card
								key={index}
								sx={{
									background: "linear-gradient(135deg, #1e1e2f, #2d2d3e)",
									borderRadius: "12px",
									padding: "16px",
									color: "white",
									fontSize: "1rem",
									boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									// minHeight: "70px",
									borderLeft: `6px solid ${getCategoryColor(quote.category)}`
								}}
								variant="plain"
							>
								{isUnlocked ? (
									<Typography sx={{ color: "white", textAlign: "left" }}>
										{quote.text}
									</Typography>
								) : (
									<Button
										onClick={() => handleUnlock(quote.text)}
										disabled={gems < 10}
										sx={{
											background: "linear-gradient(135deg, #f39c12, #f1c40f)",
											color: "#2c1f00",
											fontWeight: "bold",
											borderRadius: "8px",
											padding: "8px 12px",
											'&:hover': {
												background: "linear-gradient(135deg, #e67e22, #f39c12)"
											},
											'&:disabled': {
												cursor: "not-allowed",
												color: "#2c1f00"
											}
										}}
									>
										🔒 Unlock for 10 💎
									</Button>
								)}
							</Card>
						);
					})}
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}

