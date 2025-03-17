import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { FaSun, FaMoon, FaWallet, FaGavel, FaTrophy, FaBell, FaCalendarAlt, FaUserEdit } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Add Filler plugin for gradient background
);

export default function AuctionProfile() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpdateProfile = () => {
    alert("Update Profile button clicked!"); // Replace with your logic
  };

  const formData = {
    name: "John Doe",
    photoURL: "https://i.ibb.co.com/bm0P3kG/boy2.jpg",
    walletBalance: 500,
    bidHistory: [
      { auction: "Vintage Car", bidAmount: 200, date: "2025-02-15" },
      { auction: "Antique Vase", bidAmount: 300, date: "2025-02-18" },
    ],
    winBid: "Vintage Car",
    totalBids: 2,
    paymentHistory: [
      { amount: 200, date: "2025-02-15" },
      { amount: 300, date: "2025-02-18" },
    ],
    recentActivity: [
      { type: "Bid", description: "Placed a bid on Vintage Car", date: "2025-02-15" },
      { type: "Payment", description: "Paid $200 for Vintage Car", date: "2025-02-15" },
      { type: "Win", description: "Won Vintage Car", date: "2025-02-15" },
    ],
    notifications: [
      { message: "Your bid on Antique Vase was outbid", date: "2025-02-18" },
      { message: "Payment of $300 was successful", date: "2025-02-18" },
    ],
    upcomingAuctions: [
      { name: "Rare Painting", date: "2025-03-01" },
      { name: "Classic Watch", date: "2025-03-05" },
    ],
    profileProgress: 85, // Profile completeness percentage
  };

  // Chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Bids Placed",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "#8b5cf6",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.4)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        backgroundColor: "#6d28d9",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#8b5cf6",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          color: isDarkMode ? "#fff" : "#6b7280", // Dynamic tick color
        },
      },
      y: {
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)", // Dynamic grid color
        },
        ticks: {
          color: isDarkMode ? "#fff" : "#6b7280", // Dynamic tick color
        },
      },
    },
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800"
      } transition-all duration-300`}
    >
      <div className="container mx-auto p-8">
        
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] p-8 rounded-lg shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img
                src={formData.photoURL}
                alt="Profile Picture"
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div>
                <h2 className="text-3xl font-bold text-white">Welcome, {formData.name}</h2>
                <p className="text-white">Profile Progress: {formData.profileProgress}%</p>
                <div className="w-48 h-2 bg-white rounded-full mt-2">
                  <div
                    className="h-full bg-purple-300 rounded-full"
                    style={{ width: `${formData.profileProgress}%` }}
                  ></div>
                </div>
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

        {/* Bidding Trends Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Bidding Trends</h3>
          <div className="h-64"> {/* Reduced height */}
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activity and Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              {formData.recentActivity.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-white">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-gray-100">{item.description}</span>
                  <span className="text-sm text-gray-200">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notifications */}
          <div className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <FaBell className="text-2xl text-white" />
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
            <ul className="space-y-3">
              {formData.notifications.map((item, index) => (
                <li key={index} className="flex justify-between items-center text-white">
                  <span className="font-medium">{item.message}</span>
                  <span className="text-sm text-gray-200">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming Auctions */}
        <div className="bg-gradient-to-r from-[#34d399] to-[#10b981] p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <FaCalendarAlt className="text-2xl text-white" />
            <h3 className="text-lg font-semibold text-white">Upcoming Auctions</h3>
          </div>
          <ul className="space-y-3">
            {formData.upcomingAuctions.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-white">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-200">{item.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}