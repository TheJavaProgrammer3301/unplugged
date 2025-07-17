import AiChatPage from "~/ai-chat/ai-chat-page";
import type { Route } from "./+types/ai-chat";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "AI CHAT" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export default function AiChat({ }: Route.ComponentProps) {
	return <AiChatPage />;
}
