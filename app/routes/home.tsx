import { getAccountInfoFromSessionId } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import Dashboard from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "DASHBOARD" },
		{ name: "description", content: "UNPLUGGED Dashboard!" },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;

	return { accountInfo };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Dashboard accountInfo={loaderData.accountInfo!} />;
}
