"use client";

import { useContext, useEffect, useState, useMemo } from "react";
import {
  FaFire,
  FaGavel,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSadTear,
  FaClock,
  FaHeart,
  FaRegHeart,
  FaBolt,
  FaTrophy,
  FaTag,
  FaRegClock,
} from "react-icons/fa";
import ThemeContext from "../../component/Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import image from "../../assets/Logos/register.jpg";
import LoadingSpinner from "../LoadingSpinner";

const Auction = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [favorites, setFavorites] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    "All",
    "Art",
    "Collectibles",
    "Electronics",
    "Vehicles",
    "Jewelry",
    "Fashion",
    "Real Estate",
    "Antiques",
  ];

  // Sync activeCategory with URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category && categories.includes(decodeURIComponent(category))) {
      setActiveCategory(decodeURIComponent(category));
    } else {
      setActiveCategory("All");
    }
  }, [location.search]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("auctionFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("auctionFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const {
    data: auctionData = [],
    isLoading,
    error,
    refetch, // Add refetch for debugging
  } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      console.log("Raw auction data from API:", res.data);
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Debug: Log the filtered results
  useEffect(() => {
    if (auctionData.length > 0) {
      console.log("Total auctions from API:", auctionData.length);
      
      // Log all statuses to see what's available
      const statuses = [...new Set(auctionData.map(item => item.status))];
      console.log("Available statuses in data:", statuses);
      
      // Log date ranges
      const now = new Date();
      auctionData.forEach(item => {
        console.log(`Auction ${item._id}:`, {
          name: item.name,
          status: item.status,
          startTime: item.startTime,
          endTime: item.endTime,
          isActive: new Date(item.endTime) > now,
          category: item.category
        });
      });
    }
  }, [auctionData]);

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

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(0);
    navigate(category === "All" ? "/auction" : `/auction?category=${encodeURIComponent(category)}`);
  };

  // Filter and search functionality - FIXED FILTERING
  const filteredAuctions = useMemo(() => {
    if (!auctionData || auctionData.length === 0) {
      console.log("No auction data available");
      return [];
    }

    const now = new Date();
    console.log("Current time for filtering:", now);
    
    // FIX 1: More lenient filtering - show all auctions first for debugging
    let filtered = auctionData.filter((item) => {
      // Check if endTime exists and is valid
      if (!item.endTime) {
        console.log("Item missing endTime:", item);
        return false;
      }

      const endTime = new Date(item.endTime);
      
      // FIX 2: Check if endTime is valid
      if (isNaN(endTime.getTime())) {
        console.log("Invalid endTime for item:", item);
        return false;
      }

      // FIX 3: More flexible status check - show auctions with any status first
      // Change this based on your actual status values
      const validStatuses = ["Accepted", "Active", "Live", "approved", "pending"];
      const hasValidStatus = validStatuses.includes(item.status);
      
      // Log items being filtered out
      if (endTime <= now) {
        console.log(`Auction ${item.name} filtered out: ended at ${endTime}`);
        return false;
      }
      
      if (!hasValidStatus) {
        console.log(`Auction ${item.name} filtered out: status ${item.status}`);
        return false;
      }

      return true;
    });

    console.log(`After date/status filter: ${filtered.length} auctions`);

    // Apply category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((item) => {
        const match = item.category === activeCategory;
        if (!match) {
          console.log(`Auction ${item.name} filtered out: category ${item.category} != ${activeCategory}`);
        }
        return match;
      });
      console.log(`After category filter: ${filtered.length} auctions`);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const match = 
          (item.name?.toLowerCase() || "").includes(term) ||
          (item.category?.toLowerCase() || "").includes(term) ||
          (item.description?.toLowerCase() || "").includes(term);
        
        if (!match) {
          console.log(`Auction ${item.name} filtered out: doesn't match search term "${term}"`);
        }
        return match;
      });
      console.log(`After search filter: ${filtered.length} auctions`);
    }

    console.log("Final filtered auctions:", filtered);
    return filtered;
  }, [auctionData, searchTerm, activeCategory]);

  const hasActiveAuctions = filteredAuctions.length > 0;
  const pageCount = Math.ceil(filteredAuctions.length / itemsPerPage);
  const displayedAuctions = filteredAuctions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, activeCategory]);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const formatTime = (countdown) => {
    if (!countdown) return "Auction Ended";
    
    const { time: seconds, isStarting } = countdown;
    if (seconds <= 0) return "Auction Ended";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${isStarting ? "to start" : "left"}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${isStarting ? "to start" : "left"}`;
    } else {
      return `${minutes}m ${secs}s ${isStarting ? "to start" : "left"}`;
    }
  };

  // Get time status for styling
  const getTimeStatus = (countdown) => {
    if (!countdown?.time || countdown.time <= 0) return "ended";
    const { time, isStarting } = countdown;

    if (isStarting) return "starting";
    if (time < 3600) return "ending-soon";
    return "active";
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Banner isDarkMode={isDarkMode} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} flex flex-col items-center justify-center`}>
        <Banner isDarkMode={isDarkMode} />
        <p className="text-lg font-semibold text-red-500 mt-8">
          Error loading auctions. Please try again later.
        </p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} max-sm:pt-8`}>
      <section>
        <Banner isDarkMode={isDarkMode} />

        <div id="auction-section" className="w-11/12 mx-auto py-10">
          {/* Debug Info - Remove in production */}
          {/* <div className="mb-4 p-4 bg-yellow-100 text-black rounded">
            <p>Total Auctions: {auctionData.length}</p>
            <p>Active Auctions: {filteredAuctions.length}</p>
            <p>Current Category: {activeCategory}</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded"
            >
              Refresh Data
            </button>
          </div> */}

          {/* Section Header */}
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <div className="relative">
                <FaFire className="text-orange-500 mr-2 text-3xl" />
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
              </div>
              <h2
                className={`text-3xl md:text-4xl font-bold ${
                  isDarkMode
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-500"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600"
                }`}
              >
                {activeCategory === "All"
                  ? "Discover Auctions"
                  : `${activeCategory} Auctions`}
              </h2>
            </div>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } text-center max-w-2xl mb-8 text-lg`}
            >
              {activeCategory === "All"
                ? "Explore our exclusive collection of premium items up for auction. Bid now and make them yours!"
                : `Browse our curated selection of ${activeCategory} items. Each piece has been carefully selected for its quality and uniqueness.`}
            </p>
          </motion.div>

          {/* Category Buttons */}
          <div className="flex overflow-x-auto pb-4 mb-8 snap-x scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            <div className="flex space-x-3 mx-auto">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative group whitespace-nowrap snap-start ${
                    activeCategory === category
                      ? isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20"
                        : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mx-auto mb-10 max-w-2xl">
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused
                  ? isDarkMode
                    ? "shadow-lg shadow-purple-500/20"
                    : "shadow-lg shadow-purple-500/10"
                  : "shadow-md"
              }`}
            >
              <input
                type="text"
                placeholder="Search auctions by name, category or description..."
                className={`w-full py-4 px-5 pr-12 rounded-xl focus:outline-none transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:border-purple-500"
                    : "bg-white text-gray-800 placeholder-gray-500 border border-gray-200 focus:border-purple-500"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                animate={{
                  scale: isSearchFocused ? 1.1 : 1,
                  rotate: isSearchFocused ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <FaSearch
                  className={`text-xl ${
                    isDarkMode ? "text-purple-400" : "text-purple-500"
                  }`}
                />
              </motion.div>
            </div>
            {searchTerm && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-lg mt-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Showing results for:{" "}
                <span className="font-semibold text-purple-500">
                  "{searchTerm}"
                </span>
                <button
                  onClick={() => setSearchTerm("")}
                  className={`ml-3 text-sm px-2 py-1 rounded-md ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Clear
                </button>
              </motion.p>
            )}
          </div>

          {/* No Auctions Found */}
          {!hasActiveAuctions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-center py-20 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } p-8 rounded-full mb-6 shadow-lg`}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <FaSadTear className="text-5xl text-yellow-500" />
                </motion.div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                {searchTerm
                  ? "No matching auctions found"
                  : auctionData.length === 0 
                  ? "No auctions available in the database"
                  : "No active auctions available"}
              </h3>
              <p
                className={`max-w-md mx-auto ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } text-lg`}
              >
                {searchTerm
                  ? "Try adjusting your search or check back later for new listings."
                  : auctionData.length === 0
                  ? "There are no auctions in the system yet. Please check back later."
                  : `No ${
                      activeCategory === "All" ? "" : activeCategory
                    } auctions are currently active. Please check back later.`}
              </p>
              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm("")}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-700 hover:to-purple-600 transition shadow-lg shadow-purple-500/20"
                >
                  Clear Search
                </motion.button>
              )}
              {auctionData.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => refetch()}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition shadow-lg shadow-blue-500/20"
                >
                  Refresh Data
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Auction Cards */}
          {hasActiveAuctions && (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-10">
                <AnimatePresence>
                  {displayedAuctions.map((item) => {
                    const timeStatus = getTimeStatus(countdowns[item._id]);
                    const countdown = countdowns[item._id];

                    return (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onHoverStart={() => setHoveredCard(item._id)}
                        onHoverEnd={() => setHoveredCard(null)}
                        className={`relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                          isDarkMode
                            ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                            : "bg-white border border-gray-200"
                        } shadow-lg hover:shadow-xl group`}
                      >
                        {/* Status Badge */}
                        <div
                          className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg ${
                            timeStatus === "ending-soon"
                              ? "bg-red-500/90 text-white"
                              : timeStatus === "starting"
                              ? "bg-blue-500/90 text-white"
                              : timeStatus === "ended"
                              ? "bg-gray-500/90 text-white"
                              : "bg-green-500/90 text-white"
                          }`}
                        >
                          {timeStatus === "ending-soon" ? (
                            <>
                              <FaBolt className="text-yellow-300" /> Ending Soon
                            </>
                          ) : timeStatus === "starting" ? (
                            <>
                              <FaRegClock /> Starting Soon
                            </>
                          ) : timeStatus === "ended" ? (
                            <>
                              <FaTrophy /> Auction Ended
                            </>
                          ) : (
                            <>
                              <FaTag /> Active Auction
                            </>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item._id);
                          }}
                          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all shadow-md ${
                            isDarkMode
                              ? "bg-gray-800/90 hover:bg-gray-700"
                              : "bg-white/90 hover:bg-white"
                          }`}
                        >
                          <motion.div
                            animate={
                              favorites.includes(item._id)
                                ? { scale: [1, 1.3, 1] }
                                : {}
                            }
                            transition={{ duration: 0.3 }}
                          >
                            {favorites.includes(item._id) ? (
                              <FaHeart className="text-red-500 text-xl" />
                            ) : (
                              <FaRegHeart
                                className={`text-xl ${
                                  isDarkMode ? "text-gray-200" : "text-gray-800"
                                }`}
                              />
                            )}
                          </motion.div>
                        </button>

                        {/* Image */}
                        <div className="relative h-52 w-full overflow-hidden flex-shrink-0">
                          <img
                            src={item.images?.[0] || image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = image;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Time Countdown */}
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <div
                              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 backdrop-blur-md ${
                                timeStatus === "ending-soon"
                                  ? "bg-red-500/40 text-white border border-red-500/50"
                                  : timeStatus === "starting"
                                  ? "bg-blue-500/40 text-white border border-blue-500/50"
                                  : timeStatus === "ended"
                                  ? "bg-gray-700/40 text-white border border-gray-700/50"
                                  : "bg-green-500/40 text-white border border-green-500/50"
                              } ${
                                hoveredCard === item._id
                                  ? "opacity-100 transform translate-y-0"
                                  : "opacity-0 transform translate-y-4"
                              }`}
                            >
                              <FaClock
                                className={
                                  timeStatus === "ending-soon" ? "animate-pulse" : ""
                                }
                              />
                              {formatTime(countdown)}
                            </div>
                          </div>
                        </div>

                        {/* Auction Details */}
                        <div
                          className={`p-4 flex-grow flex flex-col ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className="text-xl font-bold line-clamp-2 leading-tight"
                              title={item.name}
                            >
                              {item.name}
                            </h3>
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                isDarkMode
                                  ? "bg-purple-900/50 text-purple-300"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <p
                            className={`text-sm mb-3 line-clamp-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.description || "No description available"}
                          </p>

                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-md ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                Current Bid:
                              </p>
                              <p className="text-md font-bold text-purple-500">
                                ${item.startingPrice?.toLocaleString()}
                              </p>
                            </div>
                            <div
                              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
                                isDarkMode ? "bg-gray-800" : "bg-gray-100"
                              }`}
                            >
                              <FaGavel
                                className={
                                  isDarkMode ? "text-purple-400" : "text-purple-600"
                                }
                              />
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex space-x-3 mt-auto">
                            <Link
                              to={`/liveBid/${item._id}`}
                              className={`flex-1 text-center py-2 px-4 rounded-lg transition shadow-md ${
                                new Date(item.startTime) > new Date()
                                  ? "bg-gray-400 text-gray-200 cursor-not-allowed pointer-events-none"
                                  : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
                              }`}
                            >
                              Bid Now
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex justify-center items-center gap-4 my-10"
                >
                  <motion.button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center px-4 py-2 rounded-xl ${
                      isDarkMode
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-white text-gray-800 border border-gray-200"
                    } shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 hover:text-white hover:border-transparent transition ${
                      currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    whileHover={currentPage !== 0 ? { scale: 1.05 } : {}}
                    whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
                  >
                    <FaChevronLeft className="mr-2" />
                    <span className="text-sm font-medium">Previous</span>
                  </motion.button>

                  <div
                    className={`px-5 py-2 rounded-xl ${
                      isDarkMode
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-white text-gray-800 border border-gray-200"
                    } shadow-md`}
                  >
                    <span className="font-medium">
                      {currentPage + 1} / {pageCount}
                    </span>
                  </div>

                  <motion.button
                    onClick={handleNext}
                    disabled={currentPage === pageCount - 1}
                    className={`flex items-center justify-center px-4 py-2 rounded-xl ${
                      isDarkMode
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-white text-gray-800 border border-gray-200"
                    } shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 hover:text-white hover:border-transparent transition ${
                      currentPage === pageCount - 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    whileHover={
                      currentPage !== pageCount - 1 ? { scale: 1.05 } : {}
                    }
                    whileTap={
                      currentPage !== pageCount - 1 ? { scale: 0.95 } : {}
                    }
                  >
                    <span className="text-sm font-medium">Next</span>
                    <FaChevronRight className="ml-2" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Banner Component
const Banner = ({ isDarkMode }) => (
  <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
    <div className="absolute inset-0 bg-black">
      <img
        src="https://i.ibb.co/BHFqCZDs/Untitled-design-37.jpg"
        alt="Auction Banner"
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-purple-900/50"></div>
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4 w-full max-w-3xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Premium Auctions
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto"
        >
          Discover unique treasures and rare collectibles from around the world
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={() => {
              document
                .getElementById("auction-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-lg font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition shadow-lg shadow-purple-900/30 transform hover:-translate-y-1"
          >
            Explore All Auctions
          </button>
        </motion.div>
      </motion.div>
    </div>

    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
  </div>
);

export default Auction;