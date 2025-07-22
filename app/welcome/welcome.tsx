import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import { playSound } from "~/audio";
import "~/index.scss";
import therynLogo from "./theryn-ai-logo.png";
import "./welcome.css";

export default function Dashboard({ accountInfo }: { accountInfo?: SanitizedUserData }) {
	const navigate = useNavigate();
	
	if (typeof window !== 'undefined') playSound("background");

	// console.log(window);

	useEffect(() => {
		if (!accountInfo) navigate("/", { replace: true });
	}, [accountInfo]);

	if (!accountInfo) return <></>;

	const [showPopup, setShowPopup] = useState(false);
	const [showDotsDropdown, setShowDotsDropdown] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const dotDropdownRef = useRef<HTMLDivElement>(null);

	// Close popups on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current && !containerRef.current.contains(event.target as Node)
			) {
				setShowPopup(false);
			}
			if (
				dotDropdownRef.current && !dotDropdownRef.current.contains(event.target as Node)
			) {
				setShowDotsDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				{/* Top Bar */}
				<div className="top-bar">
					<div className="dot-dropdown-wrapper" ref={dotDropdownRef}>
						<button className="dot-group" onClick={() => setShowDotsDropdown(v => !v)}>
							<div className="dot"></div>
							<div className="dot"></div>
							<div className="dot"></div>
						</button>
						{showDotsDropdown && (
							<div className="dots-dropdown">
								<button onClick={() => navigate("/profile")} className="dropdown-button">Profile</button>
								<button onClick={() => navigate("/saved-quotes")} className="dropdown-button">Saved Quotes</button>
								<button onClick={() => navigate("/badges")} className="dropdown-button">Badges</button>
								<button onClick={() => navigate("/weekly-summary")} className="summary-button">Weekly Summary</button>
							</div>
						)}
					</div>

					<div className="stats">
						<button className="stat-box" onClick={() => navigate("/shop")}>💰 {accountInfo.coins} 💎 {accountInfo.diamonds}</button><br></br>
						<button className="stat-box" onClick={() => navigate("/streak")}>🔥 {accountInfo.streak}</button>
					</div>
				</div>

				<h1 className="greeting">Hello, {accountInfo.name}</h1>

				<div className="button-grid">
					<button className="feature-button" onClick={() => navigate("/quote-bank")}>Quote Bank</button>
					<button className="feature-button" onClick={() => navigate("/journal")}>Journal</button>
					<button className="feature-button" onClick={() => navigate("/daily-routine")}>Daily Routine</button>
					<button className="feature-button" onClick={() => navigate("/mind-bank")}>Mind Bank</button>
				</div>

				<div ref={containerRef} style={{ position: "relative", marginTop: "auto" }}>
					<button className="ai-therapy" type="button" onClick={() => setShowPopup((v) => !v)}>
						<span>AI Therapy</span>
						<img src={therynLogo} alt="Theryn AI Logo" />
					</button>

					{showPopup && (
						<div className="ai-popup">
							<button onClick={() => navigate("/ai-chat")}>New Chat</button>
							<button onClick={() => navigate("/saved-chats")}>Saved Chats</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
