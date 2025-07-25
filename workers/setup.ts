import { Router } from "@tsndr/cloudflare-worker-router";
import { getSessionIdFromRequest, getUserIdFromSession } from "./utils";
import { addDailyRoutineItem, addMessageToConversation, createAccount, createAccountAndLogIn, createConversation, createJournalEntry, deleteDailyRoutineItem, generateNameForConversation, logIn, saveQuote, sendMessageToConversation, setDailyChallenge, setNameOfConversation, tryUpdateStreak, updateAccount, updateDailyChallenge, updateDailyRoutineItem } from "./write-api";

// worker will be used for writing data
const BACKEND_PREFIX = "/api";

const router = new Router<Env>();

router.use(async (request) => {
	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (userId) await tryUpdateStreak(request.env, userId);
});

router.post(`${BACKEND_PREFIX}/account`, async (request) => {
	const body = await request.req.json() as any;

	if (!body.name || !body.password || !body.email || !body.username) {
		return new Response("Missing name, email, password or username", { status: 400 });
	}

	return createAccount(request.env, body.email, body.name, body.password, body.username);
});

router.put(`${BACKEND_PREFIX}/account`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	return updateAccount(request.env, userId, body.email, body.name, body.username);
});

router.post(`${BACKEND_PREFIX}/create-account-and-session`, async (request) => {
	const body = await request.req.json() as any;

	if (!body.name || !body.password || !body.email || !body.username) {
		return new Response("Missing name, email, password or username", { status: 400 });
	}

	return createAccountAndLogIn(request.env, body.email, body.name, body.password, body.username);
});

router.post(`${BACKEND_PREFIX}/create-session`, async (request) => {
	const body = await request.req.json() as any;

	if ((!body.email && !body.username) || !body.password) {
		return new Response("Missing email/username or password", { status: 400 });
	}

	return logIn(request.env, body.email ?? body.username, body.password, "email" in body ? "email" : "username");
});

router.post(`${BACKEND_PREFIX}/conversations`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.startMessage) {
		return new Response("Missing start message", { status: 400 });
	}

	const [convoId, count] = await createConversation(request.env, userId);
	const conversation = await addMessageToConversation(request.env, [], convoId, body.startMessage, userId);

	await setNameOfConversation(request.env, convoId, await generateNameForConversation(request.env, conversation));

	return Response.json({ conversationId: convoId, conversation, totalConversations: count }, { status: 201 });
});

router.post(`${BACKEND_PREFIX}/conversations/:conversationId/messages`, async (request) => {
	const { conversationId } = request.req.params as { conversationId: string };
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.message) {
		return new Response("Missing message", { status: 400 });
	}

	return await sendMessageToConversation(request.env, conversationId, body.message);
});

router.post(`${BACKEND_PREFIX}/journals`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.contents || !Array.isArray(body.contents)) {
		return new Response("Missing or invalid contents", { status: 400 });
	}

	return await createJournalEntry(request.env, userId, body.contents);
});

router.post(`${BACKEND_PREFIX}/daily-routine`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.item) {
		return new Response("Missing item", { status: 400 });
	}

	return await addDailyRoutineItem(request.env, userId, body.item);
});

router.put(`${BACKEND_PREFIX}/daily-routine/:itemId`, async (request) => {
	const body = await request.req.json() as any;
	const itemId = request.req.params.itemId;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (typeof body.completed !== "boolean") {
		return new Response("Missing item or completed status", { status: 400 });
	}

	return await updateDailyRoutineItem(request.env, userId, itemId, body.completed);
});

router.delete(`${BACKEND_PREFIX}/daily-routine/:itemId`, async (request) => {
	const itemId = request.req.params.itemId;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	return await deleteDailyRoutineItem(request.env, userId, itemId);
});

router.post(`${BACKEND_PREFIX}/challenge`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.challenge) {
		return new Response("Missing challenge", { status: 400 });
	}

	return await setDailyChallenge(request.env, userId, body.challenge);
});

router.put(`${BACKEND_PREFIX}/challenge`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.completed) {
		return new Response("Missing completed status", { status: 400 });
	}

	return await updateDailyChallenge(request.env, userId, body.completed);
});

router.post(`${BACKEND_PREFIX}/quotes`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.quote) {
		return new Response("Missing quote", { status: 400 });
	}

	return await saveQuote(request.env, userId, body.quote);
});

export const MAIN_ROUTER = router;