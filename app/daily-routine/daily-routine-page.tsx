import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { RoutineItem } from "workers/read-api";
import "~/index.scss";
import "./daily-routine-page.css";

const TEMP_ID_PREFIX = "temp";

export default function RoutinePage({ routine }: { routine: RoutineItem[] | null }) {
	const [tasks, setTasks] = useState<RoutineItem[]>(routine ?? []);
	const [newTask, setNewTask] = useState("");
	const [showInput, setShowInput] = useState(false);
	const navigate = useNavigate();

	const handleAddTask = async () => {
		if (newTask.trim() === "") return;

		const id = `${TEMP_ID_PREFIX}-${Date.now()}`;

		setNewTask("");

		const taskToAdd = newTask.trim();

		setTasks((prev) => [...prev, { id, name: taskToAdd, completed: false }]);

		try {
			const response = await fetch("/api/daily-routine", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ item: taskToAdd }),
			});

			if (!response.ok) throw new Error("Failed to add task");

			const body = await response.json() as { id: string };

			// Replace the temp ID with the real ID from the server
			setTasks((prev) => prev.map(task => task.id === id ? { ...task, id: body.id } : task));
		} catch (e) {
			setTasks((prev) => {
				// remove the task we just added
				return prev.filter(task => task.id !== id);
			});
			console.warn("Error adding task:", e);
			// alert("Failed to add task. Please try again."); // Simple error handling
		}
	};

	const handleToggleTask = async (id: string) => {
		let referencedTask: RoutineItem | undefined;

		setTasks((prev) => {
			referencedTask = prev.find(task => task.id === id);

			if (!referencedTask) return prev;

			const updatedTask = { ...referencedTask, completed: !referencedTask.completed };

			console.log("updated", referencedTask)

			return prev.map(task => task.id === id ? updatedTask : task);
		});

		console.log(referencedTask, tasks);

		if (referencedTask) try {
			await fetch("/api/daily-routine/completion", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ item: id, completed: !referencedTask.completed }),
			});
		} catch (error) {
			setTasks((prev) => {
				const task = prev.find(task => task.id === id);
				if (!task) return prev;

				const updatedTask = { ...task, completed: !task.completed };
				return prev.map(task => task.id === id ? updatedTask : task);
			});
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

	const allCompleted = useMemo(() => tasks.length > 0 && tasks.every(v => v.completed), [tasks]);

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
					{tasks.map(({ id, name, completed }) => (
						<div key={id} className={`task-card ${completed ? "completed" : ""}`}>
							<label className="task-label">
								<input
									type="checkbox"
									checked={completed}
									onChange={() => handleToggleTask(id)}
									disabled={showInput}
								/>
								<span>{name}</span>
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
