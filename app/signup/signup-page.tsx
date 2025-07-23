import { InfoOutlined, Key } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, FormHelperText, FormLabel, Input, LinearProgress, Sheet, Stack, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { trySignUp } from "~/local-data/session";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./signup-page.css";

const INSET = 32;

function FieldLabel({ label }: { label: string }) {
	return <FormLabel sx={{ color: "white", fontWeight: "600" }}>{label}</FormLabel>;
}

function PasswordInput({ value, setValue }: { value: string; setValue: (value: string) => void }) {
	const minLength = 12;

	return <FormControl>
		<FieldLabel label="Password" />
		<Stack spacing={0.5} sx={{ '--hue': Math.min(value.length * 10, 120) }}>
			<Input
				type="password"
				placeholder="Type in here…"
				startDecorator={<Key />}
				value={value}
				onChange={(event) => setValue(event.target.value)}
				required
				sx={{
					backgroundColor: CURRENT_THEME.colors.primaryBackground,
					borderColor: "rgba(255, 255, 255, 0.3)",
					color: "white"
				}}
			/>
			<LinearProgress
				determinate
				size="sm"
				value={Math.min((value.length * 100) / minLength, 100)}
				sx={{ bgcolor: 'background.level3', color: 'hsl(var(--hue) 80% 40%)' }}
			/>
			<Typography
				level="body-xs"
				sx={{ alignSelf: 'flex-end', color: 'hsl(var(--hue) 80% 30%)' }}
			>
				{value.length < 3 && 'Very weak'}
				{value.length >= 3 && value.length < 6 && 'Weak'}
				{value.length >= 6 && value.length < 10 && 'Strong'}
				{value.length >= 10 && 'Very strong'}
			</Typography>
		</Stack>
	</FormControl>;
}

function VerifyPasswordInput({ password, value, setValue }: { password: string; value: string; setValue: (value: string) => void }) {
	return <FormControl
		error={password !== value}
		sx={{
			marginTop: "0 !important"
		}}
	>
		<FieldLabel label="Verify Password" />
		<Input
			type="password"
			placeholder="Verify your password"
			value={value}
			onChange={(event) => setValue(event.target.value)}
			required
			sx={{
				backgroundColor: CURRENT_THEME.colors.primaryBackground,
				borderColor: "rgba(255, 255, 255, 0.3)",
				color: "white"
			}}
		/>
		{password !== value && <FormHelperText>
			<InfoOutlined />
			Passwords do not match!
		</FormHelperText>}
	</FormControl>;
}

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
							color: "white",
							fontSize: "1.8rem",
							fontWeight: "700",
							marginBottom: "32px",
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
							<FieldLabel label="Full Name" />
							<Input
								type="text"
								placeholder="Enter your full name"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
								sx={{
									backgroundColor: CURRENT_THEME.colors.primaryBackground,
									borderColor: "rgba(255, 255, 255, 0.3)",
									color: "white"
								}}
							/>
						</FormControl>

						<FormControl>
							<FieldLabel label="Username" />
							<Input
								type="text"
								placeholder="Choose a username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								sx={{
									backgroundColor: CURRENT_THEME.colors.primaryBackground,
									borderColor: "rgba(255, 255, 255, 0.3)",
									color: "white"
								}}
							/>
						</FormControl>

						<FormControl>
							<FieldLabel label="Email" />
							<Input
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								sx={{
									backgroundColor: CURRENT_THEME.colors.primaryBackground,
									borderColor: "rgba(255, 255, 255, 0.3)",
									color: "white"
								}}
							/>
						</FormControl>
						
						<PasswordInput value={password} setValue={setPassword} />
						<VerifyPasswordInput password={password} value={verifyPassword} setValue={setVerifyPassword} />

						{error && (
							<Alert color="danger" sx={{ backgroundColor: "rgba(255, 0, 0, 0.1)", color: "#ffcccc" }}>
								{error}
							</Alert>
						)}

						<Button
							type="submit"
							size="lg"
						>
							Create Account
						</Button>
					</Stack>
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
