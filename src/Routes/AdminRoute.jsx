import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Vortex } from "react-loader-spinner";
import AdminAccessOnly from "../component/shared/AdminAccessOnly";

export default function AdminRoute({ children }) {
  const { user, loading, dbUser } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="180"
          width="180"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    );
  }

  if (dbUser?.role !== "admin") {
    return <AdminAccessOnly />;
  }

  if (dbUser?.role == "admin") {
    return children;
  }

  return <Navigate to={"/login"} state={{ form: location }} replace />;
}
