import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import ThemeContext from "../../Context/ThemeContext";

function ManageTable() {
  const axiosSecure = useAxiosSecure();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { isDarkMode } = useContext(ThemeContext);

  const { data: auctions = [], refetch } = useQuery({
    queryKey: ["auctionData", filterStatus],
    queryFn: async () => {
      const res = await axiosSecure.get("/auctions");
      return res.data || [];
    },
  });

  const filteredAuctions = auctions.filter((auction) => {
    if (filterStatus === "All") return true;
    return auction.status === filterStatus;
  });

  // Pagination
  const totalItems = filteredAuctions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const updateAuctionStatus = async (id, status) => {
    try {
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You want to ${status.toLowerCase()} this auction?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${status}`,
        cancelButtonText: "Cancel",
        confirmButtonColor: status === "Accepted" ? "#22c55e" : "#ef4444",
      });

      if (result.isConfirmed) {
        await axiosSecure.patch(`/auctions/${id}`, { status });
        await refetch();

        Swal.fire({
          title: "Success!",
          text: `Auction ${status.toLowerCase()} successfully.`,
          icon: "success",
        });

        setIsModalOpen(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `Failed to ${status.toLowerCase()} auction.`,
        icon: "error",
      });
      console.error(`Error updating auction status to ${status}:`, error);
    }
  };

  const openDetailsModal = (auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  // Define theme-based styles
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
          Manage Auctions
        </h2>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["All", "pending", "Accepted", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? `${themeStyles.activeFilterBg} ${themeStyles.activeFilterText}`
                  : `${themeStyles.buttonBg} ${themeStyles.buttonText} ${themeStyles.buttonHover}`
              }`}
            >
              {status}
            </button>
          ))}
        </div>
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
                  {auction.status}
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <button
                    onClick={() => openDetailsModal(auction)}
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base transition-colors"
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
                  No auctions found for {filterStatus} status
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Custom Modal Dialog */}
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedAuction.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedAuction.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedAuction.status}
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

              {/* Actions Card */}
              <div
                className={`p-4 sm:p-5 rounded-lg border ${themeStyles.modalBorder} shadow-sm`}
              >
                <div className="flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-bold text-lg">Auction Actions</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateAuctionStatus(selectedAuction._id, "Accepted")
                    }
                    className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      selectedAuction.status === "Accepted"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                    }`}
                    disabled={selectedAuction.status === "Accepted"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      updateAuctionStatus(selectedAuction._id, "Rejected")
                    }
                    className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      selectedAuction.status === "Rejected"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                    }`}
                    disabled={selectedAuction.status === "Rejected"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTable;
