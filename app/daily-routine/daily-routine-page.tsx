import { useCallback, useMemo, useState } from "react";
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

	const handleToggleTask = useCallback(async (id: string) => {
		let referencedTask: RoutineItem | undefined;
		let jobId = Math.random().toString(36).substring(2, 9);

		referencedTask = tasks.find(task => task.id === id);

		if (!referencedTask) return;

		const updatedTask = { ...referencedTask, completed: !referencedTask.completed };

		setTasks(tasks.map(task => task.id === id ? updatedTask : task));

		if (referencedTask) try {
			await fetch(`/api/daily-routine/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ completed: !referencedTask.completed }),
			});
		} catch (error) {
			setTasks((prev) => {
				const task = prev.find(task => task.id === id);
				if (!task) return prev;

				const updatedTask = { ...task, completed: !task.completed };
				return prev.map(task => task.id === id ? updatedTask : task);
			});
		}
	}, [tasks]);

	const handleRemoveTask = useCallback(async (id: string) => {
		const taskToRemove = tasks.find(task => task.id === id);

		setTasks((prev) => prev.filter(task => task.id !== id));

		try {
			await fetch(`/api/daily-routine/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});
		} catch (error) {
			setTasks((prev) => [...prev, taskToRemove!]);
		}
	}, [tasks]);

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
									onClick={() => handleRemoveTask(id)}
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
