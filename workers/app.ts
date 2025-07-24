import type { Route, RouterContext, RouterHandler } from "@tsndr/cloudflare-worker-router";
import { createRequestHandler } from "react-router";
import { MAIN_ROUTER } from "./setup";

interface HackableRouter {
	getRoute(request: Request): Route<any, any, any> | undefined;
	globalHandlers: RouterHandler[];
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

		let response;

		if (route) {
			response = await MAIN_ROUTER.handle(request, env, ctx);
		} else {
			{
				const globalHandlerStartTime = Date.now();
				for (const handler of (MAIN_ROUTER as unknown as HackableRouter).globalHandlers) {
					await handler({ env, req: { raw: request }, ctx } as RouterContext);
				}
				const globalHandlerDuration = Date.now() - globalHandlerStartTime;
				console.debug(`[workers] global handlers executed in ${globalHandlerDuration}ms`);
			}

			const requestHandlerStartTime = Date.now();
			response = await requestHandler(request, {
				cloudflare: { env, ctx },
			});
			const requestHandlerDuration = Date.now() - requestHandlerStartTime;
			console.debug(`[workers] request handler executed in ${requestHandlerDuration}ms`);
		}

		const duration = Date.now() - startTime;
		console.debug(`[workers] responded to ${request.method} ${pathname} in ${duration}ms`);

		return response;
	},
} satisfies ExportedHandler<Env>;
