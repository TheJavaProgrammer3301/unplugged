import { ArrowBack, Edit, PhotoCamera, Save } from '@mui/icons-material';
import { Avatar, Box, Button, Card, Divider, Input, Sheet, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./profile-page.css";

const INSET = 32;

function ProfileField({
	label,
	value,
	editing,
	fieldKey,
	tempAccountInfo,
	setTempAccountInfo
}: {
	label: string;
	value: string;
	editing: boolean;
	fieldKey?: keyof SanitizedUserData;
	tempAccountInfo?: SanitizedUserData;
	setTempAccountInfo?: (info: SanitizedUserData) => void;
}) {
	const handleChange = (newValue: string) => {
		if (fieldKey && tempAccountInfo && setTempAccountInfo) {
			setTempAccountInfo({
				...tempAccountInfo,
				[fieldKey]: newValue
			});
		}
	};

	return (
		<Box sx={{ all: 'unset', fontSize: "16px", display: "flex", flexDirection: "row", gap: "8px", minHeight: "36px", alignItems: "center" }}>
			<Typography sx={{ color: "white" }} level="body-sm"><strong>{label}:</strong></Typography>
			{editing && fieldKey ? (
				<Input
					sx={{
						backgroundColor: CURRENT_THEME.colors.primaryBackground,
						borderColor: CURRENT_THEME.colors.primaryBackground,
						color: "white",
						flexGrow: 1
					}}
					value={tempAccountInfo?.[fieldKey] as string || value}
					onChange={(e) => handleChange(e.target.value)}
				/>
			) : value}
		</Box>
	);
}

function ProfileCard({ accountInfo, editing, tempAccountInfo, setTempAccountInfo }: { accountInfo: SanitizedUserData, editing: boolean, tempAccountInfo: SanitizedUserData, setTempAccountInfo: (info: SanitizedUserData) => void }) {
	return (
		<Card
			variant="outlined"
			sx={{
				backgroundColor: "rgba(255, 255, 255, 0.08)",
				borderColor: "rgba(255, 255, 255, 0.1)",
				color: "white",
				marginBottom: 3
			}}
		>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
				<ProfileField
					label="Name"
					value={accountInfo.name}
					editing={editing}
					fieldKey="name"
					tempAccountInfo={tempAccountInfo}
					setTempAccountInfo={setTempAccountInfo}
				/>
				<ProfileField
					label="Username"
					value={`@${accountInfo.username}`}
					editing={editing}
					fieldKey="username"
					tempAccountInfo={tempAccountInfo}
					setTempAccountInfo={setTempAccountInfo}
				/>
				<ProfileField
					label="Email"
					value={accountInfo.email}
					editing={editing}
					fieldKey="email"
					tempAccountInfo={tempAccountInfo}
					setTempAccountInfo={setTempAccountInfo}
				/>
				<ProfileField
					label="Joined"
					value={new Date(accountInfo.createdAt).toLocaleDateString()}
					editing={false}
				/>
				<ProfileField
					label="Bio"
					value={accountInfo.bio}
					editing={editing}
					fieldKey="bio"
					tempAccountInfo={tempAccountInfo}
					setTempAccountInfo={setTempAccountInfo}
				/>
				{/* <Typography level="body-sm">
					<strong>Name:</strong> {accountInfo.name}
				</Typography>
				<Typography level="body-sm">
					<strong>Username:</strong> @{accountInfo.username}
				</Typography>
				<Typography level="body-sm">
					<strong>Email:</strong> {accountInfo.email}
				</Typography>
				<Typography level="body-sm">
					<strong>Joined:</strong> {new Date(accountInfo.createdAt).toLocaleDateString()}
				</Typography>
				<Typography level="body-sm">
					<strong>Bio:</strong> {accountInfo.bio}
				</Typography> */}
			</Box>
		</Card>
	);
}

export default function ProfilePage({ accountInfo }: { accountInfo: SanitizedUserData }) {
	const [editing, setEditing] = useState(false);
	const [tempAccountInfo, setTempAccountInfo] = useState<SanitizedUserData>(accountInfo);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!accountInfo) navigate("/", { replace: true });
	}, [accountInfo]);

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	if (!accountInfo) return <></>;

	const uploadChanges = async () => {
		// TODO: Implement API call to update user profile
		console.log('Uploading changes:', tempAccountInfo);
		const response = await fetch("/api/account", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(tempAccountInfo)
		});
		if (avatarFile) {
			console.log('Uploading avatar:', avatarFile);
			// TODO: Upload avatar file to server
		}
		setEditing(false);
	};

	const handleCancel = () => {
		setTempAccountInfo(accountInfo);
		setAvatarFile(null);
		setAvatarPreview(null);
		setEditing(false);
	};

	return (
		<CssVarsProvider theme={CURRENT_JOY_THEME}>
			<Sheet
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					boxSizing: "border-box",
					background: CURRENT_THEME.colors.primaryBackground,
					padding: `${INSET}px`,
					gap: `${INSET / 2}px`
				}}
				id="root"
			>
				<Box sx={{ all: 'unset', display: "flex", alignItems: "center" }}>
					<Button
						color='danger'
						sx={{ padding: "6px 12px", gap: "8px", color: "white" }}
						onClick={() => navigate("/dashboard", { replace: true })}
					>
						<ArrowBack />
						<Typography sx={{ color: "white" }}>Back</Typography>
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Typography level="h2" component="h1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Your Profile</Typography>
				</Box>
				<Divider />
				<Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2, position: "relative" }}>
					<Avatar
						size="lg"
						src={avatarPreview || undefined}
						sx={{
							width: "80px",
							height: "80px",
							border: "2px solid white"
						}}
					/>
					{editing && (
						<>
							<input
								accept="image/*"
								style={{ display: 'none' }}
								id="avatar-upload"
								type="file"
								onChange={handleAvatarChange}
							/>
							<label htmlFor="avatar-upload">
								<Button
									component="span"
									size="sm"
									sx={{
										position: "absolute",
										bottom: -5,
										right: "calc(50% - 50px)",
										minHeight: "32px",
										minWidth: "32px",
										borderRadius: "50%",
										backgroundColor: "rgba(106, 0, 255, 0.9)",
										'&:hover': {
											backgroundColor: "rgba(106, 0, 255, 1)"
										}
									}}
								>
									<PhotoCamera sx={{ fontSize: "16px" }} />
								</Button>
							</label>
						</>
					)}
				</Box>
				<ProfileCard accountInfo={accountInfo} editing={editing} tempAccountInfo={tempAccountInfo} setTempAccountInfo={setTempAccountInfo} />

				<Button
					variant="solid"
					size="lg"
					startDecorator={editing ? <Save /> : <Edit />}
					sx={{
						background: "linear-gradient(135deg, #6a00ff, #b900b4)",
						borderRadius: "12px",
						fontWeight: "bold",
						color: "white",
						'&:hover': {
							background: "linear-gradient(135deg, #7c1aff, #d600c0)"
						}
					}}
					onClick={() => {
						if (editing) {
							uploadChanges();
						} else {
							setEditing(true);
						}
					}}
				>
					{editing ? "Save changes" : "Edit profile"}
				</Button>
				{editing && <Button
					variant="solid"
					size="lg"
					color='danger'
					onClick={handleCancel}
				>
					Cancel
				</Button>}

				{!editing && (
					<Button
						variant="outlined"
						size="lg"
						color='danger'
						sx={{
							marginTop: 2,
							borderColor: "rgba(255, 255, 255, 0.3)",
							color: "rgba(255, 255, 255, 0.7)",
							'&:hover': {
								borderColor: "#ff4444",
								color: "#ff4444"
							}
						}}
						onClick={() => {
							if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
								// TODO: Implement account deletion
								console.log("Delete account requested");
							}
						}}
					>
						Delete Account
					</Button>
				)}
			</Sheet>
		</CssVarsProvider>
	);
}
