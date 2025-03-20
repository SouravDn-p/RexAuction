import React, { useState } from "react";
import { FaUserEdit, FaWallet, FaGavel, FaTrophy, FaSearch } from "react-icons/fa";
import coverImageURL from "../../../assets/auction2.jpg";

export default function AuctionProfile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpdateProfile = () => {
    alert("Update Profile button clicked!"); // Replace with your logic
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formData = {
    name: "John Doe",
    email: "johndoe@example.com", // Add email
    photoURL: "https://i.ibb.co.com/bm0P3kG/boy2.jpg",
    walletBalance: 500,
    winBid: "Vintage Car",
    totalBids: 2,
    profileProgress: 85, // Profile completeness percentage
    location: "New York, USA", // Additional info
    phone: "(123) 456-7890", // Additional info
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800"
      } transition-all duration-300`}
    >
    {/* Sticky Navbar with Blur on Scroll */}
<div className="sticky top-0 z-10 bg-white/60 backdrop-blur-md shadow-md p-4">
  <div className="container flex justify-between items-center">
    {/* Navbar Left: Search */}
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="p-2 rounded-lg border border-gray-300"
      />
      <FaSearch className="text-xl text-gray-500" />
    </div>

    {/* Navbar Right: User Profile */}
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <img
          src={formData.photoURL}
          alt="User Profile"
          className="w-10 h-10 rounded-full border-2 border-purple-500"
        />
        <span className="font-semibold">{formData.name}</span>
      </div>
    </div>
  </div>
</div>


      <div className="container mx-auto p-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] p-3 rounded-lg shadow-lg mb-8 relative">
          <div className="relative">
            {/* Profile Cover with background image */}
            <div
              className="w-full h-32 rounded-lg overflow-hidden mb-6"
              style={{
                backgroundImage: `url(${coverImageURL})`, // Add the URL for the cover image here
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            {/* Profile Image */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
              <img
                src={formData.photoURL}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Welcome, {formData.name}</h2>
              <p className="text-white">Profile Progress: {formData.profileProgress}%</p>
              <div className="w-48 h-2 bg-white rounded-full mt-2 mx-auto">
                <div
                  className="h-full bg-purple-300 rounded-full"
                  style={{ width: `${formData.profileProgress}%` }}
                ></div>
              </div>
              {/* Display Additional Info */}
              <div className="mt-4 text-white">
                <p>Email: {formData.email}</p>
                <p>Location: {formData.location}</p>
                <p>Phone: {formData.phone}</p>
              </div>
            </div>
            {/* Update Profile Button */}
            <button
              onClick={handleUpdateProfile}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-md"
            >
              <FaUserEdit className="text-xl" />
              <span className="font-semibold">Update Profile</span>
            </button>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-r from-[#6ee7b7] to-[#3b82f6] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <FaWallet className="text-3xl text-white" />
              <h3 className="text-lg font-semibold text-white">Wallet Balance</h3>
            </div>
            <p className="text-3xl font-bold text-white">${formData.walletBalance}</p>
            <button className="mt-4 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-md">
              Add Funds
            </button>
          </div>

          {/* Total Bids */}
          <div className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <FaGavel className="text-3xl text-white" />
              <h3 className="text-lg font-semibold text-white">Total Bids Placed</h3>
            </div>
            <p className="text-3xl font-bold text-white">{formData.totalBids}</p>
          </div>

          {/* Winning Bid */}
          <div className="bg-gradient-to-r from-[#ec4899] to-[#f43f5e] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <FaTrophy className="text-3xl text-white" />
              <h3 className="text-lg font-semibold text-white">Winning Bid</h3>
            </div>
            <p className="text-2xl font-bold text-white">{formData.winBid}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
