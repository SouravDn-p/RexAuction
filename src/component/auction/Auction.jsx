import { useContext, useEffect, useState, useMemo } from "react";
import {
  FaFire,
  FaGavel,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSadTear,
} from "react-icons/fa";
import ThemeContext from "../../component/Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Auction = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [countdowns, setCountdowns] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 4; // Show exactly 4 cards per page

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

    auctionData.forEach((item, index) => {
      if (!item.endTime) return;

      const endTime = new Date(item.endTime);
      const diffInSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
      initialCountdowns[index] = diffInSeconds;
    });

    setCountdowns(initialCountdowns);

    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (updated[key] > 0) {
            updated[key] -= 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionData]);

  // Filter and search functionality
  const filteredAuctions = useMemo(() => {
    const accepted = auctionData.filter((item) => item.status === "Accepted");

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

  if (isLoading) {
    return (
      <div
        className={
          isDarkMode ? "bg-gray-900 min-h-screen" : "bg-white min-h-screen"
        }
      >
        <Banner isDarkMode={isDarkMode} />
        <p
          className={`text-center py-10 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Loading auctions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={
          isDarkMode ? "bg-gray-900 min-h-screen" : "bg-white min-h-screen"
        }
      >
        <Banner isDarkMode={isDarkMode} />
        <p className="text-center py-10 text-red-500">
          Error loading auctions.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        isDarkMode ? "bg-gray-900 min-h-screen" : "bg-white min-h-screen"
      }
    >
      <section>
        <Banner isDarkMode={isDarkMode} />

        <div className="w-11/12 mx-auto py-10">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center mb-4">
              <FaFire className="text-orange-500 mr-2 text-2xl" />
              <h2
                className={`text-3xl font-bold ${
                  isDarkMode
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-600"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700"
                }`}
              >
                ALL Auctions
              </h2>
            </div>
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
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Showing results for:{" "}
                <span className="font-semibold">"{searchTerm}"</span>
              </p>
            )}
          </div>

          {/* No Auctions Found Message */}
          {!filteredAuctions.length && (
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
                  : "Please check back later for new auction items."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Auction Cards - 4 in a row, horizontally */}
          {filteredAuctions.length > 0 && (
            <div className="relative">
              <div className="flex justify-center gap-6 pb-10">
                {displayedAuctions.map((item, index) => (
                  <div
                    key={item._id || index}
                    className={`w-72 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500"
                        : "bg-white shadow-lg"
                    }`}
                  >
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={item.images?.[0] || "/default-auction.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-auction.jpg";
                        }}
                      />
                    </div>

                    <div
                      className={`p-4 flex-grow flex flex-col ${
                        isDarkMode
                          ? "text-gray-200 bg-gray-950"
                          : "text-gray-800 bg-gray-50"
                      }`}
                    >
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3rem]">
                        {item.name}
                      </h3>

                      <div className="flex justify-between items-center mb-3">
                        <p className="text-yellow-500 font-bold text-xl">
                          ${item.startingPrice?.toLocaleString()}
                        </p>
                        <span
                          className={`text-sm ${
                            countdowns[index] < 3600
                              ? "text-red-500 font-semibold"
                              : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(countdowns[index])}
                        </span>
                      </div>

                      <p
                        className={`text-sm mb-3 line-clamp-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Category: {item.category}
                      </p>

                      <div
                        className={`flex justify-between items-center text-sm mb-3 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center">
                          <FaGavel className="mr-1 text-violet-600" />
                          <span>{item.bids || 0} bids</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                          <span>Live</span>
                        </div>
                      </div>

                      <div
                        className={`w-full h-2 mb-4 rounded-full ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className="bg-violet-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (item.bids || 0) * 10)}%`,
                          }}
                        ></div>
                      </div>

                      <div className="mt-auto">
                        <Link
                          to={`/liveBid/${item._id}`}
                          className="block w-full text-center bg-gradient-to-r from-purple-600 via-violet-700 to-purple-800 text-white py-2 rounded-lg hover:from-purple-500 hover:via-violet-600 hover:to-indigo-700 transition"
                        >
                          Bid Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex justify-center items-center gap-4 mb-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center p-2 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800"
                    } shadow-lg hover:bg-purple-600 hover:text-white transition ${
                      currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaChevronLeft className="mr-1" />
                    <span className="text-sm font-medium">Prev</span>
                  </button>

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

                  <button
                    onClick={handleNext}
                    disabled={currentPage === pageCount - 1}
                    className={`flex items-center justify-center p-2 rounded-full ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-800"
                    } shadow-lg hover:bg-purple-600 hover:text-white transition ${
                      currentPage === pageCount - 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="text-sm font-medium">Next</span>
                    <FaChevronRight className="ml-1" />
                  </button>
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
      src="https://i.ibb.co.com/BHFqCZDs/Untitled-design-37.jpg"
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