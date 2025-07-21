import * as EmailValidator from 'email-validator';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { getCurrentChallengeCreatedAt } from './read-api';
import { getLastLoggedOnTime } from './utils';

// needs central
const JOURNAL_QUESTIONS = ["How are you feeling today?", "What happened today?", "What's one goal for tomorrow?"];

//#region utility
export async function addMessageToConversation(env: Env, conversation: ChatCompletionMessageParam[], conversationId: string, input: string) {
	const newMessages: ChatCompletionMessageParam[] = [{ role: "user", content: input }];

	const client = new OpenAI({
		apiKey: env.OPENAI_API_KEY
	});

	const response = await client.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: env.THERYN_PROMPT },
			...conversation,
			...newMessages
		]
	});

	const message = response.choices[0]?.message as ChatCompletionMessageParam | undefined;

	newMessages.push(message!);

	const finalConversation: ChatCompletionMessageParam[] = [...conversation, ...newMessages];

	const statement = env.DB
		.prepare('UPDATE conversations SET content = ?, lastUpdatedAt = ? WHERE id = ?')
		.bind(JSON.stringify(finalConversation), Date.now(), conversationId);
	await statement.run();

	return finalConversation;
}

export async function getSavedChats(env: Env, userId: string): Promise<{ id: string; lastUpdatedAt: number; name: string }[]> {
	const result = await env.DB
		.prepare('SELECT id, lastUpdatedAt, name FROM conversations WHERE user = ?')
		.bind(userId)
		.all();

	return result.results.map(row => ({
		id: row.id as string,
		lastUpdatedAt: row.lastUpdatedAt as number,
		name: (row.name ?? "none") as string
	}));
}

export async function addDailyRoutineItem(env: Env, userId: string, item: string): Promise<Response> {
	const id = crypto.randomUUID();

	try {
		const statement = env.DB
			.prepare('INSERT INTO routineItems (user, name, id, completed) VALUES (?, ?, ?, 0)')
			.bind(userId, item, id);

		await statement.run();

		return Response.json({ id }, { status: 201 });
	} catch (error) {
		console.warn("Error adding daily routine item:", error);
		return new Response("Error adding daily routine item", { status: 500 });
	}
}

export async function deleteDailyRoutineItem(env: Env, userId: string, itemId: string): Promise<Response> {
	try {
		const statement = env.DB
			.prepare('DELETE FROM routineItems WHERE user = ? AND id = ?')
			.bind(userId, itemId);

		await statement.run();

		return new Response(null, { status: 204 });
	} catch (error) {
		console.warn("Error deleting daily routine item:", error);
		return new Response("Error deleting daily routine item", { status: 500 });
	}
}

export async function updateDailyRoutineItem(env: Env, userId: string, itemId: string, completed: boolean): Promise<Response> {
	try {
		const statement = env.DB
			.prepare('UPDATE routineItems SET completed = ? WHERE user = ? AND id = ?')
			.bind(completed ? 1 : 0, userId, itemId);

		await statement.run();

		return new Response(null, { status: 204 });
	} catch (error) {
		console.warn("Error updating daily routine item:", error);
		return new Response("Error updating daily routine item", { status: 500 });
	}
}

// generate a name based on current conversation
export async function generateNameForConversation(env: Env, conversation: ChatCompletionMessageParam[]): Promise<string> {
	const client = new OpenAI({
		apiKey: env.OPENAI_API_KEY
	});

	const response = await client.chat.completions.create({
		model: "gpt-4o",
		messages: [
			...conversation,
			{ role: "user", content: "What should we name this conversation? Reply with just the name" }
		]
	});

	return response.choices[0]?.message.content ?? "Untitled Conversation";
}

// generate name for a journal entry
export async function generateNameForJournalEntry(env: Env, contents: string[]): Promise<string> {
	const client = new OpenAI({
		apiKey: env.OPENAI_API_KEY
	});

	const response = await client.chat.completions.create({
		model: "gpt-4o",
		messages: [
			...JOURNAL_QUESTIONS.map((q, i) => ({ role: "user", content: q + "\n" + (contents[i] ?? "") } as ChatCompletionMessageParam)),
			{ role: "system", content: "What should we name this journal entry? Reply with just the name" }
		]
	});

	return response.choices[0]?.message.content ?? "Untitled Journal Entry";
}

export async function setNameOfConversation(env: Env, conversationId: string, name: string): Promise<void> {
	const statement = env.DB
		.prepare('UPDATE conversations SET name = ? WHERE id = ?')
		.bind(name, conversationId);
	await statement.run();
}
//#endregion utility

export async function createAccount(env: Env, email: string, name: string, password: string, username: string): Promise<Response> {
	const id = crypto.randomUUID();

	if (!EmailValidator.validate(email)) return new Response("Invalid email address", { status: 400 });

	// check if account with email already exists
	const checkStatement = env.DB.prepare('SELECT COUNT(*) FROM users WHERE email = ?');
	const result = await checkStatement.bind(email).first();
	const count = result?.['COUNT(*)'] as number | null;

	if (count && count > 0) return new Response("Account with that email already exists", { status: 409 });

	const statement = env.DB
		.prepare('INSERT INTO users (id, name, email, password, username) VALUES (?, ?, ?, ?, ?)')
		.bind(id, name, email, password, username);

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

	const statement = env.DB
		.prepare('INSERT INTO conversations (id, user, content, lastUpdatedAt) VALUES (?, ?, ?, ?)')
		.bind(conversationId, userId, JSON.stringify([]), Date.now());
	await statement.run();

	return conversationId;
}

export async function getConversation(env: Env, conversationId: string): Promise<ChatCompletionMessageParam[]> {
	const result = await env.DB
		.prepare('SELECT content FROM conversations WHERE id = ?')
		.bind(conversationId)
		.first();

	if (!result) throw `not found`;

	return JSON.parse(result.content as string) as ChatCompletionMessageParam[];
}

export async function sendMessageToConversation(env: Env, conversationId: string, input: string): Promise<Response> {
	const result = await env.DB
		.prepare('SELECT content FROM conversations WHERE id = ?')
		.bind(conversationId)
		.first();

	if (!result) return new Response("Conversation not found", { status: 404 });

	try {
		const conversation = JSON.parse(result.content as string) as ChatCompletionMessageParam[];
		const finalConversation = await addMessageToConversation(env, conversation, conversationId, input);

		return Response.json(finalConversation);
	} catch (e) {
		console.warn(e);
		return new Response("Server error", { status: 500 });
	}
}

export async function createJournalEntry(env: Env, userId: string, contents: string[]): Promise<Response> {
	const id = crypto.randomUUID();

	try {
		const name = await generateNameForJournalEntry(env, contents);

		const statement = env.DB
			.prepare('INSERT INTO journalEntries (id, user, contents, createdAt, name) VALUES (?, ?, ?, ?, ?)')
			.bind(id, userId, JSON.stringify(contents), Date.now(), name);

		await statement.run();

		return Response.json({ id }, { status: 201 });
	} catch (error) {
		console.warn("Error creating journal entry:", error);
		return new Response("Error creating journal entry", { status: 500 });
	}
}

// bindings
export async function createAccountAndLogIn(env: Env, email: string, name: string, password: string, username: string): Promise<Response> {
	const accountResponse = await createAccount(env, email, name, password, username);

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

export async function setDailyChallenge(env: Env, userId: string, challenge: string): Promise<Response> {
	console.warn("fein");
	const output = await ensureExpirationOfChallenge(env, userId);
	console.log("Output of ensureExpirationOfChallenge:", output);
	if (output) {
		console.log("Expired");
		const createdTime = Date.now();

		{
			const statement = env.DB.prepare('INSERT INTO challenges (user, challenge, createdAt) VALUES (?, ?, ?)').bind(userId, challenge, createdTime);

			await statement.run();
		}

		{
			const statement = env.DB.prepare('INSERT OR REPLACE INTO currentChallenges (user, challengeCreatedAt) VALUES (?, ?)').bind(userId, createdTime);

			await statement.run();
		}

		return new Response(null, { status: 204 });
	} else return new Response("Current challenge not expired", { status: 409 });
}

export async function updateDailyChallenge(env: Env, userId: string, completed: boolean): Promise<Response> {
	const currentDailyChallengeCreatedAt = await getCurrentChallengeCreatedAt(env, userId);

	if (currentDailyChallengeCreatedAt === null) return new Response(null, { status: 204 });

	if (await ensureExpirationOfChallengeFromCreatedAt(env, userId, currentDailyChallengeCreatedAt) === false) {
		const statement = env.DB.prepare('UPDATE challenges SET completed = ? WHERE user = ? AND createdAt = ?').bind(completed ? 1 : 0, userId, currentDailyChallengeCreatedAt);

		await statement.run();
	}

	return new Response(null, { status: 204 });
}

export async function ensureExpirationOfChallenge(env: Env, userId: string): Promise<boolean> {
	const currentDailyChallengeCreatedAt = await getCurrentChallengeCreatedAt(env, userId);

	console.log(currentDailyChallengeCreatedAt, "guh");

	if (!currentDailyChallengeCreatedAt) return true;

	console.log(currentDailyChallengeCreatedAt, "duh");

	return await ensureExpirationOfChallengeFromCreatedAt(env, userId, currentDailyChallengeCreatedAt);
}

export async function ensureExpirationOfChallengeFromCreatedAt(env: Env, userId: string, createdAt: number): Promise<boolean> {
	const currentTime = Date.now();
	const oneDayMs = 24 * 60 * 60 * 1000;

	if (currentTime - createdAt! > oneDayMs) {
		const statement = env.DB.prepare('DELETE FROM currentChallenges WHERE user = ?').bind(userId);

		await statement.run();

		return true;
	}

	return false;
}

export async function tryUpdateStreak(env: Env, userId: string): Promise<void> {
	const lastLoggedOn = await getLastLoggedOnTime(env, userId);
	const now = Date.now();

	if (!lastLoggedOn) {
		// No last logged in - set it to now, set streak to 1
		await env.DB.prepare('INSERT INTO logonTimes (user, createdAt) VALUES (?, ?)').bind(userId, now).run();
		await env.DB.prepare('UPDATE users SET streak = 1 WHERE id = ?').bind(userId).run();
	} else {
		const timeDiff = now - lastLoggedOn;
		const oneDayMs = 24 * 60 * 60 * 1000;
		
		if (timeDiff < oneDayMs) {
			// Has been <24h since last log on - don't update
			return;
		} else if (timeDiff < 2 * oneDayMs) {
			// Has been >24h <48h - update, increment streak
			await env.DB.prepare('INSERT INTO logonTimes (user, createdAt) VALUES (?, ?)').bind(userId, now).run();
			await env.DB.prepare('UPDATE users SET streak = streak + 1 WHERE id = ?').bind(userId).run();
		} else {
			// Has been >48h - update, set streak to 0
			await env.DB.prepare('INSERT INTO logonTimes (user, createdAt) VALUES (?, ?)').bind(userId, now).run();
			await env.DB.prepare('UPDATE users SET streak = 0 WHERE id = ?').bind(userId).run();
		}
	}
}

export async function resetDailyRoutineItemCompletionStatesIfNecessary(env: Env, userId: string): Promise<void> {
	const lastLoggedOn = await getLastLoggedOnTime(env, userId);
	const now = Date.now();

	if (!lastLoggedOn) return;

	const timeDiff = now - lastLoggedOn;
	const oneDayMs = 24 * 60 * 60 * 1000;

	if (timeDiff >= oneDayMs) {
		// Reset all routine items to not completed
		await env.DB.prepare('UPDATE routineItems SET completed = 0 WHERE user = ?').bind(userId).run();
	}
}