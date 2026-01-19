import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../lib/axios";

export default function Summary() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [learnings, setLearnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, sessionsRes, learningsRes] = await Promise.all([
          api.post("/api/tasks", { where: {} }),
          api.get("/api/sessions"),
          api.get("/api/daily-notes"),
        ]);

        setTasks(tasksRes.data || []);
        setSessions(sessionsRes.data || []);
        setLearnings(learningsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="text-center py-16">
          <div className="text-slate-400 text-lg">Loading summary...</div>
        </div>
      </div>
    );
  }

  // Group sessions by date and task
  const completedSessions = sessions.filter((s) => s.status === "completed");

  // collect dates from completed sessions and learnings
  const datesSet = new Set();
  completedSessions.forEach((s) => {
    if (s.session_date) datesSet.add(s.session_date);
  });
  learnings.forEach((l) => {
    if (l.note_date) datesSet.add(l.note_date);
  });

  const dates = Array.from(datesSet).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Summary
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
          >
            ← Back to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {dates.length === 0 && (
        <div className="text-center py-16 bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50">
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
          console.log("🚀 ~ Summary ~ date:", date);
          // Get sessions completed on this date
          const daySessions = completedSessions.filter(
            (s) => s.session_date === date,
          );
          // Convert ObjectIds to strings for comparison
          const taskIdsCompleted = new Set(
            daySessions.map((s) => String(s.task_id)),
          );

          // Get tasks that were completed on this date
          const completedTasks = tasks.filter((t) =>
            taskIdsCompleted.has(String(t.id)),
          );

          const dayLearnings = learnings.filter((l) => l.note_date === date);

          // Calculate total time from sessions
          const totalMinutes = daySessions.reduce(
            (sum, s) => sum + Math.ceil((s.session_time || 0) / 60),
            0,
          );

          // format the date
          const formattedDate = new Date(date).toLocaleDateString();

          return (
            <section
              key={date}
              className="bg-linear-to-br from-slate-800 to-slate-900 p-8 rounded-2xl text-white shadow-2xl border border-slate-700/50"
            >
              <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-linear-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <h2 className="text-xl font-bold">{formattedDate}</h2>
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
                  {dayLearnings.length > 0 && (
                    <div className="text-xs text-slate-400 mt-2">
                      ({dayLearnings.length} learnings recorded)
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
                      {completedTasks.map((t) => {
                        const taskSession = daySessions.find(
                          (s) => String(s.task_id) === String(t.id),
                        );
                        const sessionMinutes = taskSession
                          ? Math.ceil((taskSession.session_time || 0) / 60)
                          : 0;

                        return (
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
                                  {sessionMinutes} min
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-lg font-medium ${
                                    t.priority === "high" ||
                                    t.priority === "High"
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
                        );
                      })}
                    </ul>
                  </div>
                )}

                {dayLearnings.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <span className="text-purple-400">💡</span> Learnings
                    </h3>
                    <ul className="space-y-3">
                      {dayLearnings.map((l) => {
                        const task = tasks.find(
                          (t) => String(t.id) === String(l.task_id),
                        );
                        return (
                          <li
                            key={l._id}
                            className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/30 hover:border-slate-600/60 transition-all"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="font-semibold text-purple-300">
                                {task?.title || "(task removed)"}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-slate-600/30 p-3 rounded-lg">
                                <div className="text-xs text-slate-400 mb-1 font-medium">
                                  Today's Learning:
                                </div>
                                <div className="text-sm text-slate-300">
                                  {l.today_learnings || "—"}
                                </div>
                              </div>
                              <div className="bg-slate-600/30 p-3 rounded-lg">
                                <div className="text-xs text-slate-400 mb-1 font-medium">
                                  Tomorrow's Plan:
                                </div>
                                <div className="text-sm text-slate-300">
                                  {l.tomorrow_plans || "—"}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
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
