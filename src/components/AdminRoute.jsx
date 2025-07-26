import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function AdminRoute({ children, role }) {
  const user = auth.currentUser;

  // If not logged in → go back to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If logged in but not admin → redirect
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show the protected page
  return children;
}
