import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TaskList = () => {
  const [openAddTask, setOpenAddTask] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);

  const [form, setForm] = React.useState({
    name: "Task Name",
    description: "Task Description",
    duration: 0.05,
    startDate: new Date().toISOString().split("T")[0],
    targetDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
  });

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenAddTask(false);
    };
    if (openAddTask) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAddTask]);

  // fetch tasks from backend on mount
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/api/tasks"
      );
      if (response.status === 200) {
        const result = response.data.map((task) => ({
          ...task,
          startDate: new Date(task.start_date).toISOString().split("T")[0],
          targetDate: new Date(task.end_date).toISOString().split("T")[0],
        }));
        setTasks(result);
      } else {
        console.error("Failed to fetch tasks:", response);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  // handlers
  const handleOverlayClick = () => setOpenAddTask(false);
  const handleModalClick = (e) => e.stopPropagation();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // create new task
  const handleSubmit = async () => {
    // list of checks
    if (!form.name.trim()) {
      alert("Task name is required");
      return;
    }
    if (!form.startDate) {
      alert("Start date is required");
      return;
    }
    if (!form.targetDate) {
      alert("Target date is required");
      return;
    }

    // target date should be after start date
    if (new Date(form.targetDate) < new Date(form.startDate)) {
      alert("Target date should be after start date");
      return;
    }

    // add to shared tasks store
    console.log("Submitting form:", form);
    const newTask = {
      title: form.name,
      description: form.description,
      startDate: form.startDate,
      targetDate: form.targetDate,
      priority: form.priority,
      duration: Number(form.duration) || 25,
    };

    // send task data to backend here
    try {
      const response = await axios.post(
        "http://localhost:3000/server/api/task",
        newTask
      );
      if (response.status !== 201) {
        console.error("Failed to add task to backend:", response);
        return;
      }
      console.log("Task added to backend:", response.data);
      // refresh task list
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }

    setOpenAddTask(false);
    setForm({
      name: "",
      description: "",
      duration: 25,
      startDate: "",
      targetDate: "",
      priority: "Medium",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <Link
        to="/"
        className="absolute top-8 left-8 text-white cursor-pointer
         bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-5 py-2.5 transition-all duration-200 font-medium"
      >
        ← Dashboard
      </Link>
      <div
        className="absolute top-8 right-8 text-white cursor-pointer
         bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl px-5 py-2.5 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 font-medium"
        onClick={() => setOpenAddTask(true)}
      >
        ➕ Add Task
      </div>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 w-full max-w-5xl shadow-2xl border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Task List
          </h1>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-700/50">
          <table className="w-full text-left table-auto">
            <thead className="bg-slate-700/50">
              <tr className="text-slate-300 text-sm border-b border-slate-700">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Start</th>
                <th className="p-4 font-semibold">Target</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="text-6xl mb-4 opacity-50">📋</div>
                    <p className="text-slate-400 text-lg">No tasks available</p>
                    <button
                      onClick={() => setOpenAddTask(true)}
                      className="mt-4 text-blue-400 hover:text-blue-300 underline"
                    >
                      Create your first task
                    </button>
                  </td>
                </tr>
              )}

              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className={`border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <td className="p-4 align-top">
                    <div className="font-semibold text-white">{task.title}</div>
                    <div className="text-sm text-slate-400 mt-1">
                      {task.description}
                    </div>
                  </td>
                  <td className="p-4 align-top text-sm text-slate-300">
                    {task.startDate}
                  </td>
                  <td className="p-4 align-top text-sm text-slate-300">
                    {task.targetDate}
                  </td>
                  <td className="p-4 align-top">
                    <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg font-medium">
                      {task.duration} min
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.priority === "high" || task.priority === "High"
                          ? "bg-red-500/20 text-red-300"
                          : task.priority === "medium" ||
                            task.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <span className="text-sm text-slate-400 font-medium">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openAddTask && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 w-[480px] relative shadow-2xl border border-slate-700/50 animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
            onClick={handleModalClick}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Add New Task
            </h2>
            <label className="sr-only">Task Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Task Name"
              className="w-full p-3 mb-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            <label className="sr-only">Task Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full p-3 mb-4 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col">
                <span className="text-sm text-slate-300 mb-2 font-medium">
                  Start Date
                </span>
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  type="date"
                  className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-slate-300 mb-2 font-medium">
                  Target Date
                </span>
                <input
                  name="targetDate"
                  value={form.targetDate}
                  onChange={handleChange}
                  type="date"
                  className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </label>
            </div>
            <label className="flex flex-col mb-4">
              <span className="text-sm text-slate-300 mb-2 font-medium">
                Duration (minutes)
              </span>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                type="number"
                min={1}
                className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </label>
            <label className="flex flex-col mb-6">
              <span className="text-sm text-slate-300 mb-2 font-medium">
                Priority
              </span>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl py-3 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200"
                onClick={handleSubmit}
              >
                💾 Save Task
              </button>
              <button
                className="flex-1 bg-slate-700 hover:bg-slate-600 rounded-xl py-3 font-semibold transition-all duration-200"
                onClick={() => setOpenAddTask(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
