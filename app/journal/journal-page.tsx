import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { JournalEntry } from "workers/read-api";
import "~/index.scss";
import "./journal-page.css";

export default function JournalPage({ entry }: { entry: JournalEntry | null }) {
	const navigate = useNavigate();
	const [entries, setEntries] = useState(["", "", ""]);

	useEffect(() => {
		if (entry?.content) {
			setEntries([
				entry.content[0] || "",
				entry.content[1] || "",
				entry.content[2] || "",
			]);
		}
	}, [entry]);


	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (entry) return; // prevent editing if entry is pre-filled
		const { name, value } = e.target;
		const index = parseInt(name, 10);
		if (isNaN(index) || index < 0 || index >= entries.length) return;
		const newEntries = [...entries];
		newEntries[index] = value;
		setEntries(newEntries);
	};

	const handleSave = async () => {
		if (entry) return; // prevent saving if viewing an existing entry

		try {
			const response = await fetch("/api/journals", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contents: entries }),
			});

			if (!response.ok) throw new Error("Failed to save journal entry");

			navigate("/journal-entries");
		} catch (error) {
			console.error("Failed to save journal entry:", error);
		}
	};

	return (
		<div className="app-wrapper">
			<div className="phone-container journal-container">
				<div className="journal-header">
					<button className="back-button" onClick={() => navigate("/dashboard")}>
						← Back
					</button>
					<h1>{entry ? entry.name : "My Journal"}</h1>
				</div>

				<div className="journal-section">
					<label>How are you feeling today?</label>
					<textarea
						name="0"
						value={entries[0]}
						onChange={handleChange}
						rows={3}
						disabled={!!entry}
					/>
				</div>

				<div className="journal-section">
					<label>What happened today?</label>
					<textarea
						name="1"
						value={entries[1]}
						onChange={handleChange}
						rows={4}
						disabled={!!entry}
					/>
				</div>

				<div className="journal-section">
					<label>What's one goal for tomorrow?</label>
					<textarea
						name="2"
						value={entries[2]}
						onChange={handleChange}
						rows={2}
						disabled={!!entry}
					/>
				</div>

				{!entry && (
					<button className="journal-save" onClick={handleSave}>
						Save Entry
					</button>
				)}

				<button className="journal-previous" onClick={() => navigate("/journal-entries")}>
					Previous Entries
				</button>
			</div>
		</div>
	);
}
