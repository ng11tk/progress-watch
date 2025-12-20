import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./views/dashboard";
import TaskList from "./views/tasks";
import { TasksProvider } from "./contexts/TasksContext";

export default function App() {
  return (
    <div className="App bg-slate-900 min-h-screen text-white p-6">
      <TasksProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </Router>
      </TasksProvider>
    </div>
  );
}
