import { getJournalEntry } from "workers/read-api";
import JournalPage from "~/journal/journal-page";
import type { Route } from "./+types/journal";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "JOURNAL" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
	let entry = null;

	if (params.journalId !== undefined) {
		try {
			entry = await getJournalEntry(context.cloudflare.env, params.journalId);
		} catch (error) {
			entry = null;
		}
	}

	return { entry };
}

export default function Journal({ entry }: Route.ComponentProps) {
	return <JournalPage entry={entry} />;
}
