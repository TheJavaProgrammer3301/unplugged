import SavedChatsPage from "~/saved-chats/saved-chats-page";
import type { Route } from "./+types/saved-chats";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "SAVED CHATS" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function SavedChats({ }: Route.ComponentProps) {
	return <SavedChatsPage />;
}
