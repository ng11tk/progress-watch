import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import StopwatchModal from "./components/stopwatchModal";

const Dashboard = () => {
  const [selectedTask, setSelectedTask] = React.useState({});
  const [tasks, setTasks] = React.useState([]);

  // fetch tasks from backend on mount
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`);
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
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your daily progress
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/tasks"
            className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 font-medium"
          >
            📋 Tasks
          </Link>

          <Link
            to="/summary"
            className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
          >
            📊 Summary
          </Link>
        </div>
      </div>

      {/* Today's Tasks */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 w-full shadow-2xl border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold">Today's Tasks</h2>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
            {tasks.length}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <p className="text-slate-400 text-lg">
              No tasks scheduled for today.
            </p>
            <Link
              to="/tasks"
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              Create your first task
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`p-5 rounded-xl transition-all duration-300 transform ${
                  task.session_status === "completed"
                    ? "bg-slate-700/30 opacity-60 cursor-default border border-slate-600/30"
                    : "bg-gradient-to-r from-slate-700 to-slate-800 cursor-pointer hover:from-slate-600 hover:to-slate-700 hover:scale-[1.02] hover:shadow-xl border border-slate-600/50"
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
                      {task.session_status === "finished" && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                          Finished
                        </span>
                      )}
                      {task.session_status === "completed" && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                          Completed
                        </span>
                      )}
                      {task.session_status === "interrupted" && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                          Interrupted
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setSelectedTask({})}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-8 w-[480px] relative shadow-2xl border border-slate-700/50 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-all"
              onClick={() => setSelectedTask({})}
            >
              <span className="text-xl">✕</span>
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{selectedTask.title}</h3>
              <p className="text-slate-300 leading-relaxed">
                {selectedTask.description}
              </p>
            </div>

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
