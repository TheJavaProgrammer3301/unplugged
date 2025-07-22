import { getAccountInfoFromSessionId, getActiveDays } from "workers/read-api";
import { getSessionIdFromRequest } from "workers/utils";
import StreakPage from "~/streak/streak-page";
import type { Route } from "./+types/streak";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "STREAK" },
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

export default function Streak({ loaderData }: Route.ComponentProps) {
	return <StreakPage accountInfo={loaderData.accountInfo!} activeDays={loaderData.activeDays!} />;
}
