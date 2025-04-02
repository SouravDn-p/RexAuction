import React, { useContext, useEffect, useState } from "react";
import img from "../../assets/LiveBidAuctionDetails.jpg";
import { GiSelfLove } from "react-icons/gi";
import { FaShare } from "react-icons/fa6";
import { IoFlagOutline } from "react-icons/io5";
import { MdVerifiedUser } from "react-icons/md";
import { AiFillCrown } from "react-icons/ai";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContexts } from "../../providers/AuthProvider";
import LoadingSpinner from "../LoadingSpinner";
import ThemeContext from "../Context/ThemeContext";

export default function LiveBid() {
  const { user, loading, setLoading, liveBid, setLiveBid } = useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const [countdown, setCountdown] = useState(0); // Changed to countdown and initialized to 0
  const { isDarkMode } = useContext(ThemeContext);
  const [bidAmount, setBidAmount] = useState("");

  const topBidders = [
    {
      name: "John Doe",
      bid: "$8000.00",
      icon: <AiFillCrown className="text-yellow-500 text-2xl" />,
    },
    {
      name: "Jane Smith",
      bid: "$7500.00",
      icon: <AiFillCrown className="text-gray-500 text-2xl" />,
    },
    {
      name: "David Johnson",
      bid: "$7000.00",
      icon: <AiFillCrown className="text-orange-500 text-2xl" />,
    },
  ];

  // Fetch auction data
  useEffect(() => {
    setLoading(true);
    axiosPublic.get(`/auction/${id}`).then((res) => {
      setLiveBid(res.data);
      setLoading(false);
    });
  }, [id, axiosPublic, setLiveBid, setLoading]);

  // Set up countdown timer
  useEffect(() => {
    if (!liveBid || !liveBid.endTime) return;

    const endTime = new Date(liveBid.endTime).getTime();
    if (isNaN(endTime)) return; // Handle invalid endTime

    const calculateCountdown = () => {
      const currentTime = new Date().getTime();
      const remainingSeconds = Math.max(0, Math.floor((endTime - currentTime) / 1000));
      setCountdown(remainingSeconds);
    };

    // Set initial countdown
    calculateCountdown();

    // Update every second
    const interval = setInterval(calculateCountdown, 1000);

    // Cleanup interval on unmount or when liveBid changes
    return () => clearInterval(interval);
  }, [liveBid]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Ended";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${secs}s`;
    }
  };

  const handleBidIncrement = (amount) => {
    const current = liveBid?.currentBid || liveBid?.startingPrice || 0;
    setBidAmount((parseFloat(current) + amount).toFixed(2));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen mt-20 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`w-11/12 mx-auto py-12 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side (Images & Details) */}
          <div className="lg:w-2/3 w-full space-y-6">
            {/* Main Image */}
            <div className="w-full rounded-xl overflow-hidden shadow-lg">
              <img
                src={liveBid?.images?.[0] || img}
                className="w-full h-96 object-cover transition-transform hover:scale-105 duration-300"
                alt="Auction Item"
                onError={(e) => {
                  e.target.src = img;
                }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((_, index) => (
                <img
                  key={index}
                  src={liveBid?.images?.[index + 1] || img}
                  className="rounded-lg shadow-md hover:scale-105 transition h-40 w-full object-cover"
                  alt={`Thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.target.src = img;
                  }}
                />
              ))}
            </div>

            {/* Product Name & Description */}
            <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {liveBid?.name}
                </h3>
                <div className="flex items-center gap-3 text-xl">
                  <GiSelfLove className={`cursor-pointer hover:text-red-500 transition ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                  <FaShare className={`cursor-pointer hover:text-blue-500 transition ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                  <IoFlagOutline className={`cursor-pointer hover:text-orange-500 transition ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                </div>
              </div>
              <h3 className="text-xl font-semibold pt-4">Description:</h3>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-2`}>
                {liveBid?.description || "No description available"}
              </p>
            </div>

            {/* Product Details */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div>
                <h3 className={`${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Condition:</h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{liveBid?.condition || "N/A"}</p>
              </div>
              <div>
                <h3 className={`${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Year</h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{liveBid?.itemYear || "N/A"}</p>
              </div>
              <div>
                <h3 className={`${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Starting Price:</h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>${liveBid?.startingPrice?.toLocaleString() || "0"}</p>
              </div>
              <div>
                <h3 className={`${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>Reference</h3>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  #{liveBid?.reference || "N/A"}
                </p>
              </div>
            </div>

            {/* Seller Details */}
            <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-semibold pb-4">Seller Information</h3>
              <div className="flex gap-4 items-center">
                <img
                  src={liveBid?.sellerPhotoUrl || img}
                  className="w-16 h-16 rounded-full object-cover"
                  alt="Seller"
                  onError={(e) => {
                    e.target.src = img;
                  }}
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {liveBid?.sellerDisplayName || "Anonymous"}
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                    {liveBid?.sellerEmail}
                  </p>
                  <p className="text-green-500 flex items-center text-sm mt-1">
                    <MdVerifiedUser className="mr-1" /> Verified seller
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side (Bidding & Auction Info) */}
          <div className="lg:w-1/3 w-full space-y-6">
            {/* Auction Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Timer Card */}
              <div
                className={`p-4 rounded-xl shadow-lg text-center transition hover:scale-[1.02] flex flex-col justify-center items-center h-full ${
                  formatTime(countdown) === "Ended"
                    ? "bg-red-100 text-red-800"
                    : isDarkMode
                    ? "bg-gray-800 border border-red-500"
                    : "bg-white border border-red-300"
                }`}
              >
                {formatTime(countdown) === "Ended" ? (
                  <h3 className="font-bold text-xl">Auction Ended</h3>
                ) : (
                  <>
                    <p className="text-lg font-semibold">Ends In</p>
                    <h3 className="font-bold text-2xl text-red-500">
                      {formatTime(countdown)}
                    </h3>
                  </>
                )}
              </div>

              {/* Current Bid Card */}
              <div
                className={`p-4 rounded-xl shadow-lg text-center transition hover:scale-[1.02] flex flex-col justify-center items-center h-full ${
                  isDarkMode ? "bg-gray-800 border border-purple-500" : "bg-white border border-purple-300"
                }`}
              >
                <p className="text-lg font-semibold">Current Bid</p>
                <h3
                  className={`font-bold text-2xl ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  ${liveBid?.currentBid?.toLocaleString() || liveBid?.startingPrice?.toLocaleString() || "0"}
                </h3>
              </div>
            </div>

            {/* Top Bidders */}
            <div className={`p-4 rounded-xl shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-bold mb-3">Top Bidders</h3>
              <div className="space-y-3">
                {topBidders.map((bidder, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
                  >
                    {bidder.icon}
                    <img
                      src={img}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="Bidder"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{bidder.name}</h3>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{bidder.bid}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bidding Form */}
            <div className={`p-5 rounded-xl shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-bold text-center mb-4">
                Place Your Bid
              </h3>

              {/* Bid Increment Buttons */}
              <div className="flex gap-3 mb-4">
                {[100, 200, 300].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleBidIncrement(amount)}
                    className={`flex-1 py-2 rounded-lg transition ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 border border-gray-600" : "bg-purple-100 hover:bg-purple-200 border border-purple-200"} text-purple-600 font-medium`}
                  >
                    +{amount}
                  </button>
                ))}
              </div>

              {/* Bid Input */}
              <div className="mb-4">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Enter bid (min $${(liveBid?.currentBid || liveBid?.startingPrice || 0) + 100})`}
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 border-gray-600 focus:ring-purple-500" : "bg-white border-gray-300 focus:ring-purple-400"} border`}
                />
              </div>

              {/* Bid Button */}
              <button
                className={`w-full py-3 rounded-lg font-semibold transition ${formatTime(countdown) === "Ended" ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"} text-white`}
                disabled={formatTime(countdown) === "Ended"}
              >
                {formatTime(countdown) === "Ended" ? "Auction Ended" : "Place Bid"}
              </button>
            </div>

            {/* Recent Bids */}
            <div className={`p-4 rounded-xl shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="text-xl font-bold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {topBidders.map((bidder, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <img
                      src={img}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="Bidder"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{bidder.name}</h3>
                        <span className={`text-sm font-semibold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                          {bidder.bid}
                        </span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {index === 0 ? "Just now" : `${index + 1} minutes ago`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}