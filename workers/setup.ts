import { Router } from "@tsndr/cloudflare-worker-router";
import { createAccount, createAccountAndLogIn } from "./write-api";

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

router.post(`${BACKEND_PREFIX}/create-account-and-log-in`, async (request) => {
	const body = await request.req.json() as any;

	if (!body.name || !body.password || !body.email) {
		return new Response("Missing name, email or password", { status: 400 });
	}

	return createAccountAndLogIn(request.env, body.email, body.name, body.password);
});

export const MAIN_ROUTER = router;