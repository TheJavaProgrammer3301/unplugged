import React, { useState } from "react";
import { useNavigate } from "react-router";
import { tryLogIn } from "~/local-data/session";
import "./login-page.css";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await tryLogIn(email, password);
			navigate("/dashboard");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="app-wrapper">
			<div className="phone-container login-container">
				<h1 className="login-title">Log In</h1>
				<form className="login-form" onSubmit={handleLogin}>
					<input
						type="text"
						placeholder="Username"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="login-input"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="login-input"
						required
					/>
					<button type="submit" className="login-button">
						Log In
					</button>
				</form>
			</div>
		</div>
	);
}
