import { useNavigate } from "react-router";
import "~/mui/index.scss";
import "./saved-chats-page.css";

// function SavedChatCard({ id, name, lastUpdatedAt, onOpen }: { id: string; name: string; lastUpdatedAt: number; onOpen: (id: string) => void }) {
// 	return (
// 		<ListItem>
// 			<ListItemButton onClick={() => onOpen(id)} sx={{ borderRadius: "8px", padding: "0px" }}>
// 				<Typography>{name}</Typography>
// 				<Typography>{new Date(lastUpdatedAt).toLocaleString()}</Typography>
// 				<Button onClick={() => onOpen(id)}>Open</Button>
// 			</ListItemButton>
// 		</ListItem>
// 	);
// }

export default function SavedChatsPage({ savedChats }: {
	savedChats: {
		id: string;
		lastUpdatedAt: number;
		name: string;
	}[]
}) {
	const navigate = useNavigate();

	// Sort savedChats by lastUpdatedAt in descending order
	const sortedChats = [...savedChats].sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				<div className="saved-chats-header">
					<button className="back-button" onClick={() => navigate("/dashboard")}>
						← Back
					</button>
					<h1>Saved Chats</h1>
				</div>

				<div className="chat-list">
					{sortedChats.map((chat) => (
						<div key={chat.id} className="chat-card">
							<div className="chat-info">
								<h2 className="chat-title">{chat.name}</h2>
								<span className="chat-timestamp">{new Date(chat.lastUpdatedAt).toLocaleString()}</span>
							</div>
							<button
								className="open-chat-button"
								onClick={() => navigate(`/ai-chat/${chat.id}`)}
							>
								Open
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
