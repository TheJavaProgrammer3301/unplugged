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

type SanitizedUserData = {
	id: string;
	name: string;
	email: string;
	coins: number;
	diamonds: number;
	streak: number;
}

export async function getAccountInfo(env: Env, userId: string): Promise<SanitizedUserData> {
	const statement = env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId);
	const result = await statement.first();

	if (!result) throw "user not found";
	
	return sanitizeUserData(result);
}