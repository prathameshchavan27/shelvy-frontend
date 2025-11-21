import { useAuth } from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = useAuth((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}
