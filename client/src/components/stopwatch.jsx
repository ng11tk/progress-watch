import { useState, useEffect } from "react";
import { useStopwatch } from "../hooks/useStopwatch";

export default function ProgressWatch({ task, onClose }) {
  const [view, setView] = useState("RUNNING");
  const [learning, setLearning] = useState({
    today: "",
    tomorrow: "",
  });

  const onFinish = () => {
    setView("FINISHED");
  };

  const { time, isRunning, start, pause, reset } = useStopwatch(2, onFinish);

  // start timer automatically when a task is selected, cleanup on unmount or deselect
  useEffect(() => {
    if (task) {
      setView("RUNNING");
      start();
    }
    return () => {
      pause();
      reset();
      setLearning({ today: "", tomorrow: "" });
      setView("RUNNING");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handleSubmitLearning = () => {
    console.log("Learning:", learning);
    setView("COMPLETED");
    reset();
  };

  return (
    <div className="bg-slate-800 text-white rounded-2xl p-6 w-full">
      {/* Task header */}
      {task && (
        <div className="flex justify-between items-center mb-3">
          <div className="font-semibold">{task.title}</div>
          {onClose && (
            <button
              className="text-slate-300 hover:text-white"
              onClick={onClose}
              aria-label="Close timer"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* ---------------- RUNNING ---------------- */}
      {view === "RUNNING" && (
        <>
          <TimerUI
            minutes={minutes}
            seconds={seconds}
            isRunning={isRunning}
            start={start}
            pause={pause}
          />
        </>
      )}

      {/* ---------------- FINISHED ---------------- */}
      {view === "FINISHED" && (
        <>
          <p className="text-center text-green-400 mb-4">⏱ Timer Completed</p>
          <div className="flex gap-3">
            <button
              onClick={() => setView("ADD_LEARNING")}
              className="flex-1 bg-blue-500 rounded-lg py-2"
            >
              Add Learning
            </button>
            <button
              onClick={() => {
                setView("COMPLETED");
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

      {/* ---------------- COMPLETED ---------------- */}
      {view === "COMPLETED" && (
        <div>
          <p className="text-center text-green-400 mb-4">✅ Task Completed</p>
          {onClose && (
            <button
              onClick={onClose}
              className="w-full bg-slate-600 py-2 rounded-lg"
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TimerUI({ minutes, seconds, isRunning, start, pause }) {
  return (
    <>
      <div className="text-4xl font-mono text-center mb-6">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      {!isRunning ? (
        <button onClick={start} className="w-full bg-green-500 py-2 rounded-lg">
          Start
        </button>
      ) : (
        <button
          onClick={pause}
          className="w-full bg-yellow-500 py-2 rounded-lg"
        >
          Pause
        </button>
      )}
    </>
  );
}

function LearningForm({ learning, setLearning, onSubmit }) {
  return (
    <>
      <div className="tabs tabs-box mb-4">
        <span className="tab tab-active">Today</span>
        <span className="tab">Tomorrow</span>
      </div>

      <textarea
        placeholder="What did you learn today?"
        className="w-full mb-3 p-2 rounded bg-slate-700"
        value={learning.today}
        onChange={(e) => setLearning({ ...learning, today: e.target.value })}
      />

      <textarea
        placeholder="What will you do tomorrow?"
        className="w-full mb-4 p-2 rounded bg-slate-700"
        value={learning.tomorrow}
        onChange={(e) => setLearning({ ...learning, tomorrow: e.target.value })}
      />

      <button
        onClick={onSubmit}
        className="w-full bg-green-500 py-2 rounded-lg"
      >
        Submit
      </button>
    </>
  );
}
