import { getCurrentChallenge } from "workers/read-api";
import { getSessionIdFromRequest, getUserIdFromSession } from "workers/utils";
import MindBankPage from "~/mind-bank/mind-bank-page";
import type { Route } from "./+types/mind-bank";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "MIND BANK" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const userId = sessionId !== null ? await getUserIdFromSession(context.cloudflare.env, sessionId) : null;
	const dailyChallenge = userId !== null ? await getCurrentChallenge(context.cloudflare.env, userId) : null;

	return { dailyChallenge };
}

export default function MindBank({ loaderData }: Route.ComponentProps) {
	return <MindBankPage dailyChallenge={loaderData.dailyChallenge} />;
}
