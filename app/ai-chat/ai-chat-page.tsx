import { ArrowBack, Send } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CircularProgress, Divider, List, ListItem, Sheet, Textarea, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import type { ChatCompletionMessageParam } from "openai/resources";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./ai-chat-page.css";
import therynLogo from "./theryn.png";

const INSET = 32;

const colorsets = {
	user: {
		background: CURRENT_THEME.colors.userChatBackground,
		border: CURRENT_THEME.colors.userChatBorder,
		color: "white",
		leftInset: `${INSET}px`,
		rightInset: "0px"
	},
	assistant: {
		background: CURRENT_THEME.colors.assistantChatBackground,
		border: CURRENT_THEME.colors.assistantChatBorder,
		color: "white",
		leftInset: "0px",
		rightInset: `${INSET}px`
	}
}

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
		let audioFileName: string = soundName;
		if (soundName === 'happy') {
			// 1/1000 chance to play "sayonara.mp3" instead of "happy.mp3"
			if (Math.random() < 0.001) {
				audioFileName = 'sayonara';
			}
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
			}
		}
		currentAudio = new Audio(`/${audioFileName}.mp3`);
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
		<CssVarsProvider theme={CURRENT_JOY_THEME}>
			<Sheet id="root" sx={{ height: "100vh", display: "flex", flexDirection: "column", boxSizing: "border-box", background: CURRENT_THEME.colors.primaryBackground, padding: `${INSET}px`, gap: `${INSET / 2}px` }}>
				<Box sx={{ all: 'unset', display: "flex" }}>
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
					<Typography level="h2" component="h1" sx={{ marginLeft: "16px", color: "white", fontWeight: "bold", textAlign: "center" }}>Theryn</Typography>
				</Box>
				<Divider />
				<List id="chat-messages" sx={{ padding: 0, flexGrow: "1", gap: `${INSET / 2}px`, overflowY: "auto", scrollbarGutter: "stable", scrollBehavior: "smooth" }}>
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
							backgroundColor: CURRENT_THEME.colors.assistantChatBackground,
							border: `1px solid ${CURRENT_THEME.colors.assistantChatBorder}`,
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
							backgroundColor: CURRENT_THEME.colors.assistantChatBackground,
							border: `1px solid ${CURRENT_THEME.colors.assistantChatBorder}`,
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
