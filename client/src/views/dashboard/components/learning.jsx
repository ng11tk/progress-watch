import React from "react";

function LearningForm({ learning, setLearning, onSubmit }) {
  return (
    <>
      <div className="mb-4">
        <label className="text-sm text-slate-300 mb-2 block font-medium">
          What did you learn today?
        </label>
        <textarea
          placeholder="Share your learnings and insights..."
          className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
          rows={3}
          value={learning.today}
          onChange={(e) => setLearning({ ...learning, today: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="text-sm text-slate-300 mb-2 block font-medium">
          What will you do tomorrow?
        </label>
        <textarea
          placeholder="Plan your next steps..."
          className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none"
          rows={3}
          value={learning.tomorrow}
          onChange={(e) =>
            setLearning({ ...learning, tomorrow: e.target.value })
          }
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200"
      >
        💾 Submit Learning
      </button>
    </>
  );
}
export default LearningForm;
