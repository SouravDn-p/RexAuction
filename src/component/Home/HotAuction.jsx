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
  const [favorites, setFavorites] = useState([]);
  const itemsPerPage = 4;
  const axiosSecure = useAxiosSecure();

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

  // Filter and search functionality
  const filteredAuctions = useMemo(() => {
    const accepted = auctionData.filter(
      (item) =>
        item.status === "Accepted" && new Date(item.endTime) > new Date()
    );

    if (!searchTerm.trim()) return accepted;

    const term = searchTerm.toLowerCase();
    return accepted.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
    );
  }, [auctionData, searchTerm]);

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

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-purple-500 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-purple-400 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center bg-red-100 text-red-600 p-4 rounded-full mb-4">
            <FaSadTear className="text-2xl" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Failed to load auctions</h3>
          <p className="text-gray-600 mb-4">Please try again later</p>
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
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <section className="container mx-auto px-4 py-12">
        {/* Search and Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center">
            <FaFire className="text-orange-500 mr-3 text-3xl" />
            <h2
              className={`text-3xl md:text-4xl font-bold ${
                isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-700"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-600 to-purple-900"
              }`}
            >
              Hot Auctions
            </h2>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search auctions..."
              className={`w-full py-3 px-5 pr-10 rounded-full focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500 border border-gray-700"
                  : "bg-white text-gray-800 placeholder-gray-500 focus:ring-purple-500 border border-gray-200 shadow-sm"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
        </div>

        {/* No Results Message */}
        {!filteredAuctions.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center bg-yellow-100 text-yellow-600 p-6 rounded-full mb-6">
              <FaSadTear className="text-4xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              {searchTerm
                ? "No matching auctions found"
                : "No active auctions available"}
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try different search terms or check back later"
                : "New auctions will be available soon"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow-lg"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* Auction Cards in a Single Line */}
        {filteredAuctions.length > 0 && (
          <div className="mb-12">
            <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory">
              {displayedAuctions.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`flex-shrink-0 w-72 rounded-xl overflow-hidden transition-all duration-300 snap-start ${
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

                  {/* Image with Time Badge */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={item.images?.[0] || image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.src = image;
                      }}
                    />
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-purple-400 to-purple-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <FaClock className="mr-1" />
                      {formatTime(countdowns[item._id])}
                    </div>
                  </div>

                  {/* Auction Details */}
                  <div
                    className={`p-5 ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg h-12 font-bold line-clamp-2">
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
                          Starting Price :
                        </p>
                        <p className="text-xl font-bold text-purple-600">
                          ${item.startingPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <FaGavel
                            className={`mr-1 ${
                              isDarkMode ? "text-purple-400" : "text-purple-600"
                            }`}
                          />
                          <span className="text-sm">{item.bids || 0} bids</span>
                        </div>
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
                            width: `${Math.min(100, (item.bids || 0) * 10)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/liveBid/${item._id}`}
                        className="flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-400 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-400 transition shadow-md"
                      >
                        Bid Now
                      </Link>
                      <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        <FaEye
                          className={
                            isDarkMode ? "text-gray-600" : "text-gray-600"
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
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } shadow-md transition ${
                      currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {"<"}
                  </button>

                  {Array.from({ length: pageCount }, (_, i) => i).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : isDarkMode
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        } transition shadow-md`}
                      >
                        {pageNum + 1}
                      </button>
                    )
                  )}

                  <button
                    onClick={handleNext}
                    disabled={currentPage === pageCount - 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } shadow-md transition ${
                      currentPage === pageCount - 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {">"}
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HotAuction;
