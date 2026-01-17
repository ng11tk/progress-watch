import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";
import Dashboard from "./views/dashboard";
import TaskList from "./views/tasks";
import Summary from "./views/summary";
import Login from "./views/login";
import Signup from "./views/signup";
import { TasksProvider } from "./contexts/TasksContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="App bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen text-white">
      <AuthProvider>
        <TasksProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TaskList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/summary"
                element={
                  <ProtectedRoute>
                    <Summary />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </TasksProvider>
      </AuthProvider>
    </div>
  );
}
