"use client";

import { useState, useContext, useEffect } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import ThemeContext from "../../../Context/ThemeContext";
import { Star, MessageSquare, Users, Award } from "lucide-react";

const Header = ({ header, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`pt-8 transition-colors duration-300 ${
        isDarkMode ? " text-white" : " text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section with dynamic content */}
        <div
          className={`relative overflow-hidden rounded-2xl mb-16 p-8 md:p-12 transition-all duration-700 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90"></div>

          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-white opacity-10 blur-xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {header}
            </h1>
            <p className="mt-3 text-xl text-purple-100 max-w-2xl mx-auto">
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
