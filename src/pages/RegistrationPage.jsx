import React from "react";
import { NavLink } from "react-router-dom";
import biddingImg from "../assets/register.jpg";
import google from "../assets/Untitled_design__19_-removebg-preview.png";

const RegistrationPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        {/* Left Section - Registration Form */}
        <div className="w-1/2 p-8">
          <div className="flex mb-5">
            <NavLink
              to="/login"
              className="mt-4 w-1/2 px-6 py-2 border border-purple-600 text-purple-600 font-semibold shadow-md hover:bg-purple-600 hover:text-white transition-all"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#6b46c1" : "transparent",
                color: isActive ? "white" : "#6b46c1",
              })}
            >
              LogIn
            </NavLink>

            <NavLink
              to="/registration"
              className="mt-4 w-1/2 px-6 py-2 border border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#f97316" : "transparent",
                color: isActive ? "white" : "#f97316",
              })}
            >
              Register Now
            </NavLink>
          </div>

          <form>
            {/* Name Input */}
            <div className="flex gap-2">
              <div className="mb-4 w-1/2">
                <label className="block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 mt-1 border rounded-lg border-gray-300 h-[50px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Photo Upload Input */}
              <div className="mb-4 w-1/2">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Photo
                </label>
                <input
                  type="file"
                  className="w-full p-3 mt-1 border rounded-lg border-gray-300 h-[50px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {/* User Email Input */}
              <div className="mb-4 w-1/2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
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
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
            >
              Register
            </button>
          </form>

          {/* Google Login Button */}
          <button className="w-full mt-4 rounded-lg flex items-center justify-center border-2 border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all">
            <img src={google} alt="Google logo" className="w-10 h-10 mr-3" />
            Continue with Google
          </button>
        </div>

        {/* Right Section - Welcome Message */}
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-black p-8"
          style={{
            backgroundImage: `url(${biddingImg})`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default RegistrationPage;
