const SESSION_COOKIE_NAME = "session";

export async function getUserIdFromSession(env: Env, sessionId: string): Promise<string | null> {
	const statement = env.DB.prepare('SELECT id FROM sessions WHERE session = ?').bind(sessionId);
	const result = await statement.first();

	return result?.id as string | null;
}

export function getSessionIdFromRequest(request: Request): string | null {
	const cookieHeader = request.headers.get("Cookie");

	if (!cookieHeader) return null;

	const cookies = cookieHeader.split("; ");
	const sessionCookie = cookies.find(cookie => cookie.startsWith(SESSION_COOKIE_NAME));
	
	return sessionCookie ? sessionCookie.split("=")[1] : null;
}

// get entries with user = userId, sorted by createdAt descending
export async function getLastLoggedOnTime(env: Env, userId: string): Promise<number | null> {
	const result = await env.DB
		.prepare('SELECT createdAt FROM logonTimes WHERE user = ? ORDER BY createdAt DESC LIMIT 1')
		.bind(userId)
		.first();

	return result?.createdAt as number | null;
}