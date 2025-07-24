import { getWeeklySummary } from "workers/read-api";
import { getSessionIdFromRequest, getUserIdFromSession } from "workers/utils";
import WeeklySummaryPage from "~/weekly-summary/weekly-summary-page";
import type { Route } from "./+types/weekly-summary";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "WEEKLY SUMMARY" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const userId = sessionId !== null ? await getUserIdFromSession(context.cloudflare.env, sessionId) : null;
	const summary = userId !== null ? await getWeeklySummary(context.cloudflare.env, userId) : null;
	
	return { summary };
}

export default function WeeklySummary({ loaderData }: Route.ComponentProps) {
	return <WeeklySummaryPage summary={loaderData.summary!} />;
}
