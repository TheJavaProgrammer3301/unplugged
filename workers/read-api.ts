import { getUserIdFromSession } from "./utils";

function sanitizeUserData(user: any): SanitizedUserData {
	return {
		id: user.id,
		name: user.name,
		username: user.username, // Assuming username is the same as name for now
		email: user.email,
		coins: user.coins,
		diamonds: user.diamonds,
		streak: user.streak,
		savedQuotes: JSON.parse(user.savedQuotes ?? "[]") as string[],
		createdAt: user.createdAt as number,
		bio: user.bio ?? "",
		badges: JSON.parse(user.badges ?? "[]") as string[]
	};
}

export type SanitizedUserData = {
	id: string;
	name: string;
	email: string;
	coins: number;
	diamonds: number;
	streak: number;
	savedQuotes: string[];
	createdAt: number;
	bio: string;
	username: string;
	badges: string[];
}

export type JournalEntry = {
	id: string;
	content: string[];
	createdAt: number;
	name: string;
}

export type RoutineItem = {
	id: string;
	name: string;
	completed: boolean;
}

export type Challenge = {
	challenge: string;
	createdAt: number;
	completed: boolean;
}

export type WeeklySummary = {
	activeDayCount: number;
	newJournalEntries: number;
	aiChatsStarted: number;
	challengesCompleted: number;
	activeDaysCountPercentile: number;
	journalEntriesCountPercentile: number;
	aiChatsStartedPercentile: number;
	challengesCompletedPercentile: number;
}

export type SavedChat = {
	id: string;
	lastUpdatedAt: number;
	createdAt: number;
	name: string;
}

export async function getAccountInfo(env: Env, userId: string): Promise<SanitizedUserData | null> {
	const statement = env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId);
	const result = await statement.first();

	if (!result) return null;

	return sanitizeUserData(result);
}

export async function getUserDailyRoutine(env: Env, userId: string): Promise<RoutineItem[]> {
	const result = await env.DB
		.prepare('SELECT * FROM routineItems WHERE user = ?')
		.bind(userId)
		.all();

	return result.results.map(row => ({
		id: row.id as string,
		name: row.name as string,
		completed: row.completed === 1
	}));
}

export async function didUserCompleteJournalToday(env: Env, userId: string): Promise<boolean> {
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);

	const result = await env.DB
		.prepare('SELECT COUNT(*) FROM journalEntries WHERE user = ? AND createdAt >= ?')
		.bind(userId, startOfToday.getTime())
		.first();

	return ((result?.['COUNT(*)'] as number | null) ?? 0) > 0;
}

export async function getJournalEntries(env: Env, userId: string): Promise<JournalEntry[]> {
	const result = await env.DB
		.prepare('SELECT * FROM journalEntries WHERE user = ?')
		.bind(userId)
		.all();

	return result.results.map(row => ({
		id: row.id as string,
		content: JSON.parse(row.contents as string) as string[],
		createdAt: row.createdAt as number,
		name: row.name as string
	}));
}

export async function getSavedChats(env: Env, userId: string): Promise<SavedChat[]> {
	const result = await env.DB
		.prepare('SELECT id, lastUpdatedAt, createdAt, name FROM conversations WHERE user = ?')
		.bind(userId)
		.all();

	return result.results.map(row => ({
		id: row.id as string,
		lastUpdatedAt: row.lastUpdatedAt as number,
		createdAt: row.createdAt as number,
		name: (row.name ?? "none") as string
	}));
}

export async function getJournalEntry(env: Env, journalId: string): Promise<JournalEntry | null> {
	const result = await env.DB
		.prepare('SELECT * FROM journalEntries WHERE id = ?')
		.bind(journalId)
		.first();

	if (!result) return null;

	return {
		id: result.id as string,
		content: JSON.parse(result.contents as string) as string[],
		createdAt: result.createdAt as number,
		name: result.name as string
	};
}

//#bindings
export async function getAccountInfoFromSessionId(env: Env, sessionId: string): Promise<SanitizedUserData | null> {
	const userId = await getUserIdFromSession(env, sessionId);

	if (!userId) return null;

	return await getAccountInfo(env, userId);
}

export async function getCurrentChallengeCreatedAt(env: Env, userId: string): Promise<number | null> {
	const result = await env.DB
		.prepare('SELECT challengeCreatedAt FROM currentChallenges WHERE user = ?')
		.bind(userId)
		.first();

	return result?.challengeCreatedAt as number | null;
}

export async function getCurrentChallenge(env: Env, userId: string): Promise<Challenge | null> {
	const challengeCreatedAt = await getCurrentChallengeCreatedAt(env, userId);

	if (!challengeCreatedAt) return null;

	const result = await env.DB
		.prepare('SELECT challenge, createdAt, completed FROM challenges WHERE user = ? AND createdAt = ?')
		.bind(userId, challengeCreatedAt)
		.first();

	return {
		challenge: result?.challenge as string ?? null,
		createdAt: result?.createdAt as number ?? 0,
		completed: (result?.completed ?? 0) === 1
	};
}

// convert logonTimes createdAt to the format "YYYY-MM-DD"
export async function getActiveDays(env: Env, userId: string): Promise<string[]> {
	const result = await env.DB
		.prepare('SELECT createdAt FROM logonTimes WHERE user = ?')
		.bind(userId)
		.all();

	return result.results.map(row => {
		const date = new Date(row.createdAt as number);

		return date.toISOString().slice(0, 10);
	});
}

export async function getLastDayBeginTimeFromDailyRoutineCompletionStatusAndUpdatedAtTime(env: Env, userId: string): Promise<number | null> {
	// select routineItems where completed is true, then find the one that was updatedAt the longest time ago
	const result = await env.DB
		.prepare('SELECT updatedAt FROM routineItems WHERE user = ? AND completed = 1 ORDER BY updatedAt DESC LIMIT 1')
		.bind(userId)
		.first();

	if (!result) return null;

	return result.updatedAt as number;
}

export async function getStreakLeaderboard(env: Env): Promise<SanitizedUserData[]> {
	const result = await env.DB
		.prepare('SELECT id, name, email, coins, diamonds, streak, badges FROM users ORDER BY streak DESC')
		.all();

	return result.results.map(row => sanitizeUserData(row));
}

export async function getChallengesCompletedByUser(env: Env, userId: string): Promise<Challenge[]> {
	const result = await env.DB
		.prepare('SELECT challenge, createdAt, completed FROM challenges WHERE user = ? AND completed = 1')
		.bind(userId)
		.all();

	return result.results.map(row => ({
		challenge: row.challenge as string,
		createdAt: row.createdAt as number,
		completed: (row.completed ?? 0) === 1
	}));
}

export async function getWeeklySummary(env: Env, userId: string): Promise<WeeklySummary> {
	const now = Date.now();
	const startOfWeek = now - (now % (7 * 24 * 60 * 60 * 1000)); // Start of the current week in milliseconds
	const activeDays = await getActiveDays(env, userId);
	const newJournalEntries = (await getJournalEntries(env, userId)).filter(entry => entry.createdAt >= startOfWeek).length;
	const aiChatsStarted = (await getSavedChats(env, userId)).filter(chat => chat.createdAt >= startOfWeek).length;
	const challengesCompleted = (await getChallengesCompletedByUser(env, userId)).filter(challenge => challenge.createdAt >= startOfWeek).length;

	const activeDayCount = activeDays.length;

	// Get all users for percentile calculations
	const allUsers = await env.DB.prepare('SELECT id FROM users').all();
	const userIds = allUsers.results.map(row => row.id as string);

	// Calculate stats for all users
	const allUserStats = await Promise.all(userIds.map(async (id) => {
		const userActiveDays = await getActiveDays(env, id);
		const userJournalEntries = (await getJournalEntries(env, id)).filter(entry => entry.createdAt >= startOfWeek).length;
		const userAiChats = (await getSavedChats(env, id)).filter(chat => chat.createdAt >= startOfWeek).length;
		const userChallenges = (await getChallengesCompletedByUser(env, id)).filter(challenge => challenge.createdAt >= startOfWeek).length;
		
		return {
			activeDayCount: userActiveDays.filter(day => {
				const dayTime = new Date(day).getTime();
				return dayTime >= startOfWeek;
			}).length,
			journalEntries: userJournalEntries,
			aiChats: userAiChats,
			challenges: userChallenges
		};
	}));

	// Calculate percentiles
	const calculatePercentile = (userValue: number, allValues: number[]): number => {
		const sortedValues = allValues.sort((a, b) => a - b);
		const belowCount = sortedValues.filter(value => value < userValue).length;
		return Math.round((belowCount / sortedValues.length) * 100);
	};

	const activeDaysCountPercentile = calculatePercentile(activeDayCount, allUserStats.map(stat => stat.activeDayCount));
	const journalEntriesCountPercentile = calculatePercentile(newJournalEntries, allUserStats.map(stat => stat.journalEntries));
	const aiChatsStartedPercentile = calculatePercentile(aiChatsStarted, allUserStats.map(stat => stat.aiChats));
	const challengesCompletedPercentile = calculatePercentile(challengesCompleted, allUserStats.map(stat => stat.challenges));

	return {
		activeDayCount,
		newJournalEntries,
		aiChatsStarted,
		challengesCompleted,
		activeDaysCountPercentile,
		journalEntriesCountPercentile,
		aiChatsStartedPercentile,
		challengesCompletedPercentile
	};
}