import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Vortex } from "react-loader-spinner";
import LoadingSpinner from "../component/LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return children;
  }

  return <Navigate to={"/login"} state={{ form: location }} replace />;
}
