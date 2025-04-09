import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ThemeContext from "../../Context/ThemeContext";
import useAuth from "../../../hooks/useAuth";
import { FaEnvelope, FaBell, FaChevronDown } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import image from "../../../assets/LiveBidAuctionDetails.jpg";

function EndedAuctionsHistory() {
  const axiosSecure = useAxiosSecure();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [auction, setAuction] = useState([]);

  const { data: auctions = [] } = useQuery({
    queryKey: ["endedAuctions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/auctions");
      return res.data || [];
    },
  });

  const toggleDropdown = (bidderEmail) => {
    setOpenDropdown(openDropdown === bidderEmail ? null : bidderEmail);
  };

  // Add this handler function
  const handleSendNotification = (bidder) => {
    // Implement your notification logic here
    console.log(`Sending notification to ${bidder.name}`);
  };

  const isAuctionEnded = (endTime) => {
    return new Date(endTime) < new Date();
  };

  // Filter only ended auctions
  const endedAuctions = auctions.filter((auction) =>
    isAuctionEnded(auction.endTime)
  );

  const handleMessageSeller = (bidder) => {
    console.log("bidder", bidder);
    console.log("handleMessageSeller");
    if (!user) {
      alert("Please log in to message this bidder");
      return;
    }

    // Navigate to chat with bidder details
    // navigate("/dashboard/chat", {
    //   state: {
    //     selectedUser: {
    //       _id: bidder?.id || bidder?.email, // Use bidder's ID or email as fallback
    //       email: bidder?.email,
    //       name: bidder?.name || "Bidder",
    //       photo: bidder?.photo || image, // Default image if no photo
    //     },
    //     // Optional: Include auction context if needed
    //     auctionId: selectedAuction?._id,
    //     auctionName: selectedAuction?.name,
    //     auctionImage: selectedAuction?.images?.[0] || image,
    //   },
    // });
  };

  const totalItems = endedAuctions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAuctions = endedAuctions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openDetailsModal = (auction) => {
    // Remove duplicates by keeping only the highest bid for each bidder
    const uniqueTopBiddersMap = new Map();

    auction.topBidders?.forEach((bidder) => {
      const key = bidder.email || bidder._id;
      if (
        !uniqueTopBiddersMap.has(key) ||
        bidder.amount > uniqueTopBiddersMap.get(key).amount
      ) {
        uniqueTopBiddersMap.set(key, bidder);
      }
    });

    // Convert map back to array and sort descending by amount
    const cleanedTopBidders = Array.from(uniqueTopBiddersMap.values()).sort(
      (a, b) => b.amount - a.amount
    );

    // Set cleaned data in selected auction
    setSelectedAuction({
      ...auction,
      topBidders: cleanedTopBidders,
    });

    setIsModalOpen(true);
  };

  const themeStyles = {
    background: isDarkMode ? "bg-gray-900" : "bg-gray-100",
    text: isDarkMode ? "text-white" : "text-gray-900",
    tableBg: isDarkMode ? "bg-gray-800" : "bg-white",
    tableHeaderBg: isDarkMode ? "bg-gray-700" : "bg-gray-200",
    tableHover: isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-50",
    border: isDarkMode ? "border-gray-700" : "border-gray-300",
    buttonBg: isDarkMode ? "bg-gray-700" : "bg-gray-300",
    buttonText: isDarkMode ? "text-gray-300" : "text-gray-700",
    buttonHover: isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-400",
    activeFilterBg: "bg-purple-600",
    activeFilterText: "text-white",
    modalBg: isDarkMode ? "bg-gray-800" : "bg-white",
    modalText: isDarkMode ? "text-white" : "text-gray-900",
    modalBorder: isDarkMode ? "border-gray-700" : "border-gray-300",
    secondaryText: isDarkMode ? "text-gray-300" : "text-gray-600",
    shadow: isDarkMode ? "shadow-lg" : "shadow-md",
  };

  return (
    <div
      className={`p-4 sm:p-6 ${themeStyles.background} ${themeStyles.text} min-h-screen`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
          Ended Auctions History
        </h2>
      </div>

      <div className={`overflow-x-auto rounded-lg ${themeStyles.shadow}`}>
        <table
          className={`min-w-full ${themeStyles.tableBg} rounded-lg overflow-hidden`}
        >
          <thead className={themeStyles.tableHeaderBg}>
            <tr>
              <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                Photo
              </th>
              <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                Auction Title
              </th>
              <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                Start Time
              </th>
              <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                End Time
              </th>
              <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                Status
              </th>
              <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAuctions.map((auction) => (
              <tr
                key={auction?._id}
                className={`${themeStyles.tableHover} transition-colors border-b ${themeStyles.border}`}
              >
                <td className="py-4 px-4 sm:px-6">
                  <img
                    src={auction?.images[0] || "/placeholder.svg"}
                    className="h-16 w-20 sm:h-20 sm:w-24 rounded object-cover"
                    alt=""
                  />
                </td>
                <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                  {auction.name}
                </td>
                <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                  {new Date(auction.startTime).toLocaleString()}
                </td>
                <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                  {new Date(auction.endTime).toLocaleString()}
                </td>
                <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                  <span className="text-xs font-bold py-1 rounded-full px-2 bg-red-500 text-gray-200">
                    ended
                  </span>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <button
                    onClick={() => openDetailsModal(auction)}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded bg-purple-400 hover:bg-purple-600 text-white text-sm sm:text-base transition-colors"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {paginatedAuctions.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className={`py-4 px-6 text-center ${themeStyles.secondaryText}`}
                >
                  No ended auctions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${themeStyles.buttonBg} ${themeStyles.text} disabled:opacity-50 ${themeStyles.buttonHover} transition-colors`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? `${themeStyles.activeFilterBg} ${themeStyles.activeFilterText}`
                      : `${themeStyles.buttonBg} ${themeStyles.text} ${themeStyles.buttonHover}`
                  } transition-colors`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${themeStyles.buttonBg} ${themeStyles.text} disabled:opacity-50 ${themeStyles.buttonHover} transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div
            className={`${themeStyles.modalBg} ${themeStyles.modalText} rounded-xl shadow-2xl w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-95 hover:scale-100`}
          >
            {/* Header */}
            <div
              className={`border-b ${themeStyles.modalBorder} p-4 sm:p-5 sticky top-0 ${themeStyles.modalBg} z-10 flex justify-between items-center`}
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Auction Details
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate max-w-[80%]">
                  {selectedAuction.name}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded-full ${themeStyles.modalBorder} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-8">
              {/* Images Gallery */}
              <div>
                <div className="flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-bold text-lg sm:text-xl">Item Gallery</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedAuction.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <img
                        src={image}
                        alt={`${selectedAuction.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-medium bg-black/50 px-2 py-1 rounded text-xs">
                          View Full
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* top bidders */}
              <div
                className={`p-4 col-span-1  rounded-xl shadow-md ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-xl font-bold mb-3">Top Bidders</h3>
                <div className="space-y-3">
                  {selectedAuction.topBidders.length > 0 ? (
                    selectedAuction.topBidders
                      .slice(0, 3)
                      .map((bidder, index) => (
                        <div
                          key={index}
                          className={`flex items-center h-24 gap-3 p-3 rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          } ${
                            bidder.email === user?.email
                              ? "border-2 border-purple-500"
                              : ""
                          }`}
                        >
                          {bidder.icon}
                          <img
                            src={bidder.photo || image}
                            className="w-10 h-10 rounded-full object-cover"
                            alt="Bidder"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {bidder.name}
                              {bidder.email === user?.email && (
                                <span className="ml-1 text-xs text-purple-500">
                                  (You)
                                </span>
                              )}
                            </h3>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {bidder.amount
                                ? `৳ ${bidder.amount}`
                                : "No bid amount"}
                            </p>
                          </div>
                          {/* Button container for larger screens */}
                          <div className="hidden sm:flex items-center gap-2">
                            <button
                              onClick={() => handleMessageSeller(bidder)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                                isDarkMode
                                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                  : "bg-purple-100 hover:bg-purple-200 text-purple-600"
                              }`}
                            >
                              <FaEnvelope /> Message Seller
                            </button>
                            <button
                              onClick={() => handleSendNotification(bidder)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                                isDarkMode
                                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                  : "bg-purple-100 hover:bg-purple-200 text-purple-600"
                              }`}
                            >
                              <FaBell /> Send Notification
                            </button>
                          </div>
                          {/* Dropdown for smaller screens */}
                          <div className="sm:hidden relative">
                            <button
                              onClick={() => toggleDropdown(bidder.email)}
                              className={`p-2 rounded-full ${
                                isDarkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-gray-200 hover:bg-gray-300"
                              }`}
                            >
                              <FaChevronDown />
                            </button>
                            {openDropdown === bidder.email && (
                              <div
                                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                                  isDarkMode
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                              >
                                <button
                                  onClick={() => handleMessageSeller(bidder)}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-900 dark:hover:bg-gray-600"
                                >
                                  <FaEnvelope className="inline mr-2" /> Message
                                  Seller
                                </button>
                                <button
                                  onClick={() => handleSendNotification(bidder)}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-900 dark:hover:bg-gray-600"
                                >
                                  <FaBell className="inline mr-2" /> Send
                                  Notification
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p
                      className={`text-center py-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      No bids yet! Be the first to place your bid!
                    </p>
                  )}
                </div>
              </div>
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}

                <div className="space-y-6">
                  {/* Auction Details Card */}
                  <div
                    className={`p-4 sm:p-5 rounded-lg border ${themeStyles.modalBorder} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <h3 className="font-bold text-lg">Auction Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Category</span>
                        <span className="text-right">
                          {selectedAuction.category}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Starting Price</span>
                        <span className="text-right">
                          ${selectedAuction.startingPrice}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Status</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                          ended
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Condition</span>
                        <span className="text-right">
                          {selectedAuction.condition}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Item Year</span>
                        <span className="text-right">
                          {selectedAuction.itemYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  {selectedAuction.description && (
                    <div
                      className={`p-4 sm:p-5 rounded-lg border ${themeStyles.modalBorder} shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-purple-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h3 className="font-bold text-lg">Description</h3>
                      </div>
                      <p
                        className={`${themeStyles.secondaryText} text-sm sm:text-base leading-relaxed transition-all duration-300 line-clamp-3 hover:line-clamp-none cursor-pointer`}
                      >
                        {selectedAuction.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Seller Info Card */}
                  <div
                    className={`p-4 sm:p-5 rounded-lg border ${themeStyles.modalBorder} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <h3 className="font-bold text-lg">Seller Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center py-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">
                          {selectedAuction?.sellerDisplayName || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center py-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2 truncate">
                          {selectedAuction?.sellerEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timing Card */}
                  <div
                    className={`p-4 sm:p-5 rounded-lg border ${themeStyles.modalBorder} shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-orange-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <h3 className="font-bold text-lg">Auction Timing</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Start Time</span>
                        <span className="text-right">
                          {new Date(
                            selectedAuction.startTime
                          ).toLocaleDateString()}
                          <br />
                          {new Date(
                            selectedAuction.startTime
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">End Time</span>
                        <span className="text-right">
                          {new Date(
                            selectedAuction.endTime
                          ).toLocaleDateString()}
                          <br />
                          {new Date(
                            selectedAuction.endTime
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* History Card */}
                  {selectedAuction.history && (
                    <div
                      className={`p-4 sm:p-5 rounded-lg border ${themeStyles.modalBorder} shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-amber-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h3 className="font-bold text-lg">History</h3>
                      </div>
                      <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                        <p
                          className={`${themeStyles.secondaryText} text-sm sm:text-base leading-relaxed`}
                        >
                          {selectedAuction.history}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EndedAuctionsHistory;
