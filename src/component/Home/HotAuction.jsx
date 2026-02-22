import { useContext, useEffect, useState, useMemo } from "react";
import {
  FaFire,
  FaGavel,
  FaSearch,
  FaSadTear,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaBolt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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
    data: auctionData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      console.log("Hot auction data:", res.data);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Countdown effect
  useEffect(() => {
    if (!auctionData?.length) return;

    const updateCountdowns = () => {
      const now = new Date();
      const updated = {};

      auctionData.forEach((item) => {
        if (!item.startTime || !item.endTime || !item._id) return;

        const startTime = new Date(item.startTime);
        const endTime = new Date(item.endTime);

        // Validate dates
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn("Invalid date for item:", item);
          return;
        }

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

      setCountdowns(updated);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [auctionData]);

  // Filter auctions - FIXED filtering logic
  const filteredAuctions = useMemo(() => {
    if (!auctionData.length) return [];

    const now = new Date();
    
    // More flexible status checking
    const accepted = auctionData.filter((item) => {
      // Check if end time is valid and in the future
      if (!item.endTime) return false;
      
      const endTime = new Date(item.endTime);
      if (isNaN(endTime.getTime())) return false;
      
      // Check if auction is still active
      if (endTime <= now) return false;
      
      // Check status - include multiple possible status values
      const validStatuses = ["Accepted", "Active", "Live", "approved"];
      return validStatuses.includes(item.status);
    });

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

  // Reset to first page when search changes
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
    if (!countdown) return "Ended";
    
    const { time: seconds = 0, isStarting = false } = countdown;
    if (seconds <= 0) return "Ended";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getTimeStatus = (countdown) => {
    if (!countdown || countdown.time <= 0) return "ended";
    if (countdown.isStarting) return "starting";
    if (countdown.time < 3600) return "ending-soon"; // Less than 1 hour
    return "active";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`w-full overflow-x-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <section className="w-full max-w-screen-xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center">
              <FaFire className="text-orange-500 mr-3 text-4xl" />
              <h2 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Hot Auctions
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-96 rounded-xl overflow-hidden shadow-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full overflow-x-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <section className="w-full max-w-screen-xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-flex items-center justify-center bg-red-100 text-red-600 p-6 rounded-full mb-6">
              <FaSadTear className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Failed to load auctions</h3>
            <p className="text-lg text-gray-600 mb-6">Please try again later</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Retry
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <section className="w-full max-w-screen-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 w-full">
          <div className="flex items-center">
            <div className="relative">
              <FaFire className="text-orange-500 mr-3 text-4xl" />
              {filteredAuctions.length > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-orange-300 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
            <div>
              <h2 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Hot Auctions
              </h2>
              <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {filteredAuctions.length} active auctions
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search auctions..."
              className={`w-full py-3 px-5 pr-12 rounded-full focus:outline-none focus:ring-2 transition-all ${
                isDarkMode
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 border border-gray-700"
                  : "bg-white text-gray-800 placeholder-gray-500 focus:ring-purple-500 shadow-md border border-gray-200"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* No results */}
        {!filteredAuctions.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 w-full"
          >
            <div className="inline-flex items-center justify-center bg-yellow-100 text-yellow-600 p-6 rounded-full mb-6">
              <FaSadTear className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              {searchTerm ? "No matching auctions found" : "No active auctions"}
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try different search terms or check back later"
                : "Check back later for new hot auctions"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* Auctions grid with pagination */}
        {filteredAuctions.length > 0 && (
          <div className="mb-12 w-full relative">
            {/* Previous button - hidden on mobile */}
            {pageCount > 1 && (
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 text-2xl rounded-full items-center justify-center ${
                  isDarkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700 shadow-lg border border-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100 shadow-lg border border-gray-200"
                } transition-all duration-300 transform ${
                  currentPage === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:scale-110"
                }`}
                style={{ left: '-1.5rem' }}
              >
                <FaChevronLeft />
              </button>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              <AnimatePresence mode="wait">
                {displayedAuctions.map((item) => {
                  const timeStatus = getTimeStatus(countdowns[item._id]);
                  
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.03 }}
                      onMouseEnter={() => setHoveredCard(item._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`relative h-96 rounded-xl overflow-hidden shadow-lg transition-all duration-300 w-full cursor-pointer ${
                        isDarkMode 
                          ? "bg-gray-800 border border-gray-700" 
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="relative h-full w-full">
                        {/* Image */}
                        <img
                          src={item.images?.[0] || image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = image;
                          }}
                        />

                        {/* Status badge */}
                        {timeStatus === "ending-soon" && (
                          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <FaBolt className="animate-pulse" /> Ending Soon
                          </div>
                        )}

                        {/* Bottom overlay with bid info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xs text-white/70">Current Bid</p>
                              <p className="text-2xl font-bold text-white">
                                ${item.currentBid?.toLocaleString() || item.startingPrice?.toLocaleString()}
                              </p>
                            </div>
                            <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                              timeStatus === "ending-soon"
                                ? "bg-red-500 text-white"
                                : timeStatus === "starting"
                                ? "bg-blue-500 text-white"
                                : "bg-purple-600 text-white"
                            }`}>
                              <FaClock className="mr-1" />
                              {formatTime(countdowns[item._id])}
                            </div>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <AnimatePresence>
                          {hoveredCard === item._id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-t from-black/95 via-black/80 to-black/60 backdrop-blur-sm"
                            >
                              <div>
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                  {item.name}
                                </h3>
                                <span className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full mb-3">
                                  {item.category}
                                </span>
                                <p className="text-gray-200 text-sm line-clamp-3 mb-4">
                                  {item.description || "No description available"}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-xs text-gray-400">Starting Price</p>
                                    <p className="text-white font-medium">
                                      ${item.startingPrice?.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">Total Bids</p>
                                    <p className="text-white font-medium">
                                      {item.bidCount || item.bids?.length || 0}
                                    </p>
                                  </div>
                                </div>

                                {item.seller && (
                                  <div className="flex items-center gap-2 mb-4">
                                    <img
                                      src={item.seller.photo || "https://via.placeholder.com/30"}
                                      alt={item.seller.name}
                                      className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-xs text-gray-300">
                                      {item.seller.name || "Anonymous Seller"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <Link
                                to={`/liveBid/${item._id}`}
                                className="w-full text-center bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-3 px-4 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
                              >
                                Place Bid Now
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Next button - hidden on mobile */}
            {pageCount > 1 && (
              <button
                onClick={handleNext}
                disabled={currentPage === pageCount - 1}
                className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 text-2xl rounded-full items-center justify-center ${
                  isDarkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700 shadow-lg border border-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100 shadow-lg border border-gray-200"
                } transition-all duration-300 transform ${
                  currentPage === pageCount - 1 ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:scale-110"
                }`}
                style={{ right: '-1.5rem' }}
              >
                <FaChevronRight />
              </button>
            )}

            {/* Mobile pagination dots */}
            {pageCount > 1 && (
              <div className="flex lg:hidden justify-center mt-8 w-full">
                <div className="flex space-x-3">
                  {Array.from({ length: pageCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentPage === index
                          ? "bg-purple-600 w-6"
                          : isDarkMode
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-gray-300 hover:bg-gray-400"
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