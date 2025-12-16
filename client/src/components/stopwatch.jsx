import { useStopwatch } from "../hooks/useStopwatch";

export default function Stopwatch() {
  const { time, isRunning, start, pause, reset } = useStopwatch(1 * 60 * 60);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 text-white rounded-2xl p-8 w-80 shadow-xl">
        <h1 className="text-xl font-semibold text-center mb-6">Stopwatch</h1>

        <div className="text-4xl font-mono text-center mb-8">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <div className="flex justify-between">
          {!isRunning ? (
            <button
              onClick={start}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition"
            >
              Pause
            </button>
          )}

          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
