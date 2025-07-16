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