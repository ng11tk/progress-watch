import React, { useState } from "react";
import { TasksContext } from "./TasksContextCore";

const initialTasks = [
  {
    id: 1,
    title: "Task One",
    description: "This is the first task",
    startDate: "2025-12-01",
    targetDate: "2025-12-30",
    priority: "High",
    duration: 0.05, // minutes
    completed: false,
  },
  {
    id: 2,
    title: "Task Two",
    description: "This is the second task",
    startDate: "2025-12-01",
    targetDate: "2025-12-30",
    priority: "Medium",
    duration: 0.05, // minutes
    completed: false,
  },
  {
    id: 3,
    title: "Task Three",
    description: "This is the third task",
    startDate: "2025-12-01",
    targetDate: "2025-12-30",
    priority: "Low",
    duration: 0.05, // minutes
    completed: false,
  },
];

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task.title || task.name || "Untitled",
      description: task.description || "",
      startDate: task.startDate || "",
      targetDate: task.targetDate || "",
      priority: task.priority || "Medium",
      duration: Number(task.duration) || 25,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const markTaskCompleted = (id) => {
    updateTask(id, { completed: true, completedAt: new Date().toISOString() });
  };

  const [learnings, setLearnings] = useState([
    {
      id: 1,
      taskId: 1,
      taskTitle: "Task One",
      duration: 25,
      today: "Learned about React Context",
      tomorrow: "Practice more with Context API",
      date: "2025-12-02",
      createdAt: "2025-12-02T10:00:00Z",
    },
    {
      id: 2,
      taskId: 2,
      taskTitle: "Task Two",
      duration: 30,
      today: "Studied JavaScript closures",
      tomorrow: "Implement closures in a project",
      date: "2025-12-02",
      createdAt: "2025-12-02T11:00:00Z",
    },
    {
      id: 3,
      taskId: 1,
      taskTitle: "Task One",
      duration: 25,
      today: "Explored React hooks",
      tomorrow: "Build a small app using hooks",
      date: "2025-12-03",
      createdAt: "2025-12-03T09:30:00Z",
    },
    {
      id: 4,
      taskId: 3,
      taskTitle: "Task Three",
      duration: 15,
      today: "Reviewed CSS Flexbox",
      tomorrow: "Create layouts using Flexbox",
      date: "2025-12-03",
      createdAt: "2025-12-03T10:15:00Z",
    },
  ]);

  function toLocalDateYYYYMMDD(dateInput) {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const addLearning = ({ taskId, today, tomorrow, date, duration }) => {
    const task = tasks.find((t) => t.id === taskId);
    const entry = {
      id: Date.now(),
      taskId,
      taskTitle: task?.title || "",
      duration: typeof duration === "number" ? duration : task?.duration || 0,
      today: today || "",
      tomorrow: tomorrow || "",
      date: date || toLocalDateYYYYMMDD(new Date()), // YYYY-MM-DD local
      createdAt: new Date().toISOString(),
    };
    setLearnings((prev) => [entry, ...prev]);
    return entry;
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        markTaskCompleted,
        learnings,
        addLearning,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
