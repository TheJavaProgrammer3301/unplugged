import { getSavedChats } from "workers/read-api";
import { getSessionIdFromRequest, getUserIdFromSession } from "workers/utils";
import SavedChatsPage from "~/saved-chats/saved-chats-page";
import type { Route } from "./+types/saved-chats";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "SAVED CHATS" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const sessionId = getSessionIdFromRequest(request);
	const userId = sessionId !== null ? await getUserIdFromSession(context.cloudflare.env, sessionId) : null;
	const savedChats = userId !== null ? await getSavedChats(context.cloudflare.env, userId) : null;

	return { savedChats };
}

export default function SavedChats({ loaderData }: Route.ComponentProps) {
	// no error handle yet
	return <SavedChatsPage savedChats={loaderData.savedChats!} />;
}
