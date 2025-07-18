import { useState } from "react";
import { useNavigate } from "react-router";
import "~/index.scss";
import "./daily-routine-page.css";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function RoutinePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const newEntry: Task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
    };
    setTasks([...tasks, newEntry]);
    setNewTask("");
  };

  const handleToggleTask = (id: number) => {
    if (showInput) return; // Prevent toggling while editing
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemoveTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const allCompleted = tasks.length > 0 && tasks.every((task) => task.completed);

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
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  disabled={showInput}
                />
                <span>{task.text}</span>
              </label>
              {showInput && (
                <button
                  className="remove-task-btn"
                  onClick={() => handleRemoveTask(task.id)}
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
