import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm";

export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    // Navigate to dashboard on successful login
    navigate("/");
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
