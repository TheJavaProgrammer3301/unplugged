import JournalEntriesPage from "~/journal-entries/journal-entries-page";
import type { Route } from "./+types/journal-entries";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "JOURNAL ENTRIES" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function JournalEntries({ }: Route.ComponentProps) {
	return <JournalEntriesPage />;
}
