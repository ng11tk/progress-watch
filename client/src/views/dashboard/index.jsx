import React from "react";
import ProgressWatch from "../../components/stopwatch";
import { useTasks } from "../../contexts/useTasks";

const Dashboard = () => {
  const { tasks, markTaskCompleted } = useTasks();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const todaysTasks = tasks.filter(
    (t) => t.startDate <= today && t.targetDate >= today
  );

  const [selectedTask, setSelectedTask] = React.useState(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <section className="bg-slate-800 text-white rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-xl mb-3">Today's Tasks ({todaysTasks.length})</h2>

        {todaysTasks.length === 0 ? (
          <p className="text-slate-400">No tasks scheduled for today.</p>
        ) : (
          <ul className="space-y-3">
            {todaysTasks.map((task) => (
              <li
                key={task.id}
                className={`bg-slate-700 p-4 rounded-lg cursor-pointer ${
                  selectedTask?.id === task.id ? "ring-2 ring-blue-400" : ""
                } ${
                  task.completed ? "opacity-60 line-through cursor-default" : ""
                }`}
                onClick={() => {
                  if (!task.completed) setSelectedTask(task);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{task.title}</div>
                    <div className="text-sm text-slate-300">
                      {task.description}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Start: {task.startDate} | Target: {task.targetDate} |
                      Priority:{" "}
                      <span className="font-medium">{task.priority}</span>
                    </div>
                  </div>
                  {task.completed ? (
                    <div className="text-xs text-green-400 font-semibold">
                      Completed
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300">
                      Click to open timer
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* Timer modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-slate-800 text-white rounded-2xl p-6 w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-slate-300 hover:text-white"
              onClick={() => setSelectedTask(null)}
              aria-label="Close timer modal"
            >
              ✕
            </button>
            <h3 className="text-lg mb-2">{selectedTask.title}</h3>
            <div className="mb-4 text-sm text-slate-300">
              {selectedTask.description}
            </div>

            <ProgressWatch
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              onTaskComplete={(id) => {
                markTaskCompleted(id);
                setSelectedTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
