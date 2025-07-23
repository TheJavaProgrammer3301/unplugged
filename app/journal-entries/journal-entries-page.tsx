import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, List, ListItem, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { JournalEntry } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./journal-entries-page.css";

const INSET = 32;

export default function JournalEntriesPage({ entries }: { entries?: JournalEntry[] }) {
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
						onClick={() => navigate("/journal")}
					>
						<ArrowBack />
						<Typography sx={{ color: "white" }}>Back</Typography>
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Typography level="h2" component="h1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
						Journal Entries
					</Typography>
				</Box>
				<Divider />

				<List
					id="journal-entries"
					sx={{
						padding: 0,
						flexGrow: "1",
						gap: `${INSET / 2}px`,
						overflowY: "auto",
						scrollbarGutter: "stable",
						scrollBehavior: "smooth"
					}}>
					{entries?.map((entry) => (
						<ListItem key={entry.id} sx={{ padding: '0' }}>
							<Card
								sx={{
									width: "100%",
									borderRadius: "12px",
									backgroundColor: "rgba(255, 255, 255, 0.07)",
									borderColor: "rgba(255, 255, 255, 0.15)",
									boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
									padding: "12px",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									flexDirection: "row"
								}}
								variant="outlined"
							>
								<Box sx={{
									display: "flex",
									justifyContent: "space-between",
									flexGrow: 1,
									flexDirection: "column"
								}}>
									<Typography
										level="title-md"
										sx={{
											color: "white",
											fontWeight: "600",
											margin: 0
										}}
									>
										{entry.name}
									</Typography>
									<Typography
										level="body-sm"
										sx={{
											color: "#bbb",
											fontSize: "0.75rem",
										}}
									>
										{new Date(entry.createdAt).toLocaleString()}
									</Typography>
								</Box>
								<Button
									onClick={() => navigate(`/journal/${entry.id}`)}
								>
									Open
								</Button>
							</Card>
						</ListItem>
					))}
				</List>
			</Sheet>
		</CssVarsProvider>
	);
}
