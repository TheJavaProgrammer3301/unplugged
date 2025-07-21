import { getUserDailyRoutine } from "workers/read-api";
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
	const routine = userId !== null ? await getUserDailyRoutine(context.cloudflare.env, userId) : null;

	return { routine };
}

export default function DailyRoutine({ loaderData }: Route.ComponentProps) {
	return <DailyRoutinePage routine={loaderData.routine} />;
}
