import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import "~/index.scss";
import "./profile-page.css";

export default function ProfilePage({ accountInfo }: { accountInfo: SanitizedUserData }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (!accountInfo) navigate("/login", { replace: true });
	}, [accountInfo]);

	if (!accountInfo) return <></>;

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				<div className="profile-header">
					<div className="back-button-container">
						<button className="back-button" onClick={() => navigate("/dashboard")}>
							← Back
						</button>
					</div>
					<h2 className="profile-title">Your Profile</h2>
				</div>

				<div className="profile-avatar">
					<img
						src="/images/avatar-placeholder.png"
						alt="User Avatar"
						className="avatar-img"
					/>
				</div>

				<div className="profile-info">
					<p><strong>Name:</strong> {accountInfo.name}</p>
					<p><strong>Username:</strong> @{accountInfo.name}</p>
					<p><strong>Email:</strong> {accountInfo.email}</p>
					<p><strong>Joined:</strong> {accountInfo.email}</p>
					<p><strong>Bio:</strong> {accountInfo.email}</p>
				</div>

				<button className="edit-profile-button">Edit Profile</button>
			</div>
		</div>
	);
}
