import JournalPage from "~/journal/journal-page";
import type { Route } from "./+types/journal";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "JOURNAL" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function Journal({ }: Route.ComponentProps) {
	return <JournalPage />;
}
