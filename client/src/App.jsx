import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";
import Dashboard from "./views/dashboard";
import TaskList from "./views/tasks";
import Summary from "./views/summary";
import Login from "./views/login";
import Signup from "./views/signup";
import { TasksProvider } from "./contexts/TasksContext";

export default function App() {
  return (
    <div className="App bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen text-white">
      <TasksProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </TasksProvider>
    </div>
  );
}
