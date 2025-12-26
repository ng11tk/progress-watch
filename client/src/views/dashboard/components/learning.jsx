import React from "react";

function LearningForm({ learning, setLearning, onSubmit }) {
  return (
    <>
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
export default LearningForm;
