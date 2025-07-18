import { getDailyRoutineCompletion } from "workers/read-api";
import { getSessionIdFromRequest, getUserIdFromSession } from "workers/utils";
import DailyRoutinePage from "../daily-routine/daily-routine-page";
import type { Route } from "./+types/daily-routine";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "DAILY ROUTINE" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const userId = sessionId !== null ? await getUserIdFromSession(context.cloudflare.env, sessionId) : null;
	const completions = userId !== null ? await getDailyRoutineCompletion(context.cloudflare.env, userId) : null;

	return { completions };
}

export default function DailyRoutine({ loaderData }: Route.ComponentProps) {
	return <DailyRoutinePage completions={loaderData.completions} />;
}
