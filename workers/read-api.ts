import { getUserIdFromSession } from "./utils";

function sanitizeUserData(user: any): SanitizedUserData {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		coins: user.coins,
		diamonds: user.diamonds,
		streak: user.streak
	};
}

export type SanitizedUserData = {
	id: string;
	name: string;
	email: string;
	coins: number;
	diamonds: number;
	streak: number;
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
	console.log("Getting current challenge for userId:", userId);
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
		.prepare('SELECT challenge, createdAt FROM challenges WHERE user = ? AND createdAt = ?')
		.bind(userId, challengeCreatedAt)
		.first();

	return {
		challenge: result?.challenge as string ?? null,
		createdAt: result?.createdAt as number ?? 0
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
		.prepare('SELECT id, name, email, coins, diamonds, streak FROM users ORDER BY streak DESC LIMIT 10')
		.all();

	return result.results.map(row => sanitizeUserData(row));
}