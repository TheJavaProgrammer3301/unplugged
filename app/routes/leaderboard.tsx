import { getAccountInfoFromSessionId, getActiveDays } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import LeaderboardPage from "~/leaderboard/leaderboard-page";
import type { Route } from "./+types/leaderboard";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "LEADERBOARD" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const accountInfo = sessionId !== null ? await getAccountInfoFromSessionId(context.cloudflare.env, sessionId) : null;
	const userId = accountInfo ? accountInfo.id : null;
	const activeDays = userId !== null ? await getActiveDays(context.cloudflare.env, userId) : [];

	return { accountInfo, activeDays };
}

export default function Leaderboard({ loaderData }: Route.ComponentProps) {
	return <LeaderboardPage accountInfo={loaderData.accountInfo!} activeDays={loaderData.activeDays!} />;
}
