import type { Route } from "@tsndr/cloudflare-worker-router";
import { createRequestHandler } from "react-router";
import { MAIN_ROUTER } from "./setup";

interface HackableRouter {
	getRoute(request: Request): Route<any, any, any> | undefined;
}

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE
);

export default {
	async fetch(request, env, ctx) {
		const route = (MAIN_ROUTER as unknown as HackableRouter).getRoute(request);

		if (route) return MAIN_ROUTER.handle(request, env, ctx);
		else return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
} satisfies ExportedHandler<Env>;
