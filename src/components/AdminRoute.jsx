import { Navigate } from "react-router-dom";

export default function AdminRoute({ children, role }) {
  if (role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
}
