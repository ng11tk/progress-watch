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

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, updateTask, markTaskCompleted }}
    >
      {children}
    </TasksContext.Provider>
  );
}
