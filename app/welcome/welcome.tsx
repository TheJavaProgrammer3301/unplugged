import { Avatar, Box, Button, Grid, IconButton, List, ListItem, ListItemButton, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { ClickAwayListener, Popper } from '@mui/material';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import { playSound } from "~/audio";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import therynLogo from "./theryn-ai-logo.png";
import "./welcome.css";

const INSET = 32;

function AIButton({ accountInfo }: { accountInfo?: SanitizedUserData }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const [showPopup, setShowPopup] = useState(false);

	return <Box ref={containerRef} sx={{ position: "relative", marginTop: "auto" }}>
		<Button
			onClick={() => setShowPopup((v) => !v)}
			sx={{
				width: "100%",
				height: "70px",
				padding: "0 16px",
				borderRadius: "16px",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
				boxShadow: "0 6px 20px rgba(255, 65, 108, 0.7)",
				color: "white",
				fontWeight: "700",
				textTransform: "uppercase",
				letterSpacing: "0.05em",
				overflow: "hidden",
				fontSize: "1rem",
				'&:hover': {
					background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
					boxShadow: "0 8px 28px rgba(255, 75, 70, 0.9)",
					transform: "scale(1.05)"
				}
			}}
		>
			<Typography sx={{ color: "white", fontWeight: "700", textTransform: "uppercase" }}>
				AI Therapy
			</Typography>
			<Avatar
				src={therynLogo}
				sx={{
					height: "100%",
					maxHeight: "70px",
					width: "auto",
					aspectRatio: "2.25 / 1",
					borderRadius: 0,
					background: "none",
					filter: "drop-shadow(0 0 3px rgba(255, 65, 108, 0.8))"
				}}
			/>
		</Button>

		{showPopup && (
			<Popper
				open={showPopup}
				anchorEl={containerRef.current}
				placement="top-end"
				sx={{ zIndex: 1000 }}
			>
				<ClickAwayListener onClickAway={() => setShowPopup(false)}>
					<List
						role="menu"
						variant="outlined"
						sx={{
							padding: 0,
							borderWidth: 0
						}}
					>
						<ListItem role="none">
							<ListItemButton
								role="menuitem"
								onClick={() => navigate("/ai-chat")}
								sx={{
									backgroundColor: CURRENT_THEME.colors.userChatBackground,
									borderColor: CURRENT_THEME.colors.userChatBorder,
									color: "white",
									borderTopLeftRadius: "12px",
									borderTopRightRadius: "12px",
								}}
							>
								New Chat
							</ListItemButton>
						</ListItem>
						<ListItem role="none">
							<ListItemButton
								role="menuitem"
								onClick={() => navigate("/saved-chats")}
								sx={{
									backgroundColor: CURRENT_THEME.colors.userChatBackground,
									borderColor: CURRENT_THEME.colors.userChatBorder,
									color: "white",
									borderBottomLeftRadius: "12px",
									borderBottomRightRadius: "12px",
								}}
							>
								Saved Chats
							</ListItemButton>
						</ListItem>
					</List>
				</ClickAwayListener>
			</Popper>
		)}
	</Box>
}

function UserAvatar({ accountInfo }: { accountInfo?: SanitizedUserData }) {
	const navigate = useNavigate();
	const avatarRef = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);

	return <Box sx={{ position: "relative" }}>
		<IconButton
			ref={avatarRef}
			onClick={() => setOpen(v => !v)}
			sx={{
				padding: 0,
				backgroundColor: "transparent",
				borderRadius: "50%",
				'&:hover': {
					backgroundColor: "rgba(255, 255, 255, 0.05)"
				}
			}}
		>
			<Avatar
				sx={{
					width: "76px",
					height: "76px",
				}}
			/>
		</IconButton>
		<Popper
			open={open}
			anchorEl={avatarRef.current}
			placement="bottom-start"
			sx={{ zIndex: 1000 }}
		>
			<ClickAwayListener onClickAway={() => setOpen(false)}>
				<List
					role="menu"
					variant="outlined"
					sx={{
						padding: 0,
						borderWidth: 0
					}}
				>
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							onClick={() => navigate("/profile")}
							sx={{
								backgroundColor: CURRENT_THEME.colors.userChatBackground,
								borderColor: CURRENT_THEME.colors.userChatBorder,
								borderTopLeftRadius: "12px",
								borderTopRightRadius: "12px",
								color: "white"
							}}
						>
							Profile
						</ListItemButton>
					</ListItem>
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							onClick={() => navigate("/saved-quotes")}
							sx={{
								backgroundColor: CURRENT_THEME.colors.userChatBackground,
								borderColor: CURRENT_THEME.colors.userChatBorder,
								color: "white"
							}}
						>
							Saved Quotes
						</ListItemButton>
					</ListItem>
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							onClick={() => navigate("/badges")}
							sx={{
								backgroundColor: CURRENT_THEME.colors.userChatBackground,
								borderColor: CURRENT_THEME.colors.userChatBorder,
								color: "white"
							}}
						>
							Badges
						</ListItemButton>
					</ListItem>
					<ListItem role="none">
						<ListItemButton
							role="menuitem"
							onClick={() => navigate("/weekly-summary")} sx={{
								backgroundColor: CURRENT_THEME.colors.userChatBackground,
								borderColor: CURRENT_THEME.colors.userChatBorder,
								borderBottomLeftRadius: "12px",
								borderBottomRightRadius: "12px",
								color: "white"
							}}
						>
							Weekly Summary
						</ListItemButton>
					</ListItem>
				</List>
			</ClickAwayListener>
		</Popper>
	</Box>
}

export default function Dashboard({ accountInfo }: { accountInfo?: SanitizedUserData }) {
	const navigate = useNavigate();

	if (typeof window !== 'undefined') playSound("background");

	useEffect(() => {
		if (!accountInfo) navigate("/", { replace: true });
	}, [accountInfo]);

	if (!accountInfo) return <></>;

	// const [showPopup, setShowPopup] = useState(false);
	// // const [showDotsDropdown, setShowDotsDropdown] = useState(false);
	// const containerRef = useRef<HTMLDivElement>(null);
	// const dotDropdownRef = useRef<HTMLButtonElement>(null);

	return (
		<CssVarsProvider theme={CURRENT_JOY_THEME}>
			<Sheet
				id="root"
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					boxSizing: "border-box",
					background: CURRENT_THEME.colors.primaryBackground,
					padding: `${INSET}px`,
					gap: `${INSET / 2}px`
				}}
			>
				{/* Top Bar */}
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
					<UserAvatar accountInfo={accountInfo} />

					<Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "4px" }}>
						<Button
							onClick={() => navigate("/shop")}
							sx={{
								backgroundColor: "rgba(255, 255, 255, 0.07)",
								border: "1px solid rgba(255, 255, 255, 0.15)",
								borderRadius: '100px',
								fontSize: '16px',
							}}
						>
							💎 {accountInfo.diamonds}
						</Button>
						<Button
							onClick={() => navigate("/streak")}
							sx={{
								backgroundColor: "rgba(255, 255, 255, 0.07)",
								border: "1px solid rgba(255, 255, 255, 0.15)",
								borderRadius: '100px',
								fontSize: '16px',
							}}
						>
							🔥 {accountInfo.streak}
						</Button>
					</Box>
				</Box>

				<Typography
					level="h1"
					sx={{
						fontSize: "2.25rem",
						fontWeight: "700",
						color: "white",
						// color: "#e6e0ff",
						// textShadow: "0 1px 4px rgba(75, 0, 130, 0.8)",
						marginBottom: "8px"
					}}
				>
					Hello, {accountInfo.name}
				</Typography>

				<Grid container spacing={1} sx={{ marginBottom: "16px" }}>
					<Grid xs={6}>
						<Button
							onClick={() => navigate("/quote-bank")}
							sx={{
								width: "100%",
								background: "linear-gradient(135deg, #00c6ff, #0072ff)",
								padding: "16px",
								fontSize: "0.9rem",
								fontWeight: "600",
								borderRadius: "12px",
								boxShadow: "0 4px 14px rgba(0, 114, 255, 0.8)",
								color: "#e0f7ff",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
								minHeight: "80px",
								'&:hover': {
									background: "linear-gradient(135deg, #0072ff, #00c6ff)",
									boxShadow: "0 6px 20px rgba(0, 198, 255, 0.9)",
									color: "#fff",
									transform: "scale(1.05)"
								}
							}}
						>
							Quote Bank
						</Button>
					</Grid>
					<Grid xs={6}>
						<Button
							onClick={() => navigate("/journal")}
							sx={{
								width: "100%",
								background: "linear-gradient(135deg, #00c6ff, #0072ff)",
								padding: "16px",
								fontSize: "0.9rem",
								fontWeight: "600",
								borderRadius: "12px",
								boxShadow: "0 4px 14px rgba(0, 114, 255, 0.8)",
								color: "#e0f7ff",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
								minHeight: "80px",
								'&:hover': {
									background: "linear-gradient(135deg, #0072ff, #00c6ff)",
									boxShadow: "0 6px 20px rgba(0, 198, 255, 0.9)",
									color: "#fff",
									transform: "scale(1.05)"
								}
							}}
						>
							Journal
						</Button>
					</Grid>
					<Grid xs={6}>
						<Button
							onClick={() => navigate("/daily-routine")}
							sx={{
								width: "100%",
								background: "linear-gradient(135deg, #00c6ff, #0072ff)",
								padding: "16px",
								fontSize: "0.9rem",
								fontWeight: "600",
								borderRadius: "12px",
								boxShadow: "0 4px 14px rgba(0, 114, 255, 0.8)",
								color: "#e0f7ff",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
								minHeight: "80px",
								'&:hover': {
									background: "linear-gradient(135deg, #0072ff, #00c6ff)",
									boxShadow: "0 6px 20px rgba(0, 198, 255, 0.9)",
									color: "#fff",
									transform: "scale(1.05)"
								}
							}}
						>
							Daily Routine
						</Button>
					</Grid>
					<Grid xs={6}>
						<Button
							onClick={() => navigate("/mind-bank")}
							sx={{
								width: "100%",
								background: "linear-gradient(135deg, #00c6ff, #0072ff)",
								padding: "16px",
								fontSize: "0.9rem",
								fontWeight: "600",
								borderRadius: "12px",
								boxShadow: "0 4px 14px rgba(0, 114, 255, 0.8)",
								color: "#e0f7ff",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
								minHeight: "80px",
								'&:hover': {
									background: "linear-gradient(135deg, #0072ff, #00c6ff)",
									boxShadow: "0 6px 20px rgba(0, 198, 255, 0.9)",
									color: "#fff",
									transform: "scale(1.05)"
								}
							}}
						>
							Mind Bank
						</Button>
					</Grid>
				</Grid>

				<AIButton accountInfo={accountInfo} />
			</Sheet>
		</CssVarsProvider>
	);
}
