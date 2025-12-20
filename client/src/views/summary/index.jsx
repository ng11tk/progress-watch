import React from "react";
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Summary</h1>

      {dates.length === 0 && (
        <div className="text-slate-400">
          No performance or learnings recorded yet.
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
              className="bg-slate-800 p-6 rounded-2xl text-white"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{date}</h2>
                <div className="text-sm text-slate-300">
                  <span className="font-medium">{completedTasks.length}</span>{" "}
                  tasks done •{" "}
                  <span className="font-medium">{totalMinutes}</span> total
                  minutes{" "}
                  <span className="text-xs text-slate-400">
                    (from learnings)
                  </span>
                  {extraLearnings.length > 0 && (
                    <div className="text-xs text-slate-400 mt-1">
                      ({extraLearnings.length} learnings not tied to completed
                      tasks)
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                {completedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">
                      Completed Tasks
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {completedTasks.map((t) => (
                        <li key={t.id} className="p-3 bg-slate-700 rounded">
                          <div className="font-semibold">{t.title}</div>
                          <div className="text-xs text-slate-300">
                            {t.description}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Duration: {t.duration} min • Priority: {t.priority}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dayLearnings.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">
                      Learnings
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {dayLearnings.map((l) => (
                        <li key={l.id} className="p-3 bg-slate-700 rounded">
                          <div className="text-sm font-semibold">
                            {l.taskTitle || "(task removed)"}
                          </div>
                          <div className="text-xs text-slate-300 mt-1">
                            Today: {l.today || "—"}
                          </div>
                          <div className="text-xs text-slate-300 mt-1">
                            Tomorrow: {l.tomorrow || "—"}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Duration recorded: {l.duration || 0} min
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
