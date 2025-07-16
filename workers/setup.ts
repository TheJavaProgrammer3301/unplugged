import { Router } from "@tsndr/cloudflare-worker-router";
import { createAccount } from "./write-api";

// worker will be used for writing data
const BACKEND_PREFIX = "/api";

const router = new Router<Env>();

router.post(`${BACKEND_PREFIX}/create-account`, async (request) => {
	const body = await request.req.json() as any;

	if (!body.name || !body.password) {
		return new Response("Missing name or password", { status: 400 });
	}

	return createAccount(request.env, body.name, body.password);
});

export const MAIN_ROUTER = router;