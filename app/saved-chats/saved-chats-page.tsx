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
	// const navigate = useNavigate();

	// return (
	// 	// theme={CURRENT_JOY_THEME}
	// 	<CssVarsProvider>
	// 		<Sheet id="root" sx={{ height: "100vh", display: "flex", flexDirection: "column", boxSizing: "border-box", background: CURRENT_THEME.colors.primaryBackground, padding: `32px`, gap: `16px` }}>
	// 			<Box sx={{ all: 'unset', display: "flex" }}>
	// 				<Button
	// 					color='danger'
	// 					sx={{ padding: "6px 12px", gap: "8px", color: "white" }}
	// 					onClick={() => navigate("/dashboard", { replace: true })}
	// 				>
	// 					<ArrowBack />
	// 					<Typography sx={{ color: "white" }}>Back</Typography>
	// 				</Button>
	// 				<Box sx={{ flexGrow: 1 }} />
	// 				<Typography level="h2" component="h1" sx={{ marginLeft: "16px", color: "white", fontWeight: "bold", textAlign: "center" }}>Saved chats</Typography>
	// 			</Box>
	// 			<Divider />
	// 			<List id="chat-messages" sx={{ padding: 0, flexGrow: "1", gap: `16px`, overflowY: "auto", scrollbarGutter: "stable", scrollBehavior: "auto" }}>
	// 				{savedChats.map((chat) => (
	// 					<SavedChatCard
	// 						key={chat.id}
	// 						id={chat.id}
	// 						name={chat.name}
	// 						lastUpdatedAt={chat.lastUpdatedAt}
	// 						onOpen={(id) => navigate(`/ai-chat/${id}`)}
	// 					/>
	// 				))}
	// 			</List>
	// 		</Sheet>
	// 	</CssVarsProvider>
	// );
	const navigate = useNavigate();

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
					{savedChats.map((chat) => (
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
