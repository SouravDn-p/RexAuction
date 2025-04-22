"use client";

import { useState, useEffect, useContext } from "react";
import useAuth from "../../../../hooks/useAuth";
import AdminPayment from "./AdminPayment";
import BuyerPayment from "./BuyerPayment";
import SellerPayment from "./SellerPayment";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import ThemeContext from "../../../Context/ThemeContext";

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-lg ${bgColor} text-white transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      {type === "success" && <CheckCircle className="w-5 h-5 mr-2" />}
      {type === "error" && <X className="w-5 h-5 mr-2" />}
      {type === "warning" && <AlertCircle className="w-5 h-5 mr-2" />}
      {type === "info" && <Info className="w-5 h-5 mr-2" />}
      <div className="text-sm font-medium">{message}</div>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main SharedPayment Component
export default function SharedPayment() {
  const { dbUser, loading } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [toast, setToast] = useState(null);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div
      className={`min-h-screen p-4 ${
        isDarkMode
          ? "bg-gray-900 border-gray-600 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50 placeholder-gray-500"
      } transition-colors duration-300 `}
    >
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div
        className={`min-h-screen mx-auto py-6 p-4 rounded-md ${
          isDarkMode
            ? "bg-gray-900 border-gray-600 text-white"
            : "bg-gradient-to-b from-purple-100 via-white to-purple-50 placeholder-gray-500"
        }`}
      >
        {dbUser?.role === "admin" && <AdminPayment />}
        {dbUser?.role === "buyer" && <BuyerPayment />}
        {dbUser?.role === "seller" && <SellerPayment />}
        {!dbUser?.role && (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Access Denied</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              You don't have permission to view this page or you need to log in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
