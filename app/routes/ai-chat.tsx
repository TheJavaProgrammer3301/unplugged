import type { ChatCompletionMessageParam } from "openai/resources";
import { getConversation } from "workers/write-api";
import AiChatPage from "~/ai-chat/ai-chat-page";
import type { Route } from "./+types/ai-chat";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "AI CHAT" },
		{ name: "description", content: "The requested page could not be found." },
	];
}

export async function loader({ context, params }: Route.LoaderArgs) {
	let conversation = null;
	
	if (params.chatId !== undefined) {
		try {
			conversation = await getConversation(context.cloudflare.env, params.chatId);
		} catch (error) {
			conversation = null;
		}
	}

	return { conversation, chatId: params.chatId };
}

export default function AiChat({ loaderData }: Route.ComponentProps) {
	return <AiChatPage conversation={loaderData.conversation as ChatCompletionMessageParam[]} chatId={loaderData.chatId} />;
}
