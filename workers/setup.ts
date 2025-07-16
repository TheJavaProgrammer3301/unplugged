import { Router } from "@tsndr/cloudflare-worker-router";

const router = new Router<Env>();

router.get("/hello", async (request) => {
	return new Response("Hello, world!");
});

export const MAIN_ROUTER = router;