import { ArrowBack, Send } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CircularProgress, Divider, List, ListItem, Sheet, Textarea, Typography } from "@mui/joy";
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import type { ChatCompletionMessageParam } from "openai/resources";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router";
import "~/mui.scss";
import "./ai-chat-page.css";
import therynLogo from "./theryn.png";

const INSET = 32;

// const colors = {
// 	//rgb(32, 116, 223)
// 	primaryBackground: "rgb(0, 17, 44)",
// 	userChatBackground: "rgb(24, 87, 168)",
// 	userChatBorder: "rgb(44, 107, 188)",
// 	assistantChatBackground: "rgb(30, 30, 30)",
// 	assistantChatBorder: "rgb(50, 50, 50)",
// }

const colors = {
	//rgb(32, 116, 223)
	primaryBackground: "linear-gradient(145deg,#1a1a40,indigo,#6a00ff)",
	userChatBackground: "rgb(106, 0, 255)",
	userChatBorder: "rgb(126, 20, 255)",
	assistantChatBackground: "rgba(255, 255, 255, 0.1)",
	assistantChatBorder: "rgba(255, 255, 255, 0.2)",
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
					solidBg: colors.assistantChatBorder,
					solidDisabledBg: colors.assistantChatBackground,
					outlinedColor: "rgb(255, 255, 255)",
					outlinedBorder: colors.assistantChatBorder,
				}
			},
		},
	},
});

// Then, pass it to `<CssVarsProvider theme={theme}>`.

// Sound command configuration
const SOUND_COMMANDS = ['entertainer', 'superstar', 'sneaky', 'calming', 'fiend', 'uplifting', 'happy'] as const;
type SoundCommand = typeof SOUND_COMMANDS[number];

// Shared audio context and current playing state
let currentAudioContext: AudioContext | null = null;
let currentOscillator: OscillatorNode | null = null;
let currentAudio: HTMLAudioElement | null = null;

function ChatMessage({ message, isNewMessage }: { message: ChatCompletionMessageParam; isNewMessage?: boolean }) {
	const set = message.role === "user" ? colorsets.user : colorsets.assistant;
	const messageContent = message.content?.toString() ?? "";

	// Function to play a specific sound (limited to one at a time)
	const playSound = (soundName: SoundCommand) => {
		currentAudio?.pause();

		// Stop any currently playing sound
		if (currentOscillator) {
			try {
				currentOscillator.stop();
			} catch (e) {
				// Oscillator might already be stopped
			}
			currentOscillator = null;
		}
		
		// Try to play audio file first
		currentAudio = new Audio(`/${soundName}.mp3`);
		currentAudio.play().catch(() => {
			// Fallback: create different sounds based on command
			try {
				if (!currentAudioContext) {
					currentAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				}
				
				const oscillator = currentAudioContext.createOscillator();
				const gainNode = currentAudioContext.createGain();
				
				oscillator.connect(gainNode);
				gainNode.connect(currentAudioContext.destination);
				
				// Different frequencies for different sounds
				const frequency = 600;
				oscillator.frequency.setValueAtTime(frequency, currentAudioContext.currentTime);
				gainNode.gain.setValueAtTime(0.1, currentAudioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, currentAudioContext.currentTime + 0.3);
				
				oscillator.start(currentAudioContext.currentTime);
				oscillator.stop(currentAudioContext.currentTime + 0.3);
				
				currentOscillator = oscillator;
				
				// Clear reference when sound ends
				oscillator.onended = () => {
					currentOscillator = null;
				};
			} catch (error) {
				console.warn(`Could not play ${soundName} sound:`, error);
			}
		});
	};

	// Function to detect and extract sound commands from message
	const detectSoundCommands = (content: string): SoundCommand[] => {
		const foundCommands: SoundCommand[] = [];
		
		SOUND_COMMANDS.forEach(soundName => {
			const pattern = new RegExp(`!playSound\\s+${soundName}`, 'gi');
			if (pattern.test(content)) {
				foundCommands.push(soundName);
			}
		});
		
		return foundCommands;
	};

	// Function to remove sound commands from message
	const removeSoundCommands = (content: string): string => {
		let cleanedContent = content;
		
		SOUND_COMMANDS.forEach(soundName => {
			const pattern = new RegExp(`!playSound\\s+${soundName}`, 'gi');
			cleanedContent = cleanedContent.replace(pattern, '`<used a command>`');
		});
		
		return cleanedContent.trim();
	};
	
	// Check if this is a new AI message containing sound commands
	useEffect(() => {
		if (isNewMessage && message.role === "assistant") {
			const soundCommands = detectSoundCommands(messageContent);
			// Play the first sound command found (to maintain one sound at a time)
			if (soundCommands.length > 0) {
				playSound(soundCommands[0]);
			}
		}
	}, [isNewMessage, message.role, messageContent]);

	// Remove sound commands from displayed message
	const displayContent = message.role === "assistant" ? removeSoundCommands(messageContent) : messageContent;

	return <ListItem className="chat-message" sx={{ padding: '0', marginLeft: set.leftInset, marginRight: set.rightInset, display: "flex", flexDirection: "column", alignItems: message.role === "user" ? "flex-end" : "flex-start", gap: 1 }} >
		<Card sx={{ borderRadius: "16px", backgroundColor: set.background, borderColor: set.border }} variant="outlined">
			<Markdown>{displayContent}</Markdown>
		</Card>
	</ListItem >;
}

export default function AIChatPage({ conversation, chatId }: { conversation?: ChatCompletionMessageParam[]; chatId?: string | null }) {
	const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [previousMessageCount, setPreviousMessageCount] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		const newMessages = conversation ?? [];
		setMessages(newMessages);
		setPreviousMessageCount(newMessages.length);
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

			setPreviousMessageCount(data.conversation.length);
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

			const newMessageCount = data.length;
			setMessages(data);
			setPreviousMessageCount(newMessageCount - 1);
		}
	};

	return (
		<CssVarsProvider theme={theme}>
			<Sheet id="root" sx={{ height: "100vh", display: "flex", flexDirection: "column", boxSizing: "border-box", background: colors.primaryBackground, padding: `${INSET}px`, gap: `${INSET / 2}px` }}>
				<Box sx={{ all: 'unset', display: "flex", gap: "16px" }}>
					<Button
						color='danger'
						sx={{ padding: "6px 12px", gap: "8px", color: "white" }}
						onClick={() => navigate("/dashboard", { replace: true })}
					>
						<ArrowBack />
						<Typography sx={{ color: "white" }}>Back</Typography>
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Avatar src={therynLogo} />
					<Typography level="h2" component="h1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Theryn</Typography>
				</Box>
				<Divider />
				<List sx={{ padding: 0, flexGrow: "1", gap: `${INSET / 2}px`, overflowY: "auto", scrollbarGutter: "stable", scrollBehavior: "smooth" }}>
					{messages.map((msg, idx) =>
						<ChatMessage 
							message={msg} 
							key={idx} 
							isNewMessage={idx >= previousMessageCount} 
						/>
					)}
					{isLoading && <CircularProgress variant='outlined' />}
				</List>
				<Divider />
				<Box sx={{ all: 'unset', display: "flex", gap: "16px" }}>
					<Textarea
						variant="outlined"
						minRows={1}
						sx={{
							flexGrow: "1",
							padding: "12px 0 12px 20px",
							borderRadius: "25px",
							backgroundColor: colors.assistantChatBackground,
							border: `1px solid ${colors.assistantChatBorder}`,
							color: "white", fontSize: "16px"
						}}
						maxRows={6}
						placeholder="Send a message..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { handleSend(e); } }}
						disabled={isLoading}
						spellCheck={false}
						autoFocus={true}
					/>
					<Button
						sx={{
							borderRadius: "25px",
							backgroundColor: colors.assistantChatBackground,
							border: `1px solid ${colors.assistantChatBorder}`,
							width: "50px",
							height: "50px"
						}}
						disabled={isLoading || !input.trim()}
						onClick={handleSend}
					><Send /></Button>
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
