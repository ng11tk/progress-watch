import React from "react";
import ProgressWatch from "../../components/stopwatch";

const Dashboard = () => {
  return (
    <div>
      <button
        onClick={() => {
          window.location.href = "/tasks";
        }}
      >
        Add Task
      </button>
      <ProgressWatch />
    </div>
  );
};

export default Dashboard;
