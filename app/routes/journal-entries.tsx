import { getJournalEntries } from "workers/read-api";
import { getSessionIdFromRequest, getUserIdFromSession } from "workers/utils";
import JournalEntriesPage from "~/journal-entries/journal-entries-page";
import type { Route } from "./+types/journal-entries";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "JOURNAL ENTRIES" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const userId = sessionId !== null ? await getUserIdFromSession(context.cloudflare.env, sessionId) : null;
	const entries = userId !== null ? await getJournalEntries(context.cloudflare.env, userId) : [];
	
	return { entries };
}

export default function JournalEntries({ loaderData }: Route.ComponentProps) {
	return <JournalEntriesPage entries={loaderData.entries} />;
}
