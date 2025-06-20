import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Login />;
  }

  return <Outlet />;
} 