import { Router } from "@tsndr/cloudflare-worker-router";
import { getSessionIdFromRequest, getUserIdFromSession } from "./utils";
import { createAccount, createAccountAndLogIn, createConversation, logIn, sendMessageToConversation } from "./write-api";

// worker will be used for writing data
const BACKEND_PREFIX = "/api";

const router = new Router<Env>();

router.post(`${BACKEND_PREFIX}/create-account`, async (request) => {
	const body = await request.req.json() as any;

	if (!body.name || !body.password || !body.email) {
		return new Response("Missing name, email or password", { status: 400 });
	}

	return createAccount(request.env, body.email, body.name, body.password);
});

router.post(`${BACKEND_PREFIX}/create-account-and-session`, async (request) => {
	const body = await request.req.json() as any;

	if (!body.name || !body.password || !body.email) {
		return new Response("Missing name, email or password", { status: 400 });
	}

	return createAccountAndLogIn(request.env, body.email, body.name, body.password);
});

router.post(`${BACKEND_PREFIX}/create-session`, async (request) => {
	const body = await request.req.json() as any;

	if (!body.email || !body.password) {
		return new Response("Missing email or password", { status: 400 });
	}

	return logIn(request.env, body.email, body.password);
});

router.post(`${BACKEND_PREFIX}/create-conversation`, async (request) => {
	const body = await request.req.json() as any;

	const sessionId = getSessionIdFromRequest(request.req.raw);
	const userId = sessionId !== null ? await getUserIdFromSession(request.env, sessionId) : null;

	if (!userId) return new Response("Unauthorized", { status: 401 });

	if (!body.startMessage) {
		return new Response("Missing start message", { status: 400 });
	}

	const convoId = await createConversation(request.env, userId);
	const response = await sendMessageToConversation(request.env, convoId, body.startMessage);

	return response;
});

export const MAIN_ROUTER = router;