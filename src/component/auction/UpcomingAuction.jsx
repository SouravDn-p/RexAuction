import { useContext, useEffect, useState } from "react";
import { FaFire, FaSearch, FaClock, FaSadTear } from "react-icons/fa";
import ThemeContext from "../Context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function UpcomingAuction() {
  const { isDarkMode } = useContext(ThemeContext);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetails, setViewDetails] = useState(null);
  const axiosPublic = useAxiosPublic();

  const fallbackImage = "https://via.placeholder.com/100";

  useEffect(() => {
    axiosPublic
      .get("/upcoming-auctions")
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

  const formatTime = (time) => {
    if (!time) return "Starting Soon";

    const totalSeconds = Math.floor((new Date(time) - new Date()) / 1000);
    if (totalSeconds <= 0) return "Started";

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d`;
    return `${hours}h ${minutes}m`;
  };

  const handleViewDetails = (item) => {
    setViewDetails(item);
  };

  const handleCloseModal = () => {
    setViewDetails(null);
  };

  return (
    <div className={` ${isDarkMode ? "bg-gray-950" : "bg-gray-50"} `}>
      <section className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div className="flex items-center">
            <FaFire className="text-orange-500 mr-2 sm:mr-3 text-2xl sm:text-3xl" />
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
                isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-500"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-600"
              }`}
            >
              Upcoming Auctions
            </h2>
          </div>
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-full border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
            />
          </div>
        </div>

        {!filteredAuctions.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-20"
          >
            <div className="inline-flex items-center justify-center bg-yellow-100 text-yellow-600 p-4 sm:p-6 rounded-full mb-4 sm:mb-6">
              <FaSadTear className="text-3xl sm:text-4xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
              {searchTerm
                ? "No matching auctions found"
                : "No upcoming auctions available"}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try different search terms or check back later"
                : "Stay tuned for new auctions soon!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full hover:from-purple-700 hover:to-purple-600 transition shadow-md text-sm sm:text-base"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {filteredAuctions.length > 0 && (
          <>
            {/* Mobile View: Card Layout with Marquee Effect */}
            <div className="block sm:hidden relative min-h-[300px] overflow-hidden">
              <AnimatePresence>
                <motion.div
                  initial={{ y: 0 }}
                  animate={{
                    y: [0, -100 * filteredAuctions.length],
                  }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: filteredAuctions.length * 4,
                      ease: "linear",
                    },
                  }}
                  className="space-y-4"
                >
                  {filteredAuctions
                    .concat(filteredAuctions)
                    .slice(0, 5)
                    .map((item, index) => (
                      <motion.div
                        key={`${item._id}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-lg shadow-md ${
                          isDarkMode
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-800"
                        } flex flex-col gap-3`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-base font-semibold truncate">
                            {item.name?.split(".")[0] || item.name}
                          </h3>
                          <span className="text-purple-600 font-semibold text-sm">
                            ${item.startingPrice?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                          {(item.images || []).slice(0, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={img || fallbackImage}
                              alt="Item"
                              className="w-12 h-12 rounded-full border object-cover"
                              onError={(e) => (e.target.src = fallbackImage)}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>{item.sellerDisplayName}</span>
                          <div className="flex items-center gap-1 text-purple-500">
                            <FaClock className="text-xs" />
                            <span>{formatTime(item.startTime)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="w-full py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 text-sm"
                        >
                          View Details
                        </button>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop/Tablet View: Table Layout with Existing Marquee Effect */}
            <div className="hidden sm:block relative min-h-[300px] sm:h-[400px] overflow-hidden rounded-lg">
              <table className={`min-w-full w-full divide-y `}>
                <thead
                  className={`sticky top-0 z-10 ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                      Item
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">
                      Price
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold hidden sm:table-cell">
                      Seller
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold hidden sm:table-cell">
                      Time
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <AnimatePresence>
                  <motion.tbody
                    initial={{ y: 0 }}
                    animate={{
                      y: [0, -100 * filteredAuctions.length],
                    }}
                    transition={{
                      y: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: filteredAuctions.length * 4,
                        ease: "linear",
                      },
                    }}
                    className={isDarkMode ? " text-white" : " text-gray-800"}
                  >
                    {filteredAuctions
                      .concat(filteredAuctions)
                      .map((item, index) => (
                        <motion.tr
                          key={`${item._id}-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="dark:bg-gray-800 transition"
                        >
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center truncate text-xs sm:text-sm">
                            {item.name?.split(".")[0] || item.name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4">
                            <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                              {(item.images || [])
                                .slice(0, 4)
                                .map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img || fallbackImage}
                                    alt="Item"
                                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border object-cover"
                                    onError={(e) =>
                                      (e.target.src = fallbackImage)
                                    }
                                  />
                                ))}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm">
                            <span className="text-purple-600 font-semibold">
                              ${item.startingPrice?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm hidden sm:table-cell">
                            {item.sellerDisplayName}
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-purple-500 hidden sm:table-cell">
                            <div className="flex justify-end items-center gap-1 sm:gap-2">
                              <FaClock className="text-xs" />
                              <span>{formatTime(item.startTime)}</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                            <button
                              onClick={() => handleViewDetails(item)}
                              className="px-3 sm:px-4 py-1 sm:py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 text-xs sm:text-sm"
                            >
                              View
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>
          </>
        )}

        {viewDetails && (
          <div
            className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className={`rounded-lg p-4 sm:p-6 w-11/12 sm:w-3/4 md:w-2/3 max-w-md relative text-white ${
                isDarkMode ? "bg-gray-800" : "bg-purple-900"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-300 hover:text-white text-lg sm:text-xl font-bold"
              >
                ×
              </button>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                {viewDetails.name}
              </h3>
              <div className="flex gap-2 sm:gap-3 items-center mb-3 sm:mb-4">
                <img
                  src={viewDetails.sellerPhotoUrl || fallbackImage}
                  alt={viewDetails.sellerDisplayName}
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full"
                />
                <div>
                  <h4 className="text-base sm:text-lg">
                    {viewDetails.sellerDisplayName}
                  </h4>
                  <p className="text-xs sm:text-sm">
                    {viewDetails.sellerEmail}
                  </p>
                </div>
              </div>
              <h4 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                Item History:
              </h4>
              <p className="mb-3 sm:mb-4 text-xs sm:text-sm">
                {viewDetails.history}
              </p>
              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                {viewDetails.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`auction-img-${index}`}
                    className="w-full h-20 sm:h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}