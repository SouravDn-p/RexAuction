import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import ThemeContext from "../../Context/ThemeContext";

export default function TermsAndConditionsBuyer() {
  const [accepted, setAccepted] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const terms = [
    "All buyers must be at least 18 years old to register.",
    "Bidders are required to provide accurate personal and payment details.",
    "All bids placed are legally binding and cannot be withdrawn.",
    "Winning bidders must complete payment within 48 hours.",
    "RexAuction reserves the right to cancel or suspend accounts due to misconduct.",
    "Items sold are ‘as is’ and returns/refunds are not permitted unless stated otherwise.",
    "Shill bidding (artificially inflating bids) is strictly prohibited.",
    "RexAuction is not liable for shipping delays or item damages post-auction.",
    "Bidders must comply with all local and international trade laws.",
    "Personal data will be protected under our privacy policy.",
    "Sellers may impose additional terms, which must be followed.",
    "Violation of any terms may result in account suspension or legal action.",
  ];

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-purple-100 to-purple-300 text-gray-900"
      }`}
    >
      {/* Heading */}
      <h2 className="text-3xl lg:text-4xl font-bold text-purple-700 dark:text-purple-300 text-center mb-6">
        Terms & Conditions as a Buyer
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md md:max-w-lg lg:max-w-3xl shadow-xl rounded-2xl p-6 lg:p-8 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        {/* Terms List with Scroll */}
        <div
          className={`h-64 lg:h-80 border p-4 rounded-md overflow-y-auto transition-colors duration-300 ${
            isDarkMode ? "bg-gray-600 border-gray-600 " : "bg-gray-100"
          }`}
        >
          {terms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="mb-3 flex items-start"
            >
              <span className="mr-2 text-purple-700 dark:text-purple-400 font-bold">
                •
              </span>
              <p className="text-gray-700 dark:text-gray-200 text-sm lg:text-base">
                {term}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Checkbox */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5  accent-purple-700 cursor-pointer"
          />
          <span className="ml-2 text-gray-500 dark:text-gray-300 text-sm lg:text-base">
            I agree to the terms and conditions
          </span>
        </div>

        {/* Button */}
        <button
          className={`w-full mt-6 px-5 py-3 text-white font-bold rounded-lg transition duration-300 ${
            accepted
              ? "bg-purple-700 hover:bg-purple-800"
              : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
          } text-sm lg:text-lg`}
          disabled={!accepted}
        >
          Accept & Continue
        </button>
      </motion.div>
    </div>
  );
}
