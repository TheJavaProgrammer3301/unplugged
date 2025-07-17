import * as EmailValidator from 'email-validator';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

async function addMessageToConversation(env: Env, conversation: ChatCompletionMessageParam[], conversationId: string, input: string) {
	const newMessages: ChatCompletionMessageParam[] = [{ role: "user", content: input }];

	const client = new OpenAI({
		apiKey: env.OPENAI_API_KEY
	});

	const response = await client.chat.completions.create({
		model: "gpt-4o",
		messages: [
			...conversation,
			...newMessages
		]
	});

	const message = response.choices[0]?.message as ChatCompletionMessageParam | undefined;

	newMessages.push(message!);

	const finalConversation: ChatCompletionMessageParam[] = [...conversation, ...newMessages];

	await env.CONVERSATIONS.put(`${conversationId}`, JSON.stringify(finalConversation));

	return finalConversation;
}

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

export async function createConversation(env: Env, userId: string): Promise<string> {
	const conversationId = crypto.randomUUID();

	await env.CONVERSATIONS.put(`${conversationId}`, JSON.stringify({}), { metadata: { userId } });

	return conversationId;
}

export async function getConversation(env: Env, conversationId: string): Promise<ChatCompletionMessageParam[]> {
	const conversation = await env.CONVERSATIONS.get(conversationId, { type: "json" });

	if (!conversation) throw `not found`;

	return conversation as ChatCompletionMessageParam[];
}

export async function sendMessageToConversation(env: Env, conversationId: string, input: string): Promise<Response> {
	const conversation = await env.CONVERSATIONS.get(conversationId, { type: "json" });

	if (!conversation) return new Response("Conversation not found", { status: 404 });

	try {
		const finalConversation = await addMessageToConversation(env, conversation as ChatCompletionMessageParam[], conversationId, input);
	
		return Response.json(finalConversation);
	} catch (e) {
		console.warn(e);
		return new Response("Server error", { status: 500 });
	}
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