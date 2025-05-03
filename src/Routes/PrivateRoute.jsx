import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Vortex } from "react-loader-spinner";

export default function PrivateRoute({ children }) {
  const { user, loader } = useAuth();
  const location = useLocation();

  if (loader) {
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

  if (user) {
    return children;
  }

  return <Navigate to={"/login"} state={{ form: location }} replace />;
}
