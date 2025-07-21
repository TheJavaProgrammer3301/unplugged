import { getAccountInfoFromSessionId, getStreakLeaderboard } from "workers/read-api";
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
	
	return {
		leaderboard: await getStreakLeaderboard(context.cloudflare.env),
		accountInfo
	};
}

export default function Leaderboard({ loaderData }: Route.ComponentProps) {
	return <LeaderboardPage leaderboard={loaderData.leaderboard} accountInfo={loaderData.accountInfo} />;
}
