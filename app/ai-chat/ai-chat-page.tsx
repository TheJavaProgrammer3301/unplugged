import { Card, CircularProgress, List, ListItem, Sheet, Textarea } from "@mui/joy";
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import type { ChatCompletionMessageParam } from "openai/resources";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router";
import "./ai-chat-page.css";

const INSET = 32;
const OFFSET = 0.132;

const colors = {
	//rgb(32, 116, 223)
	primaryBackground: "rgb(0, 17, 44)",
	userChatBackground: "rgb(24, 87, 168)",
	userChatBorder: "rgb(44, 107, 188)",
	assistantChatBackground: "rgb(30, 30, 30)",
	assistantChatBorder: "rgb(50, 50, 50)",
}
// const colors = {
// 	primaryBackground: "rgb(20, 20, 20)",
// 	userChatBackground: "rgb(75, 75, 75)",
// 	userChatBorder: "rgb(65, 65, 65)",
// 	assistantChatBackground: "rgb(30, 30, 30)",
// 	assistantChatBorder: "rgb(50, 50, 50)",
// }

const colorsets = {
	user: {
		background: colors.userChatBackground,
		border: colors.userChatBorder,
		color: "white",
		leftInset: `${INSET}px`,
		rightInset: "0px"
	},
	assistant: {
		background: colors.assistantChatBackground,
		border: colors.assistantChatBorder,
		color: "white",
		leftInset: "0px",
		rightInset: `${INSET}px`
	}
}

const theme = extendTheme({
	colorSchemes: {
		light: {
			palette: {
				background: {
					// surface: "rgb(20, 20, 20)", // card background
				},
				neutral: {
					outlinedColor: "rgb(255, 255, 255)", // text color
					softBg: colors.assistantChatBackground
				},
				primary: {
					solidBg: colors.assistantChatBorder
				}
			},
		},
	},
});

// Then, pass it to `<CssVarsProvider theme={theme}>`.



function ChatMessage({ message }: { message: ChatCompletionMessageParam }) {
	const set = message.role === "user" ? colorsets.user : colorsets.assistant;

	return <ListItem className="chat-message" sx={{ padding: '0', marginLeft: set.leftInset, marginRight: set.rightInset, display: "flex", flexDirection: "column", alignItems: message.role === "user" ? "flex-end" : "flex-start", gap: 1 }} >
		<Card sx={{ borderRadius: "16px", backgroundColor: set.background, borderColor: set.border }} variant="outlined">
			<Markdown>{message.content?.toString() ?? ""}</Markdown>
		</Card>
	</ListItem >;
}

export default function AIChatPage({ conversation, chatId }: { conversation?: ChatCompletionMessageParam[]; chatId?: string | null }) {
	const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
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
			setIsLoading(true);

			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ startMessage: input.trim() })
			});

			setIsLoading(false);

			if (!response.ok) {
				console.error("Failed to create conversation");
				return;
			}

			const data = await response.json() as { conversationId: string; conversation: ChatCompletionMessageParam[] };

			navigate(`/ai-chat/${data.conversationId}`, { replace: true });
		} else {
			setIsLoading(true);

			const response = await fetch(`/api/conversations/${chatId}/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ message: input.trim() })
			});

			setIsLoading(false);

			if (!response.ok) {
				console.error("Failed to send message");
				return;
			}

			const data = await response.json() as ChatCompletionMessageParam[];

			setMessages(data);
		}
	};

	console.log(isLoading);

	return (
		<CssVarsProvider theme={theme}>
			<Sheet sx={{ background: colors.primaryBackground }}>
				<List sx={{ gap: `${INSET / 2}px`, padding: `${INSET}px` }}>
					{messages.map((msg, idx) =>
						<ChatMessage message={msg} key={idx} />
					)}
					{isLoading && <CircularProgress />}
					<Textarea variant="outlined" minRows={1} sx={{ padding: "12px 0 12px 12px", borderRadius: "16px", backgroundColor: colors.assistantChatBackground, border: `1px solid ${colors.assistantChatBorder}`, color: "white", fontSize: "16px" }} maxRows={6} placeholder="Send a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { handleSend(e); } }} disabled={chatId === undefined && messages.length > 0} spellCheck={false} autoFocus={true}>
					</Textarea>
				</List>
			</Sheet>
		</CssVarsProvider>
		// <div className="app-wrapper">
		// 	<div className="phone-container">
		// 		<div className="ai-chat-header">
		// 			<button className="back-button" onClick={() => navigate("/dashboard")}>
		// 				← Back
		// 			</button>
		// 			<div className="theryn-label">
		// 				<img src={therynLogo} alt="Theryn Logo" className="theryn-logo" />
		// 				<h1>Theryn</h1>
		// 			</div>
		// 		</div>

		// 		<div className="chat-messages">
		// 			{messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
		// 		</div>

		// 		<form className="chat-input-form" onSubmit={handleSend}>
		// 			<input
		// 				type="text"
		// 				value={input}
		// 				onChange={(e) => setInput(e.target.value)}
		// 				placeholder="Send a message..."
		// 				className="chat-input"
		// 			/>
		// 			<button type="submit" className="send-button">→</button>
		// 		</form>
		// 	</div>
		// </div>
	);
}
