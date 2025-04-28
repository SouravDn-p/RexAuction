import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFire,
  FaSearch,
  FaSadTear,
  FaClock,
  FaGavel,
  FaEye,
} from "react-icons/fa";
import ThemeContext from "../Context/ThemeContext";

export default function UpcomingAuction() {
  const { isDarkMode } = useContext(ThemeContext); // use your context or toggle hook
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 5;
  useEffect(() => {
    axios
      .get("http://localhost:5000/upcoming-auctions")
      .then((res) => {
        const today = new Date();
        const upcoming = res.data.filter(
          (auction) => new Date(auction.startTime) > today
        );
        setUpcomingAuctions(upcoming);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredAuctions = upcomingAuctions.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredAuctions.length / itemsPerPage);
  const displayedAuctions = filteredAuctions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < pageCount - 1) setCurrentPage(currentPage + 1);
  };

  const getPaginationItems = () => {
    let pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(i);
    }
    return pages;
  };

  const formatTime = (time) => {
    if (!time) return "Starting Soon";
    const totalSeconds = Math.floor((new Date(time) - new Date()) / 1000);
    if (totalSeconds <= 0) return "Started";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}
    >
      <section className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center">
            <FaFire className="text-orange-500 mr-3 text-3xl" />
            <h2
              className={`text-3xl md:text-4xl font-bold ${
                isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-500"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-600"
              }`}
            >
              Upcoming Auctions
            </h2>
          </div>

          {/* Search Input */}
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

        {/* No Auctions */}
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
                : "No upcoming auctions available"}
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try different search terms or check back later"
                : "Stay tuned for new auctions soon!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full hover:from-purple-700 hover:to-purple-600 transition shadow-md"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* Cards Section */}
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
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={item.images?.[0] || image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.src = image;
                      }}
                    />
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-purple-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <FaClock className="mr-1" />
                      {formatTime(item.startTime)}
                    </div>
                  </div>

                  {/* Card Body */}
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
                          Starting Price:
                        </p>
                        <p className="text-xl font-bold text-purple-600">
                          ${item.startingPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaGavel
                          className={`mr-1 ${
                            isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                        />
                        <span className="text-sm">{item.bids || 0} bids</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 text-center bg-gradient-to-r  from-purple-600 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-600 transition shadow-md">
                        Upcoming
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } shadow-md transition ${
                      currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {"<"}
                  </button>
                  {getPaginationItems().map((page, index) =>
                    typeof page === "number" ? (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          currentPage === page
                            ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg"
                            : isDarkMode
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        } transition shadow-md`}
                      >
                        {page + 1}
                      </button>
                    ) : (
                      <span
                        key={`ellipsis-${index}`}
                        className={`text-sm sm:text-base ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ...
                      </span>
                    )
                  )}
                  <button
                    onClick={handleNext}
                    disabled={currentPage === pageCount - 1}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
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
}
