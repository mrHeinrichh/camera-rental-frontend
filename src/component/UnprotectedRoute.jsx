import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ({ children, unprotected = false }) {
  const auth = useSelector((state) => state.auth);

  return unprotected || !auth?.authenticated ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
