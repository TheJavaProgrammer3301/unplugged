import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "./landing-page.css";

export default function LandingPage({ accountInfo }: { accountInfo: SanitizedUserData | null }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (accountInfo) navigate("/dashboard", { replace: true });
	}, [accountInfo]);

	if (accountInfo) return <></>;

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				<h1 className="login-title">Welcome to<br />UNPLUGGED</h1>
				<div className="login-buttons">
					<button className="login-button" onClick={() => { window.location.href = "/login"; }}>Log In</button>
					<button className="signup-button">Sign Up</button>
				</div>
			</div>
		</div>
	);
}
