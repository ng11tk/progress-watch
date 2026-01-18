import React, { useState } from "react";
import api from "../../../lib/axios";
import { useStopwatch } from "../../../hooks/useStopwatch";
import LearningForm from "./learning";
import Timer from "./timer";
import { useEffect } from "react";

const StopwatchModal = ({ task, onClose }) => {
  //* on pause
  // if session is not created, create session with paused status, complteted_at as null
  // if session exists(status != "completed" && task_id and session_date), update session with paused status, complteted_at as null
  // if we again select the paused task to start, continue from where we left

  //* on stop
  // if session is not created, create session with interrupted status
  // if session exists, update session with interrupted status

  //* on finish
  // if session is not created, create session with finish status
  // if session exists, update session with finish status
  // we can reopen the modal to add learning or complete the task

  //* onComplete
  // if session exists, update session with completed status

  //todo on add learning
  // if session exists, create new learning entry

  const startingSeconds = (task?.duration ?? 25) * 60; // convert minutes -> seconds
  const { time, isRunning, start, pause, reset } = useStopwatch(
    startingSeconds,
    onFinish
  );
  const [view, setView] = useState("RUNNING");
  const [learning, setLearning] = useState({
    today: "",
    tomorrow: "",
  });
  const [sessionDetails, setSessionDetails] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [timerStatus, setTimerStatus] = useState("idle");
  // idle, start, stop, pause, finish, completed

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  //* fetch the session details for the task if any exists
  // and populate the stopwatch accordingly
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get("/api/sessions/task", {
          params: { task_id: task.id },
        });
        const session = response?.data[0];

        if (session) {
          if (session.status === "paused") {
            const elapsedSeconds = session.session_time;
            const remainingSeconds = startingSeconds - elapsedSeconds;
            reset(remainingSeconds);
            setTimerStatus("pause");
          }
          // if status is finished or interrupted, we don't need to do anything special
          else if (session.status === "finished") {
            setView("FINISHED");
            setTimerStatus("finish");
          } else if (session.status === "interrupted") {
            setView("FINISHED");
            setTimerStatus("stop");
          }
          setSessionDetails(session);
        }
      } catch (error) {
        console.error("failed to fetch session", error);
      }
    };

    fetchSession();
  }, [task]);

  // handlers
  function computeElapsedSec() {
    return Math.max(0, Math.ceil(startingSeconds - time));
  }
  const handleStart = () => {
    setTimerStatus("start");
    start();
  };
  const handlePause = async () => {
    setTimerStatus("pause");
    pause();

    try {
      await api.post("/api/session", {
        task_id: task.id,
        session_date: new Date().toISOString().slice(0, 10),
        session_time: Math.max(0, Math.ceil(computeElapsedSec())),
        status: "paused",
      });
    } catch (error) {
      console.error("failed to insert session", error);
    }
  };
  const handleStop = async () => {
    const secs = computeElapsedSec();
    const mins = Math.max(0, Math.ceil(secs / 60));
    setLearning((l) => ({ ...l, duration: mins }));

    setView("FINISHED");
    setTimerStatus("stop"); // Keep as "stop" for interrupted sessions
    pause();

    // send session update to server
    try {
      await api.post("/api/session", {
        task_id: task.id,
        session_date: new Date().toISOString().slice(0, 10),
        session_time: Math.max(0, Math.ceil(computeElapsedSec())),
        status: "interrupted",
      });
    } catch (error) {
      console.error("failed to insert session", error);
    }
  };
  async function onFinish() {
    // set learning duration from elapsed time before changing view/state
    const secs = computeElapsedSec();
    const mins = Math.max(0, Math.ceil(secs / 60));
    setLearning((l) => ({ ...l, duration: mins }));

    setView("FINISHED");
    setTimerStatus("finish");
    // ensure stopwatch is stopped and mark task completed (keep modal open so user can add learning)
    try {
      pause();
    } catch {
      /* noop */
    }

    // send session update to server - timer completed naturally
    try {
      await api.post("/api/session", {
        task_id: task.id,
        session_date: new Date().toISOString().slice(0, 10),
        session_time: secs,
        status: "finished",
      });
    } catch (error) {
      console.error("failed to insert session", error);
    }
  }
  async function handleComplete() {
    const secs = computeElapsedSec();
    // send session update to server - mark session as completed
    try {
      await api.post("/api/session", {
        task_id: task.id,
        session_date: new Date().toISOString().slice(0, 10),
        session_time: sessionDetails?.session_time || secs,
        status: "completed",
      });
    } catch (error) {
      console.error("failed to insert session", error);
    }
    // simply close the modal for now, session is already marked as finished
    onClose && onClose();
  }

  const handleSubmitLearning = async () => {
    // add learning entry to server
    try {
      const res = await api.post("/api/daily-notes", {
        task_id: task.id,
        note_date: new Date().toISOString().slice(0, 10),
        today_learnings: learning.today,
        tomorrow_plans: learning.tomorrow,
      });
      if (res.status === 201) {
        // reset learning form and go back to finished view
        setLearning({
          today: "",
          tomorrow: "",
        });
        reset();
        setView("FINISHED");
      }
    } catch (error) {
      console.error("failed to insert learning", error);
    }
  };

  return (
    <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
      {/* ---------------- RUNNING ---------------- */}
      {view === "RUNNING" && (
        <>
          <Timer
            minutes={minutes}
            seconds={seconds}
            isRunning={isRunning}
            start={handleStart}
            pause={handlePause}
            onStop={handleStop}
          />
        </>
      )}

      {/* ---------------- FINISHED ---------------- */}
      {view === "FINISHED" && (
        <>
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-400 text-lg font-semibold">
              Timer Completed
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Great work! Add your learnings or mark as complete.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView("ADD_LEARNING")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl py-3 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-200"
            >
              💡 Add Learning
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl py-3 font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200"
            >
              ✓ Complete
            </button>
          </div>
        </>
      )}

      {/* ---------------- ADD LEARNING ---------------- */}
      {view === "ADD_LEARNING" && (
        <LearningForm
          learning={learning}
          setLearning={setLearning}
          onSubmit={handleSubmitLearning}
        />
      )}
    </div>
  );
};

export default StopwatchModal;
