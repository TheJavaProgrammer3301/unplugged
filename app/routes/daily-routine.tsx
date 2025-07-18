import DailyRoutinePage from "../daily-routine/daily-routine-page";
import type { Route } from "./+types/daily-routine";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "DAILY ROUTINE" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function DailyRoutine({ }: Route.ComponentProps) {
	return <DailyRoutinePage />;
}
