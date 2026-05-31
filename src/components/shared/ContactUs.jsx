import React, { useContext, useState } from "react";
import ThemeContext from "../Context/ThemeContext";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiUser,
  FiBriefcase,
  FiHelpCircle,
} from "react-icons/fi";

const ContactUs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reusable input class with refined dark/light styles
  const inputClass = `
        border 
        rounded-md 
        px-4 
        py-3 
        w-full 
        focus:outline-none 
        focus:ring-2 
        focus:ring-purple-400 
        transition-all 
        duration-300
        ${
          isDarkMode
            ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-purple-500"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-purple-300"
        }
    `;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      showSuccessToast();
      e.target.reset(); // Reset form
    }, 1500);
  };

  const showSuccessToast = () => {
    toast.custom((t) => (
      <div
        className={`${t.visible ? "animate-enter" : "animate-leave"} 
                max-w-md w-full ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg rounded-lg 
                pointer-events-auto flex ring-1 ring-purple-500 ring-opacity-50 p-4`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <FiCheckCircle
              className={`h-6 w-6 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </div>
          <div className="ml-3 flex-1">
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Form submitted successfully!
            </p>
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Our team will get back to you within 24 hours.
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => toast.dismiss(t.id)}
              className={`rounded-md inline-flex ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              } focus:outline-none`}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    ));
  };

  // Company logos with their respective image URLs
  const companies = [
    {
      name: "",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      name: "",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      name: "",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    },
    {
      name: "",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    },
  ];

  return (
    <div
      className={`min-h-screen pt-8 transition-colors duration-500 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-gray-800"
      }`}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row p-6 md:p-16 gap-10 max-w-7xl mx-auto">
        {/* Left Section: Form */}
        <div
          className={`shadow-xl rounded-2xl p-8 w-full md:w-1/2 transition-all duration-300 transform hover:shadow-2xl ${
            isDarkMode
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-white text-gray-900 border border-gray-100"
          }`}
        >
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Contact Our Team
          </h2>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Have questions? We're here to help!
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <FiUser
                  className={`absolute left-3 top-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="First Name *"
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
              <div className="relative flex-1">
                <FiUser
                  className={`absolute left-3 top-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <FiMail
                  className={`absolute left-3 top-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Work Email *"
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
              <div className="relative flex-1">
                <FiBriefcase
                  className={`absolute left-3 top-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Job Title"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="relative">
              <FiPhone
                className={`absolute left-3 top-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="tel"
                placeholder="Phone number *"
                className={`${inputClass} pl-10`}
                required
              />
            </div>

            <div className="">
              <div className="relative flex-1"></div>
              <select className={`${inputClass} cursor-pointer`} required>
                <option value="">Company Size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>
            </div>

            <div className="relative">
              <FiHelpCircle
                className={`absolute left-3 top-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <textarea
                placeholder="What would you like to manage with babelforge.com? *"
                className={`${inputClass} h-28 pl-10 resize-y`}
                required
              />
            </div>

            <div className="relative">
              <FiHelpCircle
                className={`absolute left-3 top-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <textarea
                placeholder="How can our team help you?"
                className={`${inputClass} h-28 pl-10 resize-y`}
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className={`mt-1 h-4 w-4 rounded ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-400"
                    : "border-gray-300 text-purple-600 focus:ring-purple-200"
                }`}
                required
              />
              <label className="text-sm">
                Accept terms and conditions
                <br />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  By clicking submit, I acknowledge babelforge.com Privacy
                  Policy
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 
                                rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.01] 
                                shadow-md flex items-center justify-center gap-2 ${
                                  isSubmitting ? "opacity-80" : ""
                                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Submit
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Section: Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Align, collaborate, and gain visibility into your work in one
            connected space
          </h2>

          <div className="space-y-8">
            <div
              className={`flex gap-5 p-5 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750"
                  : "bg-white hover:bg-gray-50 shadow-md"
              }`}
            >
              <div
                className={`p-3 h-full rounded-full ${
                  isDarkMode ? "bg-purple-900" : "bg-purple-100"
                }`}
              >
                <FiMail
                  className={`text-xl ${
                    isDarkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`font-bold text-lg mb-1 ${
                    isDarkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                >
                  Across 200+ countries
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Meet with a product consultant to see how babelforge.com can
                  fit your exact business needs
                </p>
              </div>
            </div>

            <div
              className={`flex gap-5 p-5 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750"
                  : "bg-white hover:bg-gray-50 shadow-md"
              }`}
            >
              <div
                className={`p-3 h-full  rounded-full ${
                  isDarkMode ? "bg-pink-900" : "bg-pink-100"
                }`}
              >
                <FiBriefcase
                  className={`text-xl ${
                    isDarkMode ? "text-pink-300" : "text-pink-600"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`font-bold text-lg mb-1 ${
                    isDarkMode ? "text-pink-300" : "text-pink-600"
                  }`}
                >
                  225k+ paying customers
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Explore our tailored pricing plans based on your goals and
                  priorities
                </p>
              </div>
            </div>

            <div
              className={`flex gap-5 p-5 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-750"
                  : "bg-white hover:bg-gray-50 shadow-md"
              }`}
            >
              <div
                className={`p-3 h-full   rounded-full ${
                  isDarkMode ? "bg-blue-900" : "bg-blue-100"
                }`}
              >
                <FiHelpCircle
                  className={`text-xl ${
                    isDarkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`font-bold text-lg mb-1 ${
                    isDarkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  Serving 200+ industries
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Boost productivity from day one by building your team's ideal
                  workflow
                </p>
              </div>
            </div>
          </div>

          <div
            className={`mt-10 p-6 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
              Trusted by 225,000+ customers, from startups to enterprises
            </p>
            <div className="flex flex-wrap gap-6 items-center justify-between">
              {companies.map((company, index) => (
                <div key={index} className="flex items-center">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-5 w-auto object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/40?text=" +
                        company.name[0];
                    }}
                  />
                  <span className="ml-2 text-sm font-medium">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
