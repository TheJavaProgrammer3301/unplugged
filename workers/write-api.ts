import * as EmailValidator from 'email-validator';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { getCurrentChallengeCreatedAt } from './read-api';
import { getLastLoggedOnTime } from './utils';

// needs central
const JOURNAL_QUESTIONS = ["How are you feeling today?", "What happened today?", "What's one goal for tomorrow?"];

//#region utility
export async function addMessageToConversation(env: Env, conversation: ChatCompletionMessageParam[], conversationId: string, input: string, userId: string) {
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

	if (input.toLowerCase().includes("goon")) {
		const userResult = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(userId).first();
		const currentBadges: string[] = userResult?.badges ? JSON.parse(userResult.badges as string) : [];

		if (!currentBadges.includes("Goonsplosion")) {
			currentBadges.push("Goonsplosion");
			await env.DB.prepare('UPDATE users SET badges = ?, diamonds = diamonds + 50 WHERE id = ?')
				.bind(JSON.stringify(currentBadges), userId).run();
		}
	}

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
			{ role: "user", content: "What should we name this conversation? Reply with just the name. Make it specific to the exact topic, nothing generic or vague." }
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
			{ role: "system", content: "What should we name this journal entry? Reply with just the name. Make it very specific to the entries; not something generic like 'The ___ Chronicles'. Still just a few words." }
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
		.prepare('INSERT INTO users (id, name, email, password, username, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
		.bind(id, name, email, password, username, Date.now());

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

export async function createConversation(env: Env, userId: string): Promise<[string, number]> {
	const conversationId = crypto.randomUUID();

	const statement = env.DB
		.prepare('INSERT INTO conversations (id, user, content, lastUpdatedAt) VALUES (?, ?, ?, ?)')
		.bind(conversationId, userId, JSON.stringify([]), Date.now());
	await statement.run();

	// Count total conversations for this user
	const countResult = await env.DB
		.prepare('SELECT COUNT(*) as count FROM conversations WHERE user = ?')
		.bind(userId)
		.first();
	const totalConversations = (countResult?.count as number) || 0;

	// Add "Chatty Fella" badge if user now has 5 conversations
	if (totalConversations === 5) {
		const userResult = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(userId).first();
		const currentBadges: string[] = userResult?.badges ? JSON.parse(userResult.badges as string) : [];

		if (!currentBadges.includes("Chatty Fella")) {
			currentBadges.push("Chatty Fella");
			await env.DB.prepare('UPDATE users SET badges = ?, diamonds = diamonds + 50 WHERE id = ?')
				.bind(JSON.stringify(currentBadges), userId).run();
		}
	}

	return [conversationId, totalConversations];
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
		.prepare('SELECT content, user FROM conversations WHERE id = ?')
		.bind(conversationId)
		.first();

	if (!result) return new Response("Conversation not found", { status: 404 });

	try {
		const conversation = JSON.parse(result.content as string) as ChatCompletionMessageParam[];
		const finalConversation = await addMessageToConversation(env, conversation, conversationId, input, result.user as string);

		// Check if input contains "goon" and add badge
		if (input.toLowerCase().includes("goon")) {
			const userId = result.user as string;
			const userResult = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(userId).first();
			const currentBadges: string[] = userResult?.badges ? JSON.parse(userResult.badges as string) : [];

			if (!currentBadges.includes("Goonsplosion")) {
				currentBadges.push("Goonsplosion");
				await env.DB.prepare('UPDATE users SET badges = ?, diamonds = diamonds + 50 WHERE id = ?')
					.bind(JSON.stringify(currentBadges), userId).run();
			}
		}

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

		// Count total journal entries for this user
		const countResult = await env.DB
			.prepare('SELECT COUNT(*) as count FROM journalEntries WHERE user = ?')
			.bind(userId)
			.first();
		const totalJournalEntries = (countResult?.count as number) || 0;

		// Add "Congressional Hearing" badge if user now has 5 journal entries
		if (totalJournalEntries === 5) {
			const userResult = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(userId).first();
			const currentBadges: string[] = userResult?.badges ? JSON.parse(userResult.badges as string) : [];

			if (!currentBadges.includes("Congressional Hearing")) {
				currentBadges.push("Congressional Hearing");
				await env.DB.prepare('UPDATE users SET badges = ?, diamonds = diamonds + 50 WHERE id = ?')
					.bind(JSON.stringify(currentBadges), userId).run();
			}
		}

		return Response.json({ id, totalJournalEntries }, { status: 201 });
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

export async function logIn(env: Env, identifier: string, password: string, loginType: "email" | "username"): Promise<Response> {
	const user = await env.DB.prepare(`SELECT * FROM users WHERE ${loginType} = ? AND password = ?`).bind(identifier, password).first();

	if (!user) return new Response("Invalid email/username or password", { status: 401 });

	return createSession(env, user.id as string);
}

export async function setDailyChallenge(env: Env, userId: string, challenge: string): Promise<Response> {
	const output = await ensureExpirationOfChallenge(env, userId);

	if (output) {
		const createdTime = Date.now();

		{
			const statement = env.DB.prepare('INSERT INTO challenges (user, challenge, createdAt) VALUES (?, ?, ?)').bind(userId, challenge, createdTime);

			await statement.run();
		}

		{
			const statement = env.DB.prepare('INSERT OR REPLACE INTO currentChallenges (user, challengeCreatedAt) VALUES (?, ?)').bind(userId, createdTime);

			await statement.run();
		}

		{
			const statement = env.DB.prepare('INSERT OR REPLACE INTO routineItems (user, temporary, name, id) VALUES (?, 1, ?, ?)').bind(userId, `Mind bank: ${challenge}`, crypto.randomUUID());

			await statement.run();
		}

		return new Response(null, { status: 204 });
	} else return new Response("Current challenge not expired", { status: 409 });
}

export async function updateDailyChallenge(env: Env, userId: string, completed: boolean): Promise<Response> {
	const currentDailyChallengeCreatedAt = await getCurrentChallengeCreatedAt(env, userId);

	if (currentDailyChallengeCreatedAt === null) return new Response(null, { status: 204 });

	if (await ensureExpirationOfChallengeFromCreatedAt(env, userId, currentDailyChallengeCreatedAt) === false) {
		// Count completed challenges before updating
		const beforeCountResult = await env.DB.prepare('SELECT COUNT(*) as count FROM challenges WHERE user = ? AND completed = 1').bind(userId).first();
		const completedCountBefore = (beforeCountResult?.count as number) || 0;

		const statement = env.DB.prepare('UPDATE challenges SET completed = ? WHERE user = ? AND createdAt = ?').bind(completed ? 1 : 0, userId, currentDailyChallengeCreatedAt);

		await statement.run();

		// If marking as completed, check if this is a milestone
		if (completed) {
			const afterCountResult = await env.DB.prepare('SELECT COUNT(*) as count FROM challenges WHERE user = ? AND completed = 1').bind(userId).first();
			const completedCountAfter = (afterCountResult?.count as number) || 0;

			// Return special response for milestones
			if (completedCountAfter === 1) {
				// Add "First Spin" badge
				const userResult = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(userId).first();
				const currentBadges: string[] = userResult?.badges ? JSON.parse(userResult.badges as string) : [];

				if (!currentBadges.includes("First Spin")) {
					currentBadges.push("First Spin");
					await env.DB.prepare('UPDATE users SET badges = ?, diamonds = diamonds + 50 WHERE id = ?')
						.bind(JSON.stringify(currentBadges), userId).run();
				}

				return Response.json({ firstSpin: true });
			} else if (completedCountAfter === 3) {
				// Add "Obedient User" badge
				const userResult = await env.DB.prepare('SELECT badges FROM users WHERE id = ?').bind(userId).first();
				const currentBadges: string[] = userResult?.badges ? JSON.parse(userResult.badges as string) : [];

				if (!currentBadges.includes("Obedient User")) {
					currentBadges.push("Obedient User");
					await env.DB.prepare('UPDATE users SET badges = ?, diamonds = diamonds + 50 WHERE id = ?')
						.bind(JSON.stringify(currentBadges), userId).run();
				}

				return Response.json({ goodBoy: true });
			}
		}
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

export async function resetDailyRoutineItemCompletionStatesIfNecessary(env: Env, userId: string): Promise<void> {
	const lastLoggedOn = await getLastLoggedOnTime(env, userId);
	const now = Date.now();

	if (!lastLoggedOn) return;

	const timeDiff = now - lastLoggedOn;
	const oneDayMs = 24 * 60 * 60 * 1000;

	if (timeDiff >= oneDayMs) {
		// Reset all routine items to not completed
		await env.DB.prepare('UPDATE routineItems SET completed = 0 WHERE user = ?').bind(userId).run();
		// Delete any temporary routine items
		await env.DB.prepare('DELETE FROM routineItems WHERE user = ? AND temporary = 1').bind(userId).run();
	}
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
			await env.DB.prepare('UPDATE users SET streak = 1 WHERE id = ?').bind(userId).run();
		}
	}
}

// savedQuotes is a column in users table
// decrement user gems by 10, and add the quote to savedQuotes. only do this if quote isnt already present in savedQuotes
export async function saveQuote(env: Env, userId: string, quote: string): Promise<Response> {
	const user = await env.DB.prepare('SELECT savedQuotes, diamonds FROM users WHERE id = ?').bind(userId).first();

	if (!user) return new Response("User not found", { status: 404 });

	const savedQuotes: string[] = user.savedQuotes ? JSON.parse(user.savedQuotes as string) : [];
	if (savedQuotes.includes(quote)) return new Response("Quote already saved", { status: 409 });

	if ((user as { diamonds: number }).diamonds < 10) return new Response("Not enough gems", { status: 402 });

	savedQuotes.push(quote);
	const updatedSavedQuotes = JSON.stringify(savedQuotes);

	const statement = env.DB.prepare('UPDATE users SET savedQuotes = ?, diamonds = diamonds - 10 WHERE id = ?')
		.bind(updatedSavedQuotes, userId);

	await statement.run();

	return new Response(null, { status: 204 });
}

export async function updateAccount(env: Env, userId: string, email: string, name: string, username: string): Promise<Response> {
	const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();

	if (!user) return new Response("User not found", { status: 404 });

	const statement = env.DB.prepare('UPDATE users SET email = ?, name = ?, username = ? WHERE id = ?')
		.bind(email, name, username, userId);

	await statement.run();

	return new Response(null, { status: 204 });
}