import React, { useState } from "react";
import { useNavigate } from "react-router";
import "~/index.scss";
import { trySignUp } from "~/local-data/session";
import "./signup-page.css";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [fullName, setFullName] = useState("");
	const [password, setPassword] = useState("");
	const [verifyPassword, setVerifyPassword] = useState("");
	const navigate = useNavigate();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== verifyPassword) {
			alert("Passwords do not match!");
			return;
		}

		try {
			const response = await trySignUp(fullName, email, password, username);

			navigate("/dashboard");
		} catch (error) {
			console.error("Signup error:", error);
			alert("An error occurred during signup. Please try again.");
			return;
		}
	};

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				<h1 className="signup-title">Sign Up</h1>
				<form className="signup-form" onSubmit={handleSignup}>
					<input
						type="text"
						placeholder="Full Name"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						className="signup-input"
						required
					/>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="signup-input"
						required
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="signup-input"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="signup-input"
						required
					/>
					<input
						type="password"
						placeholder="Verify Password"
						value={verifyPassword}
						onChange={(e) => setVerifyPassword(e.target.value)}
						className="signup-input"
						required
					/>
					<button type="submit" className="signup-button">
						Create Account
					</button>
				</form>
			</div>
		</div>
	);
}
