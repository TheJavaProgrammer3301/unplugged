import type { ChatCompletionMessageParam } from "openai/resources";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MDXRenderer } from "~/mdx-renderer";
import "./ai-chat-page.css";
import therynLogo from "./theryn.png"; // Make sure this path is correct

function ChatMessage({ message }: { message: ChatCompletionMessageParam }) {
	return <div
		className={`chat-bubble ${message.role === "user" ? "user" : "assistant"}`}
	>
		{<MDXRenderer source={message.content?.toString() ?? ""} />}
	</div>
}

export default function AIChatPage({ conversation, chatId }: { conversation?: ChatCompletionMessageParam[]; chatId?: string | null }) {
	const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
	const [input, setInput] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		setMessages(conversation ?? []);
	}, [conversation]);

	const hasBadConversationReference = chatId && !conversation;

	useEffect(() => {
		if (hasBadConversationReference) navigate("/ai-chat", { replace: true });
	}, [hasBadConversationReference]);

	if (hasBadConversationReference) return <></>;

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage: ChatCompletionMessageParam = { role: "user", content: input.trim() };

		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		if (!chatId) {
			// make new convo
			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ startMessage: input.trim() })
			});

			if (!response.ok) {
				console.error("Failed to create conversation");
				return;
			}

			const data = await response.json() as { conversationId: string; conversation: ChatCompletionMessageParam[] };

			navigate(`/ai-chat/${data.conversationId}`, { replace: true });
		} else {
			const response = await fetch(`/api/conversations/${chatId}/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ message: input.trim() })
			});

			if (!response.ok) {
				console.error("Failed to send message");
				return;
			}

			const data = await response.json() as ChatCompletionMessageParam[];

			setMessages(data);
		}
	};

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				<div className="ai-chat-header">
					<button className="back-button" onClick={() => navigate("/dashboard")}>
						← Back
					</button>
					<div className="theryn-label">
						<img src={therynLogo} alt="Theryn Logo" className="theryn-logo" />
						<h1>Theryn</h1>
					</div>
				</div>

				<div className="chat-messages">
					{messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
				</div>

				<form className="chat-input-form" onSubmit={handleSend}>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Send a message..."
						className="chat-input"
					/>
					<button type="submit" className="send-button">→</button>
				</form>
			</div>
		</div>
	);
}
