import ProgressWatch from "./components/stopwatch";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Stopwatch */}
        <ProgressWatch />
      </div>
    </div>
  );
}
