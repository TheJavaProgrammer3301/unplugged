import * as EmailValidator from 'email-validator';

export async function createAccount(env: Env, email: string, name: string, password: string): Promise<Response> {
	const id = crypto.randomUUID();

	if (!EmailValidator.validate(email)) return new Response("Invalid email address", { status: 400 });

	// check if account with email already exists
	const checkStatement = env.DB.prepare('SELECT COUNT(*) FROM users WHERE email = ?');
	const result = await checkStatement.bind(email).first();
	const count = result?.['COUNT(*)'] as number | null;

	if (count && count > 0) return new Response("Account with that email already exists", { status: 409 });

	const statement = env.DB
		.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)')
		.bind(id, name, email, password);

	try {
		await statement.run();
	} catch (error) {
		console.warn(error);
		return new Response("Error creating account", { status: 500 });
	}

	return Response.json({
		id
	}, { status: 201 });
}

export async function createSession(env: Env, id: string): Promise<Response> {
	const sessionId = crypto.randomUUID();

	const statement = env.DB
		.prepare('INSERT INTO sessions (session, id) VALUES (?, ?)')
		.bind(sessionId, id);

	try {
		await statement.run();
	} catch (error) {
		console.warn(error);
		return new Response("Error creating session", { status: 500 });
	}

	return Response.json({
		session: sessionId,
		userId: id
	}, { status: 201 });
}

// bindings
export async function createAccountAndLogIn(env: Env, email: string, name: string, password: string): Promise<Response> {
	const accountResponse = await createAccount(env, email, name, password);

	if (accountResponse.status !== 201) return accountResponse;

	const userId = (await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first())?.id as string | null;

	if (!userId) return new Response("User not found", { status: 404 });

	return createSession(env, userId);
}

export async function logIn(env: Env, email: string, password: string): Promise<Response> {
	const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND password = ?').bind(email, password).first();

	if (!user) return new Response("Invalid email or password", { status: 401 });

	return createSession(env, user.id as string);
}