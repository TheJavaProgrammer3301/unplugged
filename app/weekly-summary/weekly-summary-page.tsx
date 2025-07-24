import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, Divider, Sheet, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useNavigate } from "react-router";
import type { WeeklySummary } from 'workers/read-api';
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./weekly-summary-page.css";

const INSET = 32;

const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getOrdinalSuffix(num: number): string {
	const j = num % 10;
	const k = num % 100;
	if (j === 1 && k !== 11) return "st";
	if (j === 2 && k !== 12) return "nd";
	if (j === 3 && k !== 13) return "rd";
	return "th";
}

function AtAGlanceCard({ name, value, subtitle, suffix }: { name: string; value: number; subtitle?: string; suffix?: string }) {
	return <Card sx={{
		width: "calc(50% - 8px)",
		height: "calc(50% - 8px)",
		boxSizing: "border-box",
		backgroundColor: "rgba(255, 255, 255, 0.07)",
		borderColor: "rgba(255, 255, 255, 0.15)",
	}}>
		<Typography level="h3" sx={{ color: "white", textAlign: "center" }}>{name}</Typography>
		<Typography level="h2" sx={{ color: "white", margin: "auto", textAlign: "center" }}>{value}{suffix}</Typography>
		{subtitle && <Typography level="body-sm" sx={{ color: "white", textAlign: "center" }}>{subtitle}</Typography>}
	</Card>;
}

function AtAGlance({ summary }: { summary: WeeklySummary }) {
	return <SummaryBox>
		<Typography
			sx={{ color: "white", fontWeight: "bold" }}
			level='h1'
		>At a glance</Typography>
		<Box sx={{ flexGrow: 1, flexWrap: "wrap", flexDirection: "row", display: "flex", gap: "16px", rowGap: "16px" }}>
			<AtAGlanceCard name="Journal" value={summary.newJournalEntries} subtitle='entries' />
			<AtAGlanceCard name="Active" value={summary.activeDayCount} subtitle='days' suffix='/7' />
			<AtAGlanceCard name="AI chats" value={summary.aiChatsStarted} subtitle='started' />
			<AtAGlanceCard name="Challenges" value={summary.challengesCompleted} subtitle='complete' suffix='/7' />
		</Box>
		<Typography
			sx={{ color: "white", fontWeight: "bold" }}
			level='h1'
		>vs. others</Typography>
		<Box sx={{ flexGrow: 1, flexWrap: "wrap", flexDirection: "row", display: "flex", gap: "16px", rowGap: "16px" }}>
			<AtAGlanceCard name="Journal" value={summary.journalEntriesCountPercentile} subtitle='percentile' suffix={getOrdinalSuffix(summary.journalEntriesCountPercentile)} />
			<AtAGlanceCard name="Active" value={summary.activeDaysCountPercentile} subtitle='percentile' suffix={getOrdinalSuffix(summary.activeDaysCountPercentile)} />
			<AtAGlanceCard name="AI chats" value={summary.aiChatsStartedPercentile} subtitle='percentile' suffix={getOrdinalSuffix(summary.aiChatsStartedPercentile)} />
			<AtAGlanceCard name="Challenges" value={summary.challengesCompletedPercentile} subtitle='percentile' suffix={getOrdinalSuffix(summary.challengesCompletedPercentile)} />
		</Box>
	</SummaryBox>;
}

function DaySummary({ summary, day }: { summary: WeeklySummary; day: number }) {
	return <TabPanel value={day}>

	</TabPanel>
}

function DayByDay({ summary }: { summary: WeeklySummary }) {
	return <SummaryBox>
		<Tabs
			sx={{ marginTop: "16px" }}
		>
			<TabList>
				{daysOfTheWeek.map((day, index) => (
					<Tab key={index}>
						{day.substring(0, 3)}
					</Tab >
				))}
			</TabList>
			{daysOfTheWeek.map((_, index) => (
				<DaySummary key={index} summary={summary} day={index} />
			))}
		</Tabs>
	</SummaryBox>
}

function SummaryBox({ children }: { children?: React.ReactNode }) {
	return <Box sx={{ minHeight: "100%", flexShrink: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
		{children}
	</Box>;
}

export default function WeeklySummary({ summary }: { summary?: WeeklySummary }) {
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
						Your Summary
					</Typography>
				</Box>
				<Divider />

				{/* Content Area - Add your components here */}
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						gap: 0,
						overflowY: "auto",
						scrollbarGutter: "stable",
						scrollBehavior: "smooth",
						"&::-webkit-scrollbar": {
							width: 0
						}
					}}
				>
					<AtAGlance summary={summary!} />
					<DayByDay summary={summary!} />
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
