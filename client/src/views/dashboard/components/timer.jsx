import React from "react";

function Timer({ minutes, seconds, isRunning, start, pause, onStop }) {
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
        <div className="flex gap-3">
          <button
            onClick={pause}
            className="flex-1 bg-yellow-500 rounded-lg py-2"
          >
            Pause
          </button>
          <button
            onClick={onStop}
            className="flex-1 bg-red-500 rounded-lg py-2"
          >
            Stop
          </button>
        </div>
      )}
    </>
  );
}
export default Timer;
