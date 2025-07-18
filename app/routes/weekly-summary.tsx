import WeeklySummaryPage from "~/weekly-summary/weekly-summary-page";
import type { Route } from "./+types/weekly-summary";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "WEEKLY SUMMARY" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function WeeklySummary({ }: Route.ComponentProps) {
	return <WeeklySummaryPage />;
}
