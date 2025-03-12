import React from "react";
import { Link, NavLink } from "react-router-dom";
import biddingImg from "../assets/bgimg.jpg";
import google from "../assets/Untitled_design__19_-removebg-preview.png";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center lg:p-10 bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white lg:rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        {/* Image Section */}
        <div
          className="w-full lg:h-[450px] h-[200px] md:w-1/2 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-black p-8"
          style={{ backgroundImage: `url(${biddingImg})` }}
        ></div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <div className="flex mb-5 ">
            <NavLink
              to="/login"
              className="w-1/2  px-6 py-2 border border-purple-600 text-purple-600 font-semibold shadow-md hover:bg-purple-600 hover:text-white transition-all text-center"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#6b46c1" : "transparent",
                color: isActive ? "white" : "#6b46c1",
              })}
            >
              LogIn
            </NavLink>
            <NavLink
              to="/registration"
              className="w-1/2 px-6 py-2 border border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all text-center"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#f97316" : "transparent",
                color: isActive ? "white" : "#f97316",
              })}
            >
              Register Now
            </NavLink>
          </div>

          <form>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link to="#" className="text-purple-500 text-sm hover:underline">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
            >
              LOGIN
            </button>
          </form>

          <button className="w-full mt-4 rounded-lg flex items-center justify-center border-2 border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all">
            <img src={google} alt="Google logo" className="w-10 h-10 mr-3" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
