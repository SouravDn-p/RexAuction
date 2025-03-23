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
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
      </div>
    </div>
  );
}
