import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  // Not logged in → redirect to login
  if (!token) {
    const redirectPath = location.pathname.startsWith("/psc")
      ? "/psc-login"
      : "/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Logged in but not allowed for this route → redirect based on role
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/psc" replace />;
    }
    return <Navigate to="/products" replace />;
  }

  return children;
}
