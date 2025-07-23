import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Divider, FormControl, FormLabel, Sheet, Snackbar, Stack, Textarea, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { JournalEntry } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./journal-page.css";

const INSET = 32;

export default function JournalPage({ entry }: { entry: JournalEntry | null }) {
	const navigate = useNavigate();
	const [entries, setEntries] = useState(["", "", ""]);

	useEffect(() => {
		if (entry?.content) {
			setEntries([
				entry.content[0] || "",
				entry.content[1] || "",
				entry.content[2] || "",
			]);
		}
	}, [entry]);

	const handleChange = (index: number, value: string) => {
		if (entry) return; // prevent editing if entry is pre-filled
		const newEntries = [...entries];
		newEntries[index] = value;
		setEntries(newEntries);
	};

	const [badge, setBadge] = useState("");

	const handleSave = async () => {
		if (entry) return; // prevent saving if viewing an existing entry

		try {
			const response = await fetch("/api/journals", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contents: entries }),
			});

			if (!response.ok) throw new Error("Failed to save journal entry");

			if ((await response.json() as { totalJournalEntries: number }).totalJournalEntries === 5) {
				setBadge("Congressional Hearing");

				setTimeout(() => {
					navigate("/journal-entries");
				}, 3000);
			} else navigate("/journal-entries");
		} catch (error) {
			console.error("Failed to save journal entry:", error);
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
					gap: `${INSET / 2}px`,
					overflowY: "auto"
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
						{entry ? entry.name : "My Journal"}
					</Typography>
				</Box>
				<Divider />

				<Stack spacing={3} sx={{ flexGrow: 1 }}>
					<FormControl>
						<FormLabel sx={{ color: "white", fontWeight: "600", marginBottom: "8px" }}>
							How are you feeling today?
						</FormLabel>
						<Textarea
							value={entries[0]}
							onChange={(e) => handleChange(0, e.target.value)}
							minRows={3}
							maxRows={6}
							disabled={!!entry}
							sx={{
								backgroundColor: "rgba(255, 255, 255, 0.08)",
								borderColor: "rgba(255, 255, 255, 0.2)",
								color: "#e0e0e0",
								fontSize: "0.95rem",
								borderRadius: "10px",
								boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
								'&:focus-within': {
									borderColor: "rgba(255, 255, 255, 0.4)"
								}
							}}
							placeholder={entry ? "" : "Share your feelings..."}
						/>
					</FormControl>

					<FormControl>
						<FormLabel sx={{ color: "white", fontWeight: "600", marginBottom: "8px" }}>
							What happened today?
						</FormLabel>
						<Textarea
							value={entries[1]}
							onChange={(e) => handleChange(1, e.target.value)}
							minRows={4}
							maxRows={8}
							disabled={!!entry}
							sx={{
								backgroundColor: "rgba(255, 255, 255, 0.08)",
								borderColor: "rgba(255, 255, 255, 0.2)",
								color: "#e0e0e0",
								fontSize: "0.95rem",
								borderRadius: "10px",
								boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
								'&:focus-within': {
									borderColor: "rgba(255, 255, 255, 0.4)"
								}
							}}
							placeholder={entry ? "" : "Tell us about your day..."}
						/>
					</FormControl>

					<FormControl>
						<FormLabel sx={{ color: "white", fontWeight: "600", marginBottom: "8px" }}>
							What's one goal for tomorrow?
						</FormLabel>
						<Textarea
							value={entries[2]}
							onChange={(e) => handleChange(2, e.target.value)}
							minRows={2}
							maxRows={4}
							disabled={!!entry}
							sx={{
								backgroundColor: "rgba(255, 255, 255, 0.08)",
								borderColor: "rgba(255, 255, 255, 0.2)",
								color: "#e0e0e0",
								fontSize: "0.95rem",
								borderRadius: "10px",
								boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
								'&:focus-within': {
									borderColor: "rgba(255, 255, 255, 0.4)"
								}
							}}
							placeholder={entry ? "" : "Set a goal for tomorrow..."}
						/>
					</FormControl>
				</Stack>

				<Stack spacing={2} sx={{ marginTop: "auto" }}>
					{!entry && (
						<Button
							onClick={handleSave}
							sx={{
								background: "linear-gradient(to right, #00c9ff, #92fe9d)",
								color: "#1a1a1a",
								fontWeight: "bold",
								padding: "12px",
								borderRadius: "10px",
								fontSize: "0.95rem",
								'&:hover': {
									background: "linear-gradient(to right, #92fe9d, #00c9ff)",
									transform: "scale(1.02)"
								}
							}}
						>
							Save Entry
						</Button>
					)}

					<Button
						onClick={() => navigate("/journal-entries")}
						sx={{
							background: "linear-gradient(135deg, #00c6ff, #0072ff)",
							color: "white",
							fontWeight: "bold",
							padding: "12px",
							borderRadius: "10px",
							fontSize: "0.95rem",
							'&:hover': {
								background: "linear-gradient(135deg, #0072ff, #00c6ff)",
								transform: "scale(1.02)"
							}
						}}
					>
						Previous Entries
					</Button>
				</Stack>

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
}
