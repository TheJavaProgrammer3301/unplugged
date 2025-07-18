import { useState } from "react";
import { useNavigate } from "react-router";
import "~/index.scss";
import "./daily-routine-page.css";

export default function RoutinePage({ completions }: { completions: Record<string, boolean> | null }) {
	const [tasks, setTasks] = useState<Record<string, boolean>>(completions ?? {});
	const [newTask, setNewTask] = useState("");
	const [showInput, setShowInput] = useState(false);
	const navigate = useNavigate();

	const handleAddTask = async () => {
		if (newTask.trim() === "") return;

		const taskToAdd = newTask.trim();
		setTasks((prev) => ({ ...prev, [taskToAdd]: false }));
		setNewTask("");

		try {
			await fetch("/api/daily-routine", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Object.keys(tasks)),
			});
		} catch (e) {
			setTasks((prev) => {
				// remove the task we just added
				const { [taskToAdd]: removed, ...rest } = prev;
				return rest;
			});
		}
	};

	const handleToggleTask = async (text: string) => {
		if (showInput) return; // Prevent toggling while editing

		const previous = tasks[text];

		setTasks((prev) => ({ ...prev, [text]: !previous }));

		try {
			await fetch("/api/daily-routine/completion", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ item: text, completed: !previous }),
			});
		} catch (error) {
			setTasks((prev) => ({ ...prev, [text]: previous }));
		}
	};

	const handleRemoveTask = async (text: string) => {
		setTasks((prev) => {
			const { [text]: removed, ...rest } = prev;

			return rest;
		});

		try {
			await fetch("/api/daily-routine", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ item: text }),
			});
		} catch (error) {
			setTasks((prev) => ({ ...prev, [text]: false }));
		}
	};

	const allCompleted = Object.keys(tasks).length > 0 && Object.values(tasks).every((completed) => completed);

	return (
		<div className="app-wrapper">
			<div className="phone-container">
				{/* Top Bar */}
				<div className="top-bar">
					<div className="back-button-container">
						<button className="back-button" onClick={() => navigate("/dashboard")}>
							←
						</button>
					</div>
					<div className="page-title">Daily Routine</div>
					<div style={{ width: "24px" }} />
				</div>

				{/* Task List */}
				<div className="task-list">
					{Object.entries(tasks).map(([text, completed]) => (
						<div key={text} className={`task-card ${completed ? "completed" : ""}`}>
							<label className="task-label">
								<input
									type="checkbox"
									checked={completed}
									onChange={() => handleToggleTask(text)}
									disabled={showInput}
								/>
								<span>{text}</span>
							</label>
							{showInput && (
								<button
									className="remove-task-btn"
									onClick={() => handleRemoveTask(text)}
								>
									Remove
								</button>
							)}
						</div>
					))}
				</div>

				{/* Input Field */}
				{showInput && (
					<div className="add-task-form">
						<input
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyDown={(e) => { if (e.key === "Enter") handleAddTask(); }}
							placeholder="Add routine item..."
						/>
						<button onClick={handleAddTask}>Add</button>
					</div>
				)}

				{/* Congrats */}
				{allCompleted && (
					<div className="congrats-message">
						🎉 Congrats! You completed your routine!
					</div>
				)}

				{/* Edit Toggle */}
				<button
					className="edit-button"
					onClick={() => setShowInput((prev) => !prev)}
				>
					{showInput ? "Done" : "Edit Routine"}
				</button>
			</div>
		</div>
	);
}
