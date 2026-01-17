import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/SignupForm";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignupSuccess = (data) => {
    // Navigate to login page after successful signup
    navigate("/login");
  };

  return <SignupForm onSignupSuccess={handleSignupSuccess} />;
}
