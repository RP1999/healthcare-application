import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function ProtectedRoute({ children }) {
  const token = useAuth((s) => s.token);
  if (!token) return <Navigate to="/signin" replace />;
  return children;
}
