import { Alert, Box, Button, FormControl, FormLabel, Input, Radio, RadioGroup, Sheet, Stack, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { tryLogIn } from "~/local-data/session";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./login-page.css";

const INSET = 32;

function FieldLabel({ label }: { label: string }) {
	return <FormLabel sx={{ color: "white", fontWeight: "600" }}>{label}</FormLabel>;
}

export default function LoginPage() {
	const [loginType, setLoginType] = useState<"email" | "username">("username");
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await tryLogIn(identifier, password, loginType);
			navigate("/dashboard");
		} catch (error) {
			console.error("Login failed:", error);
			setError(`Invalid ${loginType} or password. Please try again.`);
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
						Log In
					</Typography>

					<Stack
						component="form"
						onSubmit={handleLogin}
						spacing={2}
						sx={{ width: "100%" }}
					>
						<FormControl>
							<FieldLabel label="Login with" />
							<RadioGroup
								orientation="horizontal"
								value={loginType}
								onChange={(event) => {
									setLoginType(event.target.value as "email" | "username");
									setIdentifier(""); // Clear the input when switching types
								}}
								sx={{
									gap: 2,
									'& .MuiRadio-root': {
										color: "white"
									},
									'& .MuiFormLabel-root': {
										color: "white"
									}
								}}
							>
								<Radio variant="solid" value="username" label="Username" />
								<Radio variant="solid" value="email" label="Email" />
							</RadioGroup>
						</FormControl>

						<FormControl>
							<FieldLabel label={loginType === "email" ? "Email" : "Username"} />
							<Input
								type={loginType === "email" ? "email" : "text"}
								placeholder={`Enter your ${loginType}`}
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								required
								sx={{
									backgroundColor: CURRENT_THEME.colors.primaryBackground,
									borderColor: "rgba(255, 255, 255, 0.3)",
									color: "white"
								}}
							/>
						</FormControl>

						<FormControl>
							<FieldLabel label="Password" />
							<Input
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								sx={{
									backgroundColor: CURRENT_THEME.colors.primaryBackground,
									borderColor: "rgba(255, 255, 255, 0.3)",
									color: "white"
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
							size="lg"
						>
							Log In
						</Button>
					</Stack>
				</Box>
			</Sheet>
		</CssVarsProvider>
	);
}
