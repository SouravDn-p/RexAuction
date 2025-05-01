import { useContext, useEffect, useState, useMemo } from "react";
import {
  FaFire,
  FaSearch,
  FaSadTear,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ThemeContext from "../../component/Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import image from "../../assets/bg/banner-bg-image.jpg";

const HotAuction = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [countdowns, setCountdowns] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const itemsPerPage = 4;
  const axiosSecure = useAxiosSecure();

  const {
    data: auctionDatas = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      return res.data || [];
    },
  });

  // Memoize auctionData to prevent new reference on every render
  const auctionData = useMemo(() => {
    return auctionDatas.filter(
      (auction) => (auction.topBidders?.length || 0) >= 4
    );
  }, [auctionDatas]);

  useEffect(() => {
    if (!auctionData?.length) return;

    const updateCountdowns = () => {
      const now = new Date();
      const updated = {};

      auctionData.forEach((item) => {
        if (!item.startTime || !item.endTime || !item._id) return;

        const startTime = new Date(item.startTime);
        const endTime = new Date(item.endTime);

        if (now < startTime) {
          updated[item._id] = {
            time: Math.max(0, Math.floor((startTime - now) / 1000)),
            isStarting: true,
          };
        } else if (now >= startTime && now < endTime) {
          updated[item._id] = {
            time: Math.max(0, Math.floor((endTime - now) / 1000)),
            isStarting: false,
          };
        } else {
          updated[item._id] = { time: 0, isStarting: false };
        }
      });

      // Use functional update to avoid unnecessary re-renders
      setCountdowns((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(updated)) {
          return updated;
        }
        return prev;
      });
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [auctionData]);

  const filteredAuctions = useMemo(() => {
    const accepted = auctionData.filter(
      (item) =>
        item.status === "Accepted" && new Date(item.endTime) > new Date()
    );

    if (!searchTerm.trim()) return accepted;

    const term = searchTerm.toLowerCase();
    return accepted.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
    );
  }, [auctionData, searchTerm]);

  const pageCount = Math.ceil(filteredAuctions.length / itemsPerPage);
  const displayedAuctions = filteredAuctions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const handleNext = () => {
    setCurrentPage((prev) => (prev < pageCount - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const formatTime = (countdown) => {
    const { time: seconds = 0, isStarting = false } = countdown || {};
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${isStarting ? "to start" : "left"}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${isStarting ? "to start" : "left"}`;
    }
    return `${minutes}m ${secs}s ${isStarting ? "to start" : "left"}`;
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-purple-500 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-purple-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center bg-red-100 text-red-600 p-4 rounded-full mb-4">
            <FaSadTear className="text-3xl" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Failed to load auctions</h3>
          <p className="text-gray-600 mb-6">Please try again later</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={` w-full overflow-x-hidden ${
        isDarkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <section className="w-full max-w-screen-xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 w-full">
          <div className="flex items-center">
            <FaFire className="text-orange-500 mr-3 text-4xl" />
            <h2
              className={`text-4xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Hot Auctions
            </h2>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search auctions..."
              className={`w-full py-3 px-5 pr-12 rounded-full focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500"
                  : "bg-white text-gray-800 placeholder-gray-500 focus:ring-purple-500 shadow-sm"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {!filteredAuctions.length && (
          <div className="text-center py-20 w-full">
            <div className="inline-flex items-center justify-center bg-yellow-100 text-yellow-600 p-6 rounded-full mb-6">
              <FaSadTear className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              {searchTerm ? "No matching auctions found" : "No active auctions"}
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try different search terms"
                : "Check back later for new auctions"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {filteredAuctions.length > 0 && (
          <div className="mb-12 w-full relative">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 text-2xl rounded-full flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600 shadow-lg"
                  : "bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
              } transition-all duration-300 transform ${
                currentPage === 0
                  ? "opacity-0 scale-0"
                  : "opacity-100 scale-100"
              }`}
              style={{ left: "0.5rem" }}
            >
              <FaChevronLeft className="ml-1" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {displayedAuctions.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                  onMouseEnter={() => setHoveredCard(item._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative h-96 rounded-xl overflow-hidden shadow-lg transition-all duration-300 w-full ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="relative h-full w-full">
                    <img
                      src={item.images?.[0] || image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = image;
                      }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-white/80">Current Bid</p>
                          <p className="text-xl font-bold text-white">
                            $
                            {item.currentBid?.toLocaleString() ||
                              item.startingPrice?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center bg-purple-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          <FaClock className="mr-1" />
                          {formatTime(countdowns[item._id])}
                        </div>
                      </div>
                    </div>

                    {hoveredCard === item._id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute inset-0 p-6 flex flex-col justify-between ${
                          isDarkMode ? "bg-gray-900/90" : "bg-black/80"
                        }`}
                      >
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {item.name}
                          </h3>
                          <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full mb-3">
                            {item.category}
                          </span>
                          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                            {item.description || "No description available"}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-400">
                                Starting Price
                              </p>
                              <p className="text-white font-medium">
                                ${item.startingPrice?.toLocaleString()}
                              </p>
                            </div>
                            <div>{/* Add additional info if needed */}</div>
                          </div>
                        </div>

                        <Link
                          to={`/liveBid/${item._id}`}
                          className="w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition font-medium"
                        >
                          Place Bid
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === pageCount - 1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 text-2xl rounded-full flex items-center justify-center ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600 shadow-lg"
                  : "bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
              } transition-all duration-300 transform ${
                currentPage === pageCount - 1
                  ? "opacity-0 scale-0"
                  : "opacity-100 scale-100"
              }`}
              style={{ right: "0.5rem" }}
            >
              <FaChevronRight className="mr-1" />
            </button>

            {pageCount > 1 && (
              <div className="flex justify-center mt-8 w-full">
                <div className="flex space-x-3">
                  {Array.from({ length: pageCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        currentPage === index
                          ? "bg-purple-600 scale-125"
                          : isDarkMode
                          ? "bg-gray-600"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HotAuction;
