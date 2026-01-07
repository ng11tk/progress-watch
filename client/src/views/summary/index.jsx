import React from "react";
import { Link } from "react-router-dom";
import { useTasks } from "../../contexts/useTasks";

function toLocalDateYYYYMMDD(dateInput) {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Summary() {
  const { tasks, learnings } = useTasks();

  // collect dates from completed tasks and learnings (use local dates)
  const datesSet = new Set();
  tasks.forEach((t) => {
    if (t.completed && t.completedAt)
      datesSet.add(toLocalDateYYYYMMDD(t.completedAt));
  });
  learnings.forEach((l) => datesSet.add(l.date));

  const dates = Array.from(datesSet).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Summary
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Your performance overview
          </p>
        </div>
        <Link
          to="/"
          className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {dates.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <p className="text-slate-400 text-lg">
            No performance or learnings recorded yet.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
          >
            Start tracking your progress
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {dates.map((date) => {
          const completedTasks = tasks.filter(
            (t) =>
              t.completed &&
              t.completedAt &&
              t.completedAt.slice(0, 10) === date
          );
          const completedTaskIds = new Set(completedTasks.map((t) => t.id));

          const dayLearnings = learnings.filter((l) => l.date === date);
          // learnings that don't correspond to a completed task on this date
          const extraLearnings = dayLearnings.filter(
            (l) => !l.taskId || !completedTaskIds.has(l.taskId)
          );

          // Do not use task.duration to calculate totals — only use learnings' recorded durations
          const minutesFromLearnings = dayLearnings.reduce(
            (s, l) => s + (l.duration || 0),
            0
          );
          const totalMinutes = minutesFromLearnings;

          return (
            <section
              key={date}
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl text-white shadow-2xl border border-slate-700/50"
            >
              <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h2 className="text-xl font-bold">{date}</h2>
                </div>
                <div className="text-sm text-slate-300 text-right">
                  <div className="flex items-center gap-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full font-medium">
                      {completedTasks.length} tasks
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-medium">
                      {totalMinutes} min
                    </span>
                  </div>
                  {extraLearnings.length > 0 && (
                    <div className="text-xs text-slate-400 mt-2">
                      ({extraLearnings.length} additional learnings)
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-6">
                {completedTasks.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <span className="text-green-400">✓</span> Completed Tasks
                    </h3>
                    <ul className="space-y-3">
                      {completedTasks.map((t) => (
                        <li
                          key={t.id}
                          className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-600/60 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="font-semibold text-white">
                                {t.title}
                              </div>
                              <div className="text-sm text-slate-400 mt-1">
                                {t.description}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg font-medium">
                                {t.duration} min
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-lg font-medium ${
                                  t.priority === "high" || t.priority === "High"
                                    ? "bg-red-500/20 text-red-300"
                                    : t.priority === "medium" ||
                                      t.priority === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-green-500/20 text-green-300"
                                }`}
                              >
                                {t.priority}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dayLearnings.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <span className="text-purple-400">💡</span> Learnings
                    </h3>
                    <ul className="space-y-3">
                      {dayLearnings.map((l) => (
                        <li
                          key={l.id}
                          className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-600/60 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="font-semibold text-purple-300">
                              {l.taskTitle || "(task removed)"}
                            </div>
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg font-medium shrink-0">
                              {l.duration || 0} min
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-slate-600/30 p-3 rounded-lg">
                              <div className="text-xs text-slate-400 mb-1 font-medium">
                                Today's Learning:
                              </div>
                              <div className="text-sm text-slate-300">
                                {l.today || "—"}
                              </div>
                            </div>
                            <div className="bg-slate-600/30 p-3 rounded-lg">
                              <div className="text-xs text-slate-400 mb-1 font-medium">
                                Tomorrow's Plan:
                              </div>
                              <div className="text-sm text-slate-300">
                                {l.tomorrow || "—"}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
