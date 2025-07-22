import { getAccountInfoFromSessionId } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import LandingPage from "~/landing/landing-page";
import type { Route } from "./+types/landing";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "LANDING" },
		{ name: "description", content: "Welcome to unplugged." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;

	return { accountInfo };
}

export default function Landing({ loaderData }: Route.ComponentProps) {
	return <LandingPage accountInfo={loaderData.accountInfo} />;
}
