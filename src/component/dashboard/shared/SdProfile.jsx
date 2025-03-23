"use client";

import { useEffect, useContext } from "react";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUserEdit,
  FaWallet,
  FaGavel,
  FaTrophy,
  FaHistory,
  FaChartLine,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

import coverImageURL from "../../../assets/pppp.jpg";
import ThemeContext from "../../Context/ThemeContext";

export default function SdProfile() {
  const { isDarkMode } = useContext(ThemeContext);

  const handleUpdateProfile = () => {
    alert("Update Profile button clicked!");
  };

  const formData = {
    name: "John Doe",
    email: "johndoe@example.com",
    photoURL: "https://i.ibb.co.com/HfX42fDm/images.jpg",
    walletBalance: 500,
    winBid: "Vintage Car",
    totalBids: 2,
    profileProgress: 85,
    location: "New York, USA",
    phone: "(123) 456-7890",
    bidHistory: [
      { item: "Vintage Watch", bidAmount: 100, bidDate: "2025-03-01" },
      { item: "Antique Vase", bidAmount: 200, bidDate: "2025-02-25" },
      { item: "Luxury Watch", bidAmount: 250, bidDate: "2025-02-18" },
    ],
    yourBids: [
      { item: "Vintage Car", bidAmount: 150, status: "In Progress" },
      { item: "Modern Art Painting", bidAmount: 300, status: "Completed" },
    ],
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } transition-all duration-300 p-4 md:p-6`}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <div
          className={`${
            isDarkMode
              ? "bg-gray-800"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
          } rounded-lg shadow-xl mb-8 relative overflow-hidden`}
          data-aos="fade-down"
        >
          <div className="relative">
            {/* Profile Cover with background image */}
            <div
              className="w-full border-b h-[250px] rounded-t-lg overflow-hidden mb-6"
              style={{
                backgroundImage: `url(${coverImageURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: isDarkMode ? "brightness(0.7)" : "none",
              }}
            >
              <div
                className={`absolute inset-0 ${
                  isDarkMode
                    ? "bg-black/40"
                    : "bg-gradient-to-t from-purple-900/70 to-transparent"
                }`}
              ></div>
            </div>

            <div className="relative">
              {/* Profile Image */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
                <div className="relative group">
                  <img
                    src={formData.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="w-28 h-28 max-w-xs max-h-28 object-cover rounded-full border-4 border-purple-500 shadow-lg transition-all duration-300 group-hover:border-purple-300"
                  />
                  {/* Update Profile Icon */}
                  <button
                    onClick={handleUpdateProfile}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-all duration-300 transform scale-0 group-hover:scale-100"
                    aria-label="Edit profile"
                  >
                    <FaUserEdit className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-center mt-20 pb-6">
              {/* User Name */}
              <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <FaUser className="text-purple-300" />
                {formData.name}
              </h2>

              {/* Profile Progress */}
              <div className="mt-3 mb-4">
                <p className="text-white text-sm mb-1">
                  Profile Completion: {formData.profileProgress}%
                </p>
                <div className="w-48 h-2 bg-gray-700 rounded-full mt-1 mx-auto overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${formData.profileProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Display Additional Info */}
              <div className="py-3 text-white space-y-2 text-center">
                <p className="flex items-center justify-center gap-2">
                  <FaEnvelope className="text-purple-300" /> {formData.email}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6">
                  <p className="flex items-center justify-center gap-2">
                    <FaMapMarkerAlt className="text-purple-300" />{" "}
                    {formData.location}
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <FaPhone className="text-purple-300" /> {formData.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Wallet Balance */}
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-purple-50"
            } rounded-xl p-6 shadow-lg transition-all duration-300 transform hover:scale-102 relative overflow-hidden`}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-10 rounded-full -mr-6 -mt-6"></div>
            <div className="flex items-center mb-4">
              <div
                className={`p-3 rounded-full mr-4 ${
                  isDarkMode ? "bg-purple-900" : "bg-purple-100"
                }`}
              >
                <FaWallet
                  className={`text-2xl ${
                    isDarkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Wallet Balance
              </h3>
            </div>
            <p
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? "text-purple-300" : "text-purple-600"
              }`}
            >
              ${formData.walletBalance}
            </p>
            <button
              className={`px-6 py-2 rounded-lg shadow-md w-full transition-all duration-300 ${
                isDarkMode
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Add Funds
            </button>
          </div>

          {/* Total Bids */}
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-purple-50"
            } rounded-xl p-6 shadow-lg transition-all duration-300 transform hover:scale-102 relative overflow-hidden`}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500 opacity-10 rounded-full -mr-6 -mt-6"></div>
            <div className="flex items-center mb-4">
              <div
                className={`p-3 rounded-full mr-4 ${
                  isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
                }`}
              >
                <FaGavel
                  className={`text-2xl ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-600"
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Total Bids Placed
              </h3>
            </div>
            <p
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              {formData.totalBids}
            </p>
            <div className="flex items-center">
              <FaHistory
                className={`mr-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Last bid placed 2 days ago
              </span>
            </div>
          </div>

          {/* Winning Bid */}
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-purple-50"
            } rounded-xl p-6 shadow-lg transition-all duration-300 transform hover:scale-102 relative overflow-hidden`}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500 opacity-10 rounded-full -mr-6 -mt-6"></div>
            <div className="flex items-center mb-4">
              <div
                className={`p-3 rounded-full mr-4 ${
                  isDarkMode ? "bg-amber-900" : "bg-amber-100"
                }`}
              >
                <FaTrophy
                  className={`text-2xl ${
                    isDarkMode ? "text-amber-300" : "text-amber-600"
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Winning Bid
              </h3>
            </div>
            <p
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? "text-amber-300" : "text-amber-600"
              }`}
            >
              {formData.winBid}
            </p>
            <div className="flex items-center">
              <FaChartLine
                className={`mr-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Won against 5 other bidders
              </span>
            </div>
          </div>
        </div>

        {/* Bid History & Your Bids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bid History */}
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg overflow-hidden`}
            data-aos="fade-right"
          >
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-purple-600"
              } py-4 px-6`}
            >
              <h3 className="text-xl font-semibold text-white">Bid History</h3>
            </div>
            <div className="p-6">
              {formData.bidHistory.map((bid, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 ${
                    index !== formData.bidHistory.length - 1 ? "border-b" : ""
                  } ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } transition-all duration-300 hover:bg-opacity-50 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-50"
                  } rounded-lg mb-2`}
                >
                  <div
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {bid.item}
                  </div>
                  <div className="flex justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0">
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {bid.bidDate}
                    </div>
                    <div
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      ${bid.bidAmount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Bids */}
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-lg overflow-hidden`}
            data-aos="fade-left"
          >
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-indigo-600"
              } py-4 px-6`}
            >
              <h3 className="text-xl font-semibold text-white">
                Your Active Bids
              </h3>
            </div>
            <div className="p-6">
              {formData.yourBids.map((bid, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 ${
                    index !== formData.yourBids.length - 1 ? "border-b" : ""
                  } ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } transition-all duration-300 hover:bg-opacity-50 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-indigo-50"
                  } rounded-lg mb-2`}
                >
                  <div
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {bid.item}
                  </div>
                  <div className="flex justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0">
                    <div
                      className={`text-sm px-2 py-1 rounded-full ${
                        bid.status === "In Progress"
                          ? isDarkMode
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                          : isDarkMode
                          ? "bg-green-900/50 text-green-300"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {bid.status}
                    </div>
                    <div
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      ${bid.bidAmount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
