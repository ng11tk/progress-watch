import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StopwatchModal from "./components/stopwatchModal";

const Dashboard = () => {
  const [selectedTask, setSelectedTask] = React.useState({});
  const [tasks, setTasks] = React.useState([]);

  // fetch tasks from backend on mount
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks");
      if (response.status === 200) {
        setTasks(response.data);
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-4">
          <Link
            to="/tasks"
            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg"
          >
            Go to Tasks
          </Link>

          <Link to="/summary" className="text-sm text-slate-300 underline">
            View Summary
          </Link>
        </div>
      </div>

      {/* Today's Tasks */}
      <section className="bg-slate-800 text-white rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-xl mb-3">Today's Tasks ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p className="text-slate-400">No tasks scheduled for today.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`p-4 rounded-lg transition-all ${
                  task.session_status === "completed"
                    ? "bg-slate-700/50 opacity-60 cursor-default border border-slate-600/30"
                    : "bg-slate-700 cursor-pointer hover:bg-slate-600"
                }`}
                onClick={() => {
                  if (task.session_status !== "completed")
                    setSelectedTask(task);
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div
                      className={`font-semibold ${
                        task.session_status === "completed"
                          ? "line-through text-slate-500"
                          : ""
                      }`}
                    >
                      {task.title}
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        task.session_status === "completed"
                          ? "text-slate-400 line-through"
                          : "text-slate-300"
                      }`}
                    >
                      {task.description}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {task.session_status === "paused" && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                          Paused
                        </span>
                      )}
                      {task.session_status === "completed" && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                          Completed
                        </span>
                      )}
                      {task.session_status === "idle" && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                          Idle
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 text-right">
                      Priority:{" "}
                      <span className="font-medium">{task.priority}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Timer Modal */}
      {Object.keys(selectedTask).length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setSelectedTask({})}
        >
          <div
            className="bg-slate-800 text-white rounded-2xl p-6 w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-slate-300 hover:text-white"
              onClick={() => setSelectedTask({})}
            >
              ✕
            </button>

            <h3 className="text-lg mb-2">{selectedTask.title}</h3>
            <p className="mb-4 text-sm text-slate-300">
              {selectedTask.description}
            </p>

            <StopwatchModal
              task={selectedTask}
              onClose={() => setSelectedTask({})}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
