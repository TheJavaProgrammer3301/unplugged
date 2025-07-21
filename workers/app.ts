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
		const startTime = Date.now();
		const pathname = new URL(request.url).pathname;
		
		console.debug(`[workers] ${request.method} ${pathname}`);
		
		const route = (MAIN_ROUTER as unknown as HackableRouter).getRoute(request);

		const response = route ? await MAIN_ROUTER.handle(request, env, ctx) : await requestHandler(request, {
			cloudflare: { env, ctx },
		});

		const duration = Date.now() - startTime;
		console.debug(`[workers] responded to ${request.method} ${pathname} in ${duration}ms`);
	
		return response;
	},
} satisfies ExportedHandler<Env>;
