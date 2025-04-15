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
  FaEye,
} from "react-icons/fa";
import ThemeContext from "../../component/Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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

  // Define categories (same as BrowsCategory)
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

  // Toggle favorite status
  const toggleFavorite = (index) => {
    if (favorites.includes(index)) {
      setFavorites(favorites.filter((i) => i !== index));
    } else {
      setFavorites([...favorites, index]);
    }
  };

  const {
    data: auctionData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      return res.data || [];
    },
  });

  useEffect(() => {
    if (!auctionData || auctionData.length === 0) return;

    const initialCountdowns = {};
    const now = new Date();

    auctionData.forEach((item) => {
      if (!item.startTime || !item.endTime || !item._id) return;

      const startTime = new Date(item.startTime);
      const endTime = new Date(item.endTime);

      if (now < startTime) {
        const diffInSeconds = Math.max(0, Math.floor((startTime - now) / 1000));
        initialCountdowns[item._id] = { time: diffInSeconds, isStarting: true };
      } else if (now >= startTime && now < endTime) {
        const diffInSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
        initialCountdowns[item._id] = {
          time: diffInSeconds,
          isStarting: false,
        };
      } else {
        initialCountdowns[item._id] = { time: 0, isStarting: false };
      }
    });

    setCountdowns(initialCountdowns);

    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = {};
        const currentTime = new Date();

        auctionData.forEach((item) => {
          if (!item.startTime || !item.endTime || !item._id) return;

          const startTime = new Date(item.startTime);
          const endTime = new Date(item.endTime);

          if (currentTime < startTime) {
            updated[item._id] = {
              time: Math.max(0, Math.floor((startTime - currentTime) / 1000)),
              isStarting: true,
            };
          } else if (currentTime >= startTime && currentTime < endTime) {
            updated[item._id] = {
              time: Math.max(0, Math.floor((endTime - currentTime) / 1000)),
              isStarting: false,
            };
          } else {
            updated[item._id] = { time: 0, isStarting: false };
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionData]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(0);

    // Update URL with the selected category
    if (category === "All") {
      navigate("/auction");
    } else {
      navigate(`/auction?category=${encodeURIComponent(category)}`);
    }
  };

  // Filter and search functionality
  const filteredAuctions = useMemo(() => {
    let filtered = auctionData.filter((item) => item.status === "Accepted");

    if (activeCategory !== "All") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [auctionData, searchTerm, activeCategory]);

  const pageCount = Math.ceil(filteredAuctions.length / itemsPerPage);
  const displayedAuctions = filteredAuctions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Reset to first page when search term changes
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
    const { time: seconds, isStarting } = countdown || {
      time: 0,
      isStarting: false,
    };
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

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }  items-center justify-center`}
      >
        <Banner isDarkMode={isDarkMode} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } flex items-center justify-center`}
      >
        <Banner isDarkMode={isDarkMode} />
        <p className="text-lg font-semibold text-red-500">
          Error loading auctions.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } max-sm:pt-8`}
    >
      <section>
        <Banner isDarkMode={isDarkMode} />

        <div className="w-11/12 mx-auto py-10">
          {/* Section Header */}
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <FaFire className="text-orange-500 mr-2 text-2xl" />
              <h2
                className={`text-3xl font-bold ${
                  isDarkMode
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
                }`}
              >
                {activeCategory === "All"
                  ? "All Auctions"
                  : `${activeCategory} Auctions`}
              </h2>
            </div>
            <p
              className={`${
                isDarkMode ? "text-gray-200" : "text-gray-600"
              } text-center max-w-2xl mb-8`}
            >
              {activeCategory === "All"
                ? "Discover our most popular and trending auction items. Bid now before they're gone!"
                : `Browse our exclusive collection of ${activeCategory} items up for auction.`}
            </p>
          </motion.div>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group ${
                  activeCategory === category
                    ? isDarkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className={`absolute inset-0 bg-gradient-to-r ${
                    isDarkMode
                      ? "from-purple-500/20 to-pink-500/20"
                      : "from-pink-500/20 to-purple-500/20"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full -z-10`}
                ></span>
                {category}
              </motion.button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mx-auto mb-10 max-w-2xl">
            <input
              type="text"
              placeholder="Search auctions by name, category or description..."
              className={`w-full py-3 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500"
                  : "bg-white text-gray-800 placeholder-gray-500 focus:ring-purple-500"
              } shadow-lg`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            {searchTerm && (
              <p
                className={`text-lg mt-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Showing results for:{" "}
                <span className="font-semibold">"{searchTerm}"</span>
              </p>
            )}
          </div>

          {/* No Auctions Found */}
          {!filteredAuctions.some(
            (item) => new Date(item.endTime) > new Date()
          ) && (
            <div
              className={`text-center py-20 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                } p-6 rounded-full mb-4`}
              >
                <FaSadTear className="text-4xl text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {searchTerm
                  ? "No matching auctions found"
                  : "No auctions available"}
              </h3>
              <p
                className={`max-w-md mx-auto ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {searchTerm
                  ? "Try adjusting your search or check back later for new listings."
                  : `No ${
                      activeCategory === "All" ? "" : activeCategory
                    } auctions available. Please check back later.`}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Auction Cards */}
          {filteredAuctions.some(
            (item) => new Date(item.endTime) > new Date()
          ) && (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
                {displayedAuctions
                  .filter((item) => new Date(item.endTime) > new Date())
                  .map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className={`flex-shrink-0 sm:w-96 mx-auto md:w-72 rounded-xl overflow-hidden transition-all duration-300 snap-start ${
                        isDarkMode
                          ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                          : "bg-white border border-gray-200"
                      } shadow-lg hover:shadow-xl`}
                    >
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(item._id)}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all shadow-md ${
                          isDarkMode
                            ? "bg-gray-800/80 hover:bg-gray-700"
                            : "bg-white/80 hover:bg-white"
                        }`}
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
                      </button>

                      {/* Image */}
                      <div className="relative h-56 w-76 md:w-full  overflow-hidden">
                        <img
                          src={item.images?.[0] || image}
                          alt={item.name}
                          className="w-full h-full object-cover position-center transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            e.target.src = image;
                          }}
                        />
                        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                          <FaClock className="mr-1" />
                          {formatTime(countdowns[item._id]) === "0m 0s left"
                            ? "Ended"
                            : formatTime(countdowns[item._id])}
                        </div>
                      </div>

                      {/* Auction Details */}
                      <div
                        className={`p-5 ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg h-16 font-bold line-clamp-2">
                            {item.name}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode
                                ? "bg-purple-900/50 text-purple-300"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-4 line-clamp-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.description || "No description available"}
                        </p>

                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Starting Price:
                            </p>
                            <p className="text-xl font-bold text-purple-600">
                              ${item.startingPrice?.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaGavel
                              className={`mr-1 ${
                                isDarkMode
                                  ? "text-purple-400"
                                  : "text-purple-600"
                              }`}
                            />
                            <span className="text-sm">
                              {item.bids || 0} bids
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }
                            >
                              Bidding Progress
                            </span>
                            <span className="font-medium">
                              {Math.min(100, (item.bids || 0) * 10)}%
                            </span>
                          </div>
                          <div
                            className={`w-full h-2 rounded-full ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (item.bids || 0) * 10
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-2">
                          <Link
                            to={`/liveBid/${item._id}`}
                            className="flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition shadow-md"
                          >
                            Bid Now
                          </Link>
                          <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                            <FaEye
                              className={
                                isDarkMode ? "text-gray-500" : "text-gray-600"
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex justify-center items-center gap-4 mb-6">
                  <motion.button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center p-2 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800"
                    } shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white transition ${
                      currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChevronLeft className="mr-1" />
                    <span className="text-sm font-medium">Prev</span>
                  </motion.button>

                  <div
                    className={`px-4 py-2 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span className="font-medium">
                      {currentPage + 1} / {pageCount}
                    </span>
                  </div>

                  <motion.button
                    onClick={handleNext}
                    disabled={currentPage === pageCount - 1}
                    className={`flex items-center justify-center p-2 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800"
                    } shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white transition ${
                      currentPage === pageCount - 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium">Next</span>
                    <FaChevronRight className="ml-1" />
                  </motion.button>
                </div>
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
  <div className="relative w-full h-64 md:h-96 overflow-hidden">
    <img
      src="https://i.ibb.co/BHFqCZDs/Untitled-design-37.jpg"
      alt="Auction Banner"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="text-center px-4 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Exclusive Auctions
        </h1>
        <p className="text-lg md:text-xl text-white mb-6">
          Bid on unique items and rare collectibles from around the world
        </p>
      </div>
    </div>
  </div>
);

export default Auction;
