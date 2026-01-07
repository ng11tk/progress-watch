import React from "react";

function Timer({ minutes, seconds, isRunning, start, pause, onStop }) {
  return (
    <>
      <div className="relative mb-8">
        <div className="text-6xl font-mono text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
        <div className="text-center text-slate-400 text-sm mt-2">minutes</div>
      </div>

      {!isRunning ? (
        <button
          onClick={start}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200"
        >
          ▶ Start Timer
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={pause}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-xl py-3 font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-200"
          >
            ⏸ Pause
          </button>
          <button
            onClick={onStop}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl py-3 font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200"
          >
            ⏹ Stop
          </button>
        </div>
      )}
    </>
  );
}
export default Timer;
