import React from "react";
import axios from "axios";

const TaskList = () => {
  const [openAddTask, setOpenAddTask] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);

  const [form, setForm] = React.useState({
    name: "Task Name",
    description: "Task Description",
    duration: 12,
    startDate: "25/01/2024",
    targetDate: "25/02/2026",
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
      const response = await axios.get("http://localhost:3000/api/tasks");
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
        "http://localhost:3000/api/tasks",
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div
        className="absolute top-8 right-8 text-white cursor-pointer
         border border-white rounded-full px-4 py-2 hover:bg-slate-700 transition"
        onClick={() => setOpenAddTask(true)}
      >
        + Add Task
      </div>
      <div className="bg-slate-800 text-white rounded-2xl p-6 w-full max-w-3xl">
        <h1 className="text-2xl mb-4">Task List</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-slate-300 text-sm">
                <th className="p-3">Title</th>
                <th className="p-3">Start</th>
                <th className="p-3">Target</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Completed</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-6">
                    No tasks available
                  </td>
                </tr>
              )}

              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className={`border-t border-slate-700 ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <td className="p-3 align-top">
                    <div className="font-semibold">{task.title}</div>
                    <div className="text-sm text-slate-300">
                      {task.description}
                    </div>
                  </td>
                  <td className="p-3 align-top text-xs text-slate-300">
                    {task.startDate}
                  </td>
                  <td className="p-3 align-top text-xs text-slate-300">
                    {task.targetDate}
                  </td>
                  <td className="p-3 align-top text-xs text-slate-300">
                    {task.duration} mins
                  </td>
                  <td className="p-3 align-top text-xs text-slate-300">
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </td>
                  <td className="p-3 align-top text-xs">
                    <label className="inline-flex items-center gap-2">
                      <span className="text-slate-300">Pending</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openAddTask && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-slate-800 text-white rounded-2xl p-6 w-96 relative transform transition-all scale-100"
            onClick={handleModalClick}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-xl mb-4">Add New Task</h2>
            <label className="sr-only">Task Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Task Name"
              className="w-full p-2 mb-3 rounded-lg bg-slate-700 border border-slate-600"
            />
            <label className="sr-only">Task Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Task Description"
              className="w-full p-2 mb-3 rounded-lg bg-slate-700 border border-slate-600 resize-none"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-sm text-slate-300 mb-1">Start Date</span>
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  type="date"
                  className="p-2 rounded-lg bg-slate-700 border border-slate-600"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-slate-300 mb-1">
                  Target Last Date
                </span>
                <input
                  name="targetDate"
                  value={form.targetDate}
                  onChange={handleChange}
                  type="date"
                  className="p-2 rounded-lg bg-slate-700 border border-slate-600"
                />
              </label>
            </div>
            <label className="flex flex-col mt-3">
              {" "}
              <span className="text-sm text-slate-300 mb-1">
                Duration (minutes)
              </span>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                type="number"
                min={1}
                className="p-2 rounded-lg bg-slate-700 border border-slate-600"
              />
            </label>
            <label className="flex flex-col mt-3">
              {" "}
              <span className="text-sm text-slate-300 mb-1">Priority</span>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="p-2 rounded-lg bg-slate-700 border border-slate-600"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-blue-500 rounded-lg py-2"
                onClick={handleSubmit}
              >
                Save Task
              </button>
              <button
                className="flex-1 bg-slate-600 rounded-lg py-2"
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
