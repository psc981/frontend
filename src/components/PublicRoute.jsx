import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "./Spinner";

export default function PublicRoute({ children }) {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  // If token exists, user is already logged in
  if (token) {
    if (role === "admin") {
      return <Navigate to="/psc" replace />;
    }
    return <Navigate to="/products" replace />;
  }

  return children;
}
