import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/shared/Navbar";
import Footer from "../component/shared/Footer";

const Main = () => {
  const location = useLocation();
  const head =
    location.pathname.includes("login") ||
    location.pathname.includes("register");
  return (
    <div className="mx-auto ">
      {head || <Navbar />}
      <Outlet />
      {head || <Footer />}
    </div>
  );
};

export default Main;
