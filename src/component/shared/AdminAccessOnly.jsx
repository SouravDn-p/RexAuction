import { Link } from "react-router-dom";
import Lottie from "react-lottie-player";
import animationData from "../../assets/unAuthorize.json";
import { useContext } from "react";
import { motion } from "framer-motion";
import ThemeContext from "../Context/ThemeContext";

const AdminAccessOnly = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-3xl w-full rounded-lg shadow-lg p-8 flex flex-col items-center transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="w-full flex items-center justify-center mb-6">
          <Lottie
            loop
            animationData={animationData}
            play
            className="w-full max-w-xs"
          />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-2xl sm:text-3xl font-bold mb-2 text-center ${
            isDarkMode ? "text-purple-400" : "text-purple-600"
          }`}
        >
          Unauthorized Access
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg font-semibold mb-4 text-center text-red-500"
        >
          401 Error
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`text-base sm:text-lg text-center mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          This page is restricted to administrators only. Please contact support
          if you believe this is an error.
        </motion.p>
        <div className="w-full flex justify-center">
          <Link
            to="/"
            className={`font-medium transition-colors ${
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-500 hover:text-blue-600"
            } hover:underline`}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessOnly;
