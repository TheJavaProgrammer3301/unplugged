import { useNavigate } from "react-router";
import type { JournalEntry } from "workers/read-api";
import "~/index.scss";
import "./journal-entries-page.css";

export default function JournalEntriesPage({ entries }: { entries?: JournalEntry[] }) {
	const navigate = useNavigate();

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				<div className="journal-entries-header">
					<button className="back-button" onClick={() => navigate("/journal")}>
						← Back
					</button>
					<h1>Journal Entries</h1>
				</div>

				<div className="entry-list">
					{entries?.map((entry) => (
						<div key={entry.id} className="entry-card">
							<div className="entry-info">
								<h2 className="entry-title">{entry.name}</h2>
								<span className="entry-timestamp">{new Date(entry.createdAt).toLocaleString()}</span>
							</div>
							<button
								className="open-entry-button"
								onClick={() => navigate(`/journal/${entry.id}`)}
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
