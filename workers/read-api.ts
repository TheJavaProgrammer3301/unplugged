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

export async function getAccountInfo(env: Env, userId: string): Promise<SanitizedUserData | null> {
	const statement = env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId);
	const result = await statement.first();

	if (!result) return null;

	return sanitizeUserData(result);
}

export async function getDailyRoutineCompletion(env: Env, userId: string): Promise<Record<string, boolean>> {
	const result = await env.DB
		.prepare('SELECT items FROM dailyRoutine WHERE user = ?')
		.bind(userId)
		.first();

	if (!result) return {};

	return JSON.parse(result.items as string) as Record<string, boolean>;
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
