import { useState, useContext } from "react";
import useAuth from "../../../hooks/useAuth";
import ThemeContext from "../../Context/ThemeContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useGetAuctionByEmailQuery,
  useUpdateAuctionMutation,
  useDeleteAuctionMutation,
} from "../../../redux/features/api/auctionApi";

const MySwal = withReactContent(Swal);

export default function ManageCard() {
  const { dbUser } = useAuth();
  const email = dbUser?.email;
  const { isDarkMode } = useContext(ThemeContext);

  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const itemsPerPage = 5;

  const {
    data: auctions = [],
    isLoading,
    error,
  } = useGetAuctionByEmailQuery(email, {
    skip: !email,
  });

  const [updateAuction] = useUpdateAuctionMutation();
  const [deleteAuction] = useDeleteAuctionMutation();

  const filteredAuctions = auctions.filter((auction) =>
    filterStatus === "All" ? true : auction.status === filterStatus
  );

  const totalItems = filteredAuctions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAuctions = filteredAuctions.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const openDetailsModal = (auction) => {
    setSelectedAuction(auction);
    setEditFormData({
      name: auction.name,
      description: auction.description,
      category: auction.category,
      startingPrice: auction.startingPrice,
      condition: auction.condition,
      itemYear: auction.itemYear,
      startTime: auction.startTime,
      endTime: auction.endTime,
      status: auction.status,
    });
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!selectedAuction) return;
    const toastId = toast.loading("Updating auction...");
    try {
      await updateAuction({
        id: selectedAuction._id,
        data: editFormData,
      }).unwrap();
      toast.success("Auction updated successfully!", { id: toastId });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update auction", { id: toastId });
      console.error("Error updating auction:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAuction) return;
    const result = await MySwal.fire({
      name: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Deleting auction...");
      try {
        await deleteAuction(selectedAuction._id).unwrap();
        toast.success("Auction deleted successfully!", { id: toastId });
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Failed to delete auction", { id: toastId });
        console.error("Error deleting auction:", error);
      }
    }
  };

  const themeStyles = {
    background: isDarkMode ? "bg-gray-900" : "bg-gray-100",
    text: isDarkMode ? "text-white" : "text-gray-900",
    tableBg: isDarkMode ? "bg-gray-800" : "bg-white",
    tableHeaderBg: isDarkMode ? "bg-gray-700" : "bg-gray-200",
    tableHover: isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-50",
    border: isDarkMode ? "border-gray-700" : "border-gray-300",
    buttonBg: isDarkMode ? "bg-gray-600" : "bg-gray-300",
    buttonText: isDarkMode ? "text-white" : "text-gray-700",
    buttonHover: isDarkMode ? "hover:bg-gray-500" : "hover:bg-gray-400",
    activeFilterBg: "bg-purple-600",
    activeFilterText: "text-white",
    modalBg: isDarkMode ? "bg-gray-800" : "bg-white",
    modalText: isDarkMode ? "text-white" : "text-gray-900",
    modalBorder: isDarkMode ? "border-gray-700" : "border-gray-300",
    secondaryText: isDarkMode ? "text-gray-300" : "text-gray-600",
    shadow: isDarkMode ? "shadow-lg" : "shadow-md",
    inputBg: isDarkMode ? "bg-gray-700" : "bg-gray-50",
    inputBorder: isDarkMode ? "border-gray-600" : "border-gray-300",
  };

  return (
    <div
      className={`p-4 sm:p-6 ${themeStyles.background} ${themeStyles.text} min-h-screen`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
          Manage Your Auctions
        </h2>
        <div className="flex flex-wrap gap-2">
          {["All", "Accepted", "Rejected", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
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
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <table
            className={`min-w-full ${themeStyles.tableBg} rounded-lg overflow-hidden`}
          >
            <thead className={themeStyles.tableHeaderBg}>
              <tr>
                <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                  Photo
                </th>
                <th className="py-3 px-4 sm:px-6 text-left text-sm sm:text-base">
                  Auction name
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
              {paginatedAuctions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className={`py-4 px-6 text-center ${themeStyles.secondaryText}`}
                  >
                    No auctions found for {filterStatus} status
                  </td>
                </tr>
              ) : (
                paginatedAuctions.map((auction) => (
                  <tr
                    key={auction._id}
                    className={`${themeStyles.tableHover} transition-colors border-b ${themeStyles.border}`}
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <img
                        src={auction.images[0] || "/placeholder.svg"}
                        className="h-16 w-20 sm:h-20 sm:w-24 rounded object-cover"
                        alt={auction.name}
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
                      <span
                        className={`${
                          auction.status === "Rejected"
                            ? "bg-red-200 text-xs font-bold text-red-600 py-1 rounded-full px-2"
                            : auction.status === "pending"
                            ? "bg-yellow-200 text-xs font-bold text-yellow-600 py-1 rounded-full px-2"
                            : "bg-green-200 text-xs font-bold text-green-600 py-1 rounded-full px-2"
                        }`}
                      >
                        {auction.status}
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        )}
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
                      ? "bg-purple-600 text-white"
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

      {isModalOpen && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${themeStyles.modalBg} ${themeStyles.modalText} rounded-lg w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto`}
          >
            <div
              className={`border-b ${themeStyles.modalBorder} p-4 sticky top-0 ${themeStyles.modalBg} z-10`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold truncate">
                  {isEditing
                    ? "Edit Auction"
                    : `Auction Details: ${selectedAuction.name}`}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                  }}
                  className={`${themeStyles.secondaryText} hover:${themeStyles.text} text-lg`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Starting Price
                    </label>
                    <input
                      type="number"
                      name="startingPrice"
                      value={editFormData.startingPrice}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Condition
                    </label>
                    <input
                      type="text"
                      name="condition"
                      value={editFormData.condition}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Item Year
                    </label>
                    <input
                      type="number"
                      name="itemYear"
                      value={editFormData.itemYear}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={editFormData.startTime.slice(0, 16)}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={editFormData.endTime.slice(0, 16)}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`px-4 py-2 rounded ${themeStyles.buttonBg} ${themeStyles.buttonText} ${themeStyles.buttonHover}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSubmit}
                      className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      {selectedAuction.images.map((image, index) => (
                        <div key={index} className="w-full aspect-square">
                          <img
                            src={image}
                            alt={`${selectedAuction.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Auction Details
                        </h3>
                        <div className="grid gap-2 text-sm sm:text-base">
                          <p>
                            <span className="font-semibold">Category:</span>{" "}
                            {selectedAuction.category}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Starting Price:
                            </span>{" "}
                            ${selectedAuction.startingPrice}
                          </p>
                          <p>
                            <span className="font-semibold">
                              Current Status:
                            </span>{" "}
                            <span
                              className={`${
                                selectedAuction.status === "Rejected"
                                  ? "text-red-500"
                                  : selectedAuction.status === "pending"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {selectedAuction.status}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold">Condition:</span>{" "}
                            {selectedAuction.condition}
                          </p>
                          <p>
                            <span className="font-semibold">Item Year:</span>{" "}
                            {selectedAuction.itemYear}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Seller Information
                        </h3>
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Name:</span>{" "}
                          {selectedAuction?.sellerDisplayName || "N/A"}
                        </p>
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Email:</span>{" "}
                          {selectedAuction?.sellerEmail}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Auction Timing
                        </h3>
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">Start Time:</span>{" "}
                          {new Date(selectedAuction.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">End Time:</span>{" "}
                          {new Date(selectedAuction.endTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedAuction.description && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Description
                      </h3>
                      <p
                        className={`${themeStyles.secondaryText} text-sm sm:text-base line-clamp-3 hover:line-clamp-none transition-all duration-300`}
                      >
                        {selectedAuction.description}
                      </p>
                    </div>
                  )}

                  {selectedAuction.history && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">History</h3>
                      <div className="max-h-32 sm:max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 pr-2">
                        <p
                          className={`${themeStyles.secondaryText} text-sm sm:text-base`}
                        >
                          {selectedAuction.history}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <h3 className="font-semibold text-lg mb-2">Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
