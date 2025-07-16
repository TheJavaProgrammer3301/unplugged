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

export async function getAccountInfo(env: Env, userId: string): Promise<SanitizedUserData | null> {
	const statement = env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId);
	const result = await statement.first();

	if (!result) return null;

	return sanitizeUserData(result);
}

//#bindings
export async function getAccountInfoFromSessionId(env: Env, sessionId: string): Promise<SanitizedUserData | null> {
	const userId = await getUserIdFromSession(env, sessionId);

	if (!userId) return null;

	return await getAccountInfo(env, userId);
}
