import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import ThemeContext from "../../component/Context/ThemeContext";

export default function TermsAndConditionsSeller() {
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
    "Sellers must provide accurate descriptions and images of listed items.",
    "All items must comply with legal and marketplace regulations.",
    "Once an item receives a bid, sellers cannot withdraw the listing.",
    "Sellers are responsible for packaging and shipping sold items within the specified timeframe.",
    "Misrepresentation of products may lead to account suspension or legal action.",
    "All transactions must be conducted through RexAuction's payment system.",
    "RexAuction reserves the right to remove any listings that violate policies.",
    "Sellers must honor the winning bid and complete the transaction as agreed.",
    "Refunds and returns must follow the marketplace's stated policy.",
    "Sellers are responsible for resolving disputes with buyers professionally.",
    "Violation of any terms may result in suspension or termination of the seller account.",
    "Personal and business data provided will be managed according to the privacy policy.",
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
        Terms & Conditions for a Buyer
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
            isDarkMode
              ? "bg-gray-600 border-gray-600 text-white "
              : "bg-gray-100"
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
              <p
                className={`${
                  isDarkMode ? "text-white" : "text-gray-700"
                } dark:text-gray-200 text-sm lg:text-base`}
              >
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
