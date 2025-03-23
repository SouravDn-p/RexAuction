import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUserEdit,
  FaWallet,
  FaGavel,
  FaTrophy,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css"; 

import coverImageURL from "../../../assets/pppp.jpg";

export default function AuctionProfile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpdateProfile = () => {
    alert("Update Profile button clicked!");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } transition-all duration-300`}
    >
      <div className="container mx-auto ">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-lg shadow-lg mb-8 relative">
          <div className="relative">
            {/* Profile Cover with background image */}
            <div
              className="w-full border-b h-[250px] rounded-t-lg overflow-hidden mb-6"
              style={{
                backgroundImage: `url(${coverImageURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="relative">
              {/* Profile Image */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
                <img
                  src={formData.photoURL}
                  alt="Profile Picture"
                  className="w-28 h-28 max-w-xs max-h-28 object-cover rounded-full border-4 border-purple-800"
                />
                {/* Update Profile Icon */}
                <button
                  onClick={handleUpdateProfile}
                  className="absolute top-[85px] right-[33px] p-2 rounded-full shadow-lg hover:bg-black transition-all duration-300"
                >
                  <FaUserEdit className="text-white text-xl" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="text-center mt-20">
              {/* User Name */}
              <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <FaUser className="text-purple-300" />
                {formData.name}
              </h2>

              {/* Profile Progress */}
              <p className="text-white">
                Profile Progress: {formData.profileProgress}%
              </p>
              <div className="w-48 h-2 bg-white rounded-full mt-2 mx-auto">
                <div
                  className="h-full bg-purple-300 rounded-full"
                  style={{ width: `${formData.profileProgress}%` }}
                ></div>
              </div>

              {/* Display Additional Info */}
              <div className="py-5 text-white space-y-2 text-center">
                <p className="flex items-center justify-center gap-2">
                  <FaEnvelope className="text-purple-300" /> {formData.email}
                </p>
                <div className="flex justify-center gap-6">
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
<div className="grid grid-cols-1 mt-16 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
  {/* Wallet Balance */}
  <div
    className="bg-purple-900 p-4 sm:p-5 md:p-6 shadow-md hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 relative"
    data-aos="fade-up"
  >
    <div className="absolute top-[-15%] left-1/2 transform -translate-x-1/2 mb-3 sm:mb-4 z-10">
      <FaWallet className="text-4xl border-purple-500 sm:text-5xl bg-purple-200 border rounded-full p-2 text-purple-black" />
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-2">
      Wallet Balance
    </h3>
    <p className="text-2xl sm:text-3xl font-bold text-white text-center">
      ${formData.walletBalance}
    </p>
    <button className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-md w-full">
      Add Funds
    </button>
  </div>

  {/* Total Bids */}
  <div
    className="bg-purple-900 text-white p-4 sm:p-5 md:p-6 shadow-md hover:bg-purple-800 transition-all duration-300 transform hover:scale-105 relative"
    data-aos="fade-up"
  >
    <div className="absolute top-[-15%] left-1/2 transform -translate-x-1/2 mb-3 sm:mb-4 z-10">
      <FaGavel className="text-4xl border-purple-500 sm:text-5xl bg-purple-200 border rounded-full p-2 text-yellow-700" />
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
      Total Bids Placed
    </h3>
    <p className="text-2xl sm:text-3xl font-bold text-center">
      {formData.totalBids}
    </p>
  </div>

  {/* Winning Bid */}
  <div
    className="bg-purple-900 p-4 sm:p-5 md:p-6 shadow-md hover:bg-gradient-to-r hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 relative"
    data-aos="fade-up"
  >
    <div className="absolute top-[-15%] left-1/2 transform -translate-x-1/2 mb-3 sm:mb-4 z-10">
      <FaTrophy className="text-4xl sm:text-5xl border-purple-500 bg-purple-200 border rounded-full p-2 text-orange-900" />
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-2">
      Winning Bid
    </h3>
    <p className="text-2xl sm:text-3xl font-bold text-white text-center">
      {formData.winBid}
    </p>
  </div>
</div>


        {/* Bid History & Your Bids */}
        <div className="flex bg-purple-300/80 justify-between">
          {/* Bid History */}
          <div className="w-1/2 p-6 rounded-lg mb-8 h-full border-r border-gray-500">
            <h3 className="text-2xl font-semibold text-center mb-4">
              Bid History
            </h3>
            <div className="space-y-4 h-full flex flex-col justify-between">
              {formData.bidHistory.map((bid, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border-b border-gray-400"
                >
                  <div className="text-lg">{bid.item}</div>
                  <div className="text-sm text-gray-600">{bid.bidDate}</div>
                  <div className="text-xl font-bold">${bid.bidAmount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Bids */}
          <div className="w-1/2 p-6 rounded-lg h-full">
            <h3 className="text-2xl font-semibold text-center mb-4">
              Your Bids
            </h3>
            <div className="space-y-4 h-full flex flex-col justify-between">
              {formData.yourBids.map((bid, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border-gray-400 border-b"
                >
                  <div className="text-lg">{bid.item}</div>
                  <div className="text-sm text-gray-600">{bid.status}</div>
                  <div className="text-xl font-bold">${bid.bidAmount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
