import { useContext, useEffect, useState } from "react";
import { FaFire, FaSearch, FaClock, FaSadTear } from "react-icons/fa";
import axios from "axios";
import ThemeContext from "../Context/ThemeContext";
import { motion } from "framer-motion";

export default function UpcomingAuction() {
  const { isDarkMode } = useContext(ThemeContext);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [viewDetails, setViewDetails] = useState(null); // Track which auction to show in the modal

  const fallbackImage = "https://via.placeholder.com/100"; // ✅ Default image
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
    return Array.from({ length: pageCount }, (_, i) => i);
  };

  const formatTime = (time) => {
    if (!time) return "Starting Soon";
    const totalSeconds = Math.floor((new Date(time) - new Date()) / 1000);
    if (totalSeconds <= 0) return "Started";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Handle opening modal with specific auction details
  const handleViewDetails = (item) => {
    setViewDetails(item);
  };

  // Close the modal
  const handleCloseModal = () => {
    setViewDetails(null);
  };

  return (
    <div className={` ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <section className="container mx-auto px-4 py-12">
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

        {filteredAuctions.length > 0 && (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table
              className={`min-w-full divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              <thead
                className={
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-700"
                }
              >
                <tr>
                  <th className="px-4 py-3  text-center text-sm font-semibold">
                    Rounds
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Starting Price
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Seller
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Time
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  isDarkMode
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-800"
                }
              >
                {displayedAuctions.map((item, index) => (
                  <tr key={item._id} className=" dark:bg-gray-800 transition">
                    <td className="px-4 py-4">
                      <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center truncate">
                      {item.name?.split(".")[0] || item.name}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {(item.images || []).slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img || fallbackImage}
                            alt="Item"
                            className="w-10 h-10 rounded-full border object-cover"
                            onError={(e) => (e.target.src = fallbackImage)}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-purple-600 font-semibold">
                        ${item.startingPrice?.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      {item.sellerDisplayName}
                    </td>

                    <td className="px-4 py-4 text-right text-purple-500 flex justify-end items-center gap-2">
                      <FaClock className="text-xs" />
                      <span>{formatTime(item.startTime)}</span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewDetails && (
          <div
            className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className={`bg-white rounded-lg p-6 w-1/2 max-w-lg relative ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-600"
              >
                X
              </button>
              <h3 className="text-2xl font-bold mb-4">{viewDetails.name}</h3>
              <div className="flex gap-4 items-center mb-4">
                <img
                  src={viewDetails.sellerPhotoUrl || fallbackImage}
                  alt={viewDetails.sellerDisplayName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="text-xl">{viewDetails.sellerDisplayName}</h4>
                  <p className="text-sm text-gray-600">
                    {viewDetails.sellerEmail}
                  </p>
                </div>
              </div>

              <h4 className="font-semibold mb-2">Item History:</h4>
              <p className="mb-4">{viewDetails.history}</p>
              <div className="grid grid-cols-2 gap-2">
                {viewDetails.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`auction-img-${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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
              {getPaginationItems().map((page) => (
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
              ))}
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
      </section>
    </div>
  );
}
