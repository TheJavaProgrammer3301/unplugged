import { ArrowBack, KeyboardArrowDown } from '@mui/icons-material';
import { Box, Button, Card, Divider, IconButton, List, ListItem, Sheet, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useState } from 'react';
import { useNavigate } from "react-router";
import type { DayActivity, WeeklySummary } from 'workers/read-api';
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

function DaySummaryItem({ icon, name, contents, baseUrl }: { icon: string; name: string; contents: [string, string][]; baseUrl?: string }) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<ListItem
			nested
			startAction={
				<IconButton
					variant="plain"
					size="sm"
					color="neutral"
					onClick={() => setOpen(!open)}
				>
					<KeyboardArrowDown
						sx={[
							open ? { transform: 'initial' } : { transform: 'rotate(-90deg)' },
							{
								color: "white"
							}
						]}
					/>
				</IconButton>
			}
		>
			<ListItem>
				<Typography sx={{
					color: "white",
				}}>{icon} {name}: {contents.length}</Typography>
			</ListItem>
			{open && <List sx={{
				'--ListItem-paddingY': '8px',
				gap: "8px",
				marginBottom: "8px"
			}}>
				{contents.map((content, index) => (
					<ListItem
						key={index}
						sx={{
							alignItems: "stretch",
							padding: "0 12px 0 21px"
						}}
					>
						<Button
							sx={{
								flexGrow: 1
							}}
							onClick={baseUrl !== undefined ? (() => navigate(`${baseUrl}/${content[1]}`)) : undefined}
							disabled={baseUrl === undefined}
						>
							<Typography sx={{
								color: "white",
								textAlign: "left",
								justifyContent: "stretch",
								flexGrow: 1
							}}>{content[0]}</Typography>
						</Button>
					</ListItem>
				))}
			</List>}
		</ListItem>
	);
}

function DaySummary({ dayActivity, day }: { dayActivity?: DayActivity; day: number }) {
	return <TabPanel
		value={day}
		sx={{
			backgroundColor: "rgba(255, 255, 255, 0.07)",
			border: "1px solid rgba(255, 255, 255, 0.15)",
			borderRadius: "8px",
			padding: "0 16px 0 24px",
		}}
	>
		{dayActivity && (dayActivity.newJournalEntries.length > 0 || dayActivity.newAiChats.length > 0 || dayActivity.completedChallenges.length > 0) ? <List
			sx={{
				'--List-insetStart': '32px',
				'--ListItem-paddingY': '0px',
				'--ListItem-paddingRight': '16px',
				'--ListItem-paddingLeft': '21px',
				'--ListItem-startActionWidth': '0px',
				'--ListItem-startActionTranslateX': '-50%',
			}}
		>
			{dayActivity.newJournalEntries.length > 0 && <DaySummaryItem
				icon="📝"
				name="New journal entries"
				baseUrl='/journal'
				contents={dayActivity.newJournalEntries.map(entry => [entry.name, entry.id])}
			/>}
			{dayActivity.newAiChats.length > 0 && <DaySummaryItem
				icon="🤖"
				name="New AI chats"
				baseUrl='/ai-chat'
				contents={dayActivity.newAiChats.map(chat => [chat.name, chat.id])}
			/>}
			{dayActivity.completedChallenges.length > 0 && <DaySummaryItem
				icon="🏆"
				name="Completed challenges"
				contents={dayActivity.completedChallenges.map(challenge => [challenge.challenge, challenge.challenge])}
			/>}
		</List> : <Typography level="h2" sx={{ color: "white", textAlign: "center", margin: "40px" }}>No activity yet</Typography>}
	</TabPanel>;
}

function DayByDay({ summary }: { summary: WeeklySummary }) {
	return <SummaryBox>
		<Typography
			sx={{
				color: "white",
				fontWeight: "bold",
				marginTop: "16px",
			}}
			level='h1'
		>Day by day</Typography>
		<Tabs
			sx={{
				background: "transparent"
			}}
		>
			<TabList
				sx={{
					backgroundColor: "rgba(255, 255, 255, 0.07)",
					border: "1px solid rgba(255, 255, 255, 0.15)",
					borderRadius: "8px",
					marginBottom: "16px"
				}}
			>
				{daysOfTheWeek.map((day, index) => (
					<Tab
						key={index}
						sx={{
							color: "white",
							borderRadius: index === 0 ? "8px 0 0 8px" : index === daysOfTheWeek.length - 1 ? "0 8px 8px 0" : "0",
							flexGrow: 1
						}}
						disabled={summary.activity[index]?.disabled}
						disableIndicator>
						{day.substring(0, 3)}
					</Tab >
				))}
			</TabList>
			{daysOfTheWeek.map((_, index) => (
				<DaySummary key={index} dayActivity={summary.activity[index]} day={index} />
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
