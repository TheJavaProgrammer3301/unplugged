import { ArrowBack, Delete } from '@mui/icons-material';
import { Alert, Box, Button, Card, Checkbox, Divider, IconButton, Input, List, ListItem, Sheet, Stack, Typography } from "@mui/joy";
import { CssVarsProvider } from '@mui/joy/styles';
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { RoutineItem } from "workers/read-api";
import "~/mui/index.scss";
import { CURRENT_JOY_THEME, CURRENT_THEME } from '~/mui/theme';
import "./daily-routine-page.css";

const INSET = 32;
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
		}
	};

	const handleToggleTask = useCallback(async (id: string) => {
		let referencedTask: RoutineItem | undefined;

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
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Button
						color='danger'
						sx={{ padding: "6px 12px", gap: "8px", color: "white" }}
						onClick={() => navigate("/dashboard")}
					>
						<ArrowBack />
						<Typography sx={{ color: "white" }}>Back</Typography>
					</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Typography level="h2" component="h1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
						Daily Routine
					</Typography>
				</Box>
				<Divider />

				{/* Add Task Form */}
				{showInput && (
					<Stack direction="row" spacing={1}>
						<Input
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
							onKeyDown={(e) => { if (e.key === "Enter") handleAddTask(); }}
							placeholder="Add routine item..."
							sx={{
								flexGrow: 1,
								backgroundColor: CURRENT_THEME.colors.assistantChatBackground,
								borderColor: "rgba(255, 255, 255, 0.3)",
								color: "white"
							}}
						/>
						<Button
							onClick={handleAddTask}
							sx={{
								color: "white",
								fontWeight: "bold",
							}}
						>
							Add
						</Button>
					</Stack>
				)}

				{/* Task List */}
				<List id="daily-routine" sx={{
					padding: 0,
					flexGrow: "1",
					gap: "12px",
					overflowY: "auto",
					scrollbarGutter: "stable",
					scrollBehavior: "smooth"
				}}>
					{tasks.map(({ id, name, completed }) => (
						<ListItem key={id} sx={{ padding: '0' }}>
							<Card
								sx={{
									width: "100%",
									borderRadius: "8px",
									backgroundColor: "rgba(255, 255, 255, 0.08)",
									borderLeft: "4px solid #00c853",
									padding: "8px 12px",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									opacity: completed ? 0.6 : 1,
									textDecoration: completed ? "line-through" : "none",
									flexDirection: "row"
								}}
								variant="plain"
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, flexGrow: 1 }}>
									<Checkbox
										checked={completed}
										onChange={() => handleToggleTask(id)}
										disabled={showInput}
										sx={{
											color: "white",
											'&.Mui-checked': {
												color: "#00c853"
											},
											'&.Mui-disabled': {
												filter: "opacity(0.5)",
											}
										}}
									/>
									<Typography
										sx={{
											color: "white",
											fontSize: "0.9rem",
											flexGrow: 1
										}}
									>
										{name}
									</Typography>
								</Box>
								{showInput && (
									<IconButton
										onClick={() => handleRemoveTask(id)}
										sx={{
											color: "#ff5555",
											fontSize: "0.75rem",
											minHeight: "unset",
											minWidth: "unset",
											padding: "4px"
										}}
										color='danger'
									>
										<Delete fontSize="small" />
									</IconButton>
								)}
							</Card>
						</ListItem>
					))}
				</List>

				{/* Congrats Message */}
				{allCompleted && (
					<Alert
						color="success"
						sx={{
							backgroundColor: "#00c853",
							color: "black",
							fontWeight: "bold",
							fontSize: "0.95rem",
							textAlign: "center"
						}}
					>
						🎉 Congrats! You completed your routine!
					</Alert>
				)}

				{/* Edit Toggle */}
				<Button
					onClick={() => setShowInput((prev) => !prev)}
					sx={{
						backgroundColor: "rgba(255, 255, 255, 0.15)",
						color: "white",
						fontSize: "0.85rem",
						padding: "8px 12px",
						borderRadius: "8px",
						'&:hover': {
							backgroundColor: "rgba(255, 255, 255, 0.25)"
						}
					}}
				>
					{showInput ? "Done" : "Edit Routine"}
				</Button>
			</Sheet>
		</CssVarsProvider>
	);
}
