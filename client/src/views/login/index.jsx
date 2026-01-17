import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = (data) => {
    login(data);
    // Navigate to dashboard on successful login
    navigate("/");
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
