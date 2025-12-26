import React, { useState } from "react";
import axios from "axios";
import { useTasks } from "../../../contexts/useTasks";
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

  //todo on finish
  // if session is not created, create session with finish status
  // if session exists, update session with finish status

  //todo on complete
  // if session is not created, create session with completed status
  // if session exists, update session with completed status

  //todo on add learning
  // if session is not created, create session and also create new learning entry
  // if session exists, update session and also create new learning entry

  const startingSeconds = (task?.duration ?? 25) * 60; // convert minutes -> seconds
  const { addLearning } = useTasks();
  const { time, isRunning, start, pause, reset } = useStopwatch(
    startingSeconds,
    onFinish
  );
  const [view, setView] = useState("RUNNING");
  const [learning, setLearning] = useState({
    today: "",
    tomorrow: "",
  });
  const [timerStatus, setTimerStatus] = useState("idle");
  console.log("🚀 ~ StopwatchModal ~ timerStatus:", timerStatus);
  // idle, start, stop, pause, finish

  // fetch the session details for the task if any exists
  // and populate the stopwatch accordingly
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/sessions", {
          params: { task_id: task.id },
        });
        const session = response.data[0];
        console.log("🚀 ~ fetchSession ~ sessions:", session);

        if (session) {
          if (session.status === "paused") {
            const elapsedSeconds = session.session_time;
            const remainingSeconds = startingSeconds - elapsedSeconds;
            reset(remainingSeconds);
            setTimerStatus("pause");
          }
        }
      } catch (error) {
        console.error("failed to fetch session", error);
      }
    };

    fetchSession();
  }, [task]);

  // handlers
  function computeElapsedSec() {
    return Math.max(0, Math.round(startingSeconds - time));
  }

  function onFinish() {
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
  }

  const handleStop = () => {
    const secs = computeElapsedSec();
    const mins = Math.max(0, Math.ceil(secs / 60));
    setLearning((l) => ({ ...l, duration: mins }));
    onFinish();
    setTimerStatus("stop");

    // send session update to server
    try {
      axios.post("http://localhost:3000/api/session", {
        task_id: task.id,
        session_date: new Date().toISOString().slice(0, 10),
        session_time: Math.max(0, Math.ceil(computeElapsedSec())),
        status: "interrupted",
        started_at: new Date(Date.now() - time * 1000),
        completed_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("failed to insert session", error);
    }
  };

  const handleStart = () => {
    setTimerStatus("start");
    start();
  };
  const handlePause = async () => {
    setTimerStatus("pause");
    pause();

    try {
      await axios.post("http://localhost:3000/api/session", {
        task_id: task.id,
        session_date: new Date().toISOString().slice(0, 10),
        session_time: Math.max(0, Math.ceil(computeElapsedSec())),
        status: "paused",
        started_at: new Date(Date.now() - time * 1000),
        completed_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("failed to insert session", error);
    }
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handleSubmitLearning = () => {
    // store learning for the task, prefer using the task's completed date if available
    addLearning({
      taskId: task?.id,
      today: learning.today,
      tomorrow: learning.tomorrow,
      date: task?.completedAt
        ? task.completedAt.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      duration:
        learning.duration ?? Math.max(0, Math.ceil(computeElapsedSec() / 60)),
    });

    reset();
    setView("FINISHED");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 text-white rounded-2xl p-6 w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-slate-300 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-lg mb-2">{task.title}</h3>
        <p className="mb-4 text-sm text-slate-300">{task.description}</p>

        <div className="bg-slate-800 text-white rounded-2xl p-6 w-full">
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
              <p className="text-center text-green-400 mb-4">
                ⏱ Timer Completed
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setView("ADD_LEARNING")}
                  className="flex-1 bg-blue-500 rounded-lg py-2"
                >
                  Add Learning
                </button>
                <button
                  onClick={() => {
                    onClose && onClose();
                  }}
                  className="flex-1 bg-green-500 rounded-lg py-2"
                >
                  Complete
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
      </div>
    </div>
  );
};

export default StopwatchModal;
