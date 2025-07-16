export async function getUserIdFromSession(env: Env, sessionId: string): Promise<string | null> {
	const statement = env.DB.prepare('SELECT id FROM sessions WHERE session = ?').bind(sessionId);
	const result = await statement.first();

	return result?.id as string | null;
}