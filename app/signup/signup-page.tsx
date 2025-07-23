import { Alert, Box, Button, FormControl, FormLabel, Input, Sheet, Stack, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { trySignUp } from "~/local-data/session";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./signup-page.css";

const INSET = 32;

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [fullName, setFullName] = useState("");
	const [password, setPassword] = useState("");
	const [verifyPassword, setVerifyPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== verifyPassword) {
			setError("Passwords do not match!");
			return;
		}

		try {
			const response = await trySignUp(fullName, email, password, username);
			navigate("/dashboard");
		} catch (error) {
			console.error("Signup error:", error);
			setError("An error occurred during signup. Please try again.");
			return;
		}
	};

	return (
		<CssVarsProvider theme={CURRENT_JOY_THEME}>
			<Sheet
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					boxSizing: "border-box",
					background: CURRENT_THEME.colors.primaryBackground,
					padding: `${INSET}px`
				}}
				id="root"
			>
				<Box
					sx={{
						width: "100%",
						maxWidth: "400px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center"
					}}
				>
					<Typography 
						level="h1" 
						sx={{ 
							fontSize: "1.8rem", 
							fontWeight: "700", 
							marginBottom: "32px", 
							color: "#e6e0ff", 
							textShadow: "0 1px 4px rgba(75, 0, 130, 0.8)" 
						}}
					>
						Sign Up
					</Typography>

					<Stack
						component="form"
						onSubmit={handleSignup}
						spacing={2}
						sx={{ width: "100%" }}
					>
						<FormControl>
							<FormLabel sx={{ color: "#b3a1ff", fontWeight: "600" }}>Full Name</FormLabel>
							<Input
								type="text"
								placeholder="Enter your full name"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
								sx={{
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									border: "none",
									borderRadius: "12px",
									padding: "12px 16px",
									fontSize: "1rem",
									color: "#e0e0ff",
									boxShadow: "0 2px 8px rgba(255, 255, 255, 0.15)",
									'&::placeholder': {
										color: "#b3a1ff"
									},
									'&:focus-within': {
										boxShadow: "0 0 0 2px rgba(0, 198, 255, 0.5)"
									}
								}}
							/>
						</FormControl>

						<FormControl>
							<FormLabel sx={{ color: "#b3a1ff", fontWeight: "600" }}>Username</FormLabel>
							<Input
								type="text"
								placeholder="Choose a username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								sx={{
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									border: "none",
									borderRadius: "12px",
									padding: "12px 16px",
									fontSize: "1rem",
									color: "#e0e0ff",
									boxShadow: "0 2px 8px rgba(255, 255, 255, 0.15)",
									'&::placeholder': {
										color: "#b3a1ff"
									},
									'&:focus-within': {
										boxShadow: "0 0 0 2px rgba(0, 198, 255, 0.5)"
									}
								}}
							/>
						</FormControl>

						<FormControl>
							<FormLabel sx={{ color: "#b3a1ff", fontWeight: "600" }}>Email</FormLabel>
							<Input
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								sx={{
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									border: "none",
									borderRadius: "12px",
									padding: "12px 16px",
									fontSize: "1rem",
									color: "#e0e0ff",
									boxShadow: "0 2px 8px rgba(255, 255, 255, 0.15)",
									'&::placeholder': {
										color: "#b3a1ff"
									},
									'&:focus-within': {
										boxShadow: "0 0 0 2px rgba(0, 198, 255, 0.5)"
									}
								}}
							/>
						</FormControl>

						<FormControl>
							<FormLabel sx={{ color: "#b3a1ff", fontWeight: "600" }}>Password</FormLabel>
							<Input
								type="password"
								placeholder="Create a password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								sx={{
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									border: "none",
									borderRadius: "12px",
									padding: "12px 16px",
									fontSize: "1rem",
									color: "#e0e0ff",
									boxShadow: "0 2px 8px rgba(255, 255, 255, 0.15)",
									'&::placeholder': {
										color: "#b3a1ff"
									},
									'&:focus-within': {
										boxShadow: "0 0 0 2px rgba(0, 198, 255, 0.5)"
									}
								}}
							/>
						</FormControl>

						<FormControl>
							<FormLabel sx={{ color: "#b3a1ff", fontWeight: "600" }}>Verify Password</FormLabel>
							<Input
								type="password"
								placeholder="Confirm your password"
								value={verifyPassword}
								onChange={(e) => setVerifyPassword(e.target.value)}
								required
								sx={{
									backgroundColor: "rgba(255, 255, 255, 0.1)",
									border: "none",
									borderRadius: "12px",
									padding: "12px 16px",
									fontSize: "1rem",
									color: "#e0e0ff",
									boxShadow: "0 2px 8px rgba(255, 255, 255, 0.15)",
									'&::placeholder': {
										color: "#b3a1ff"
									},
									'&:focus-within': {
										boxShadow: "0 0 0 2px rgba(0, 198, 255, 0.5)"
									}
								}}
							/>
						</FormControl>

						{error && (
							<Alert color="danger" sx={{ backgroundColor: "rgba(255, 0, 0, 0.1)", color: "#ffcccc" }}>
								{error}
							</Alert>
						)}

						<Button
							type="submit"
							sx={{
								background: "linear-gradient(135deg, #00c6ff, #0072ff)",
								color: "#e0f7ff",
								fontWeight: "700",
								padding: "12px 16px",
								borderRadius: "12px",
								fontSize: "1rem",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								boxShadow: "0 4px 14px rgba(0, 114, 255, 0.8)",
								marginTop: "8px",
								'&:hover': {
									background: "linear-gradient(135deg, #0072ff, #00c6ff)",
									transform: "scale(1.05)",
									boxShadow: "0 6px 20px rgba(0, 198, 255, 0.9)"
								}
							}}
						>
							Create Account
						</Button>
					</Stack>
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
