"use client";

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
import LoadingSpinner from "../../LoadingSpinner";
import { jsPDF } from "jspdf";
import { FileDown } from "lucide-react";
import Header from "./Header/Header";

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
    refetch,
  } = useGetAuctionByEmailQuery(email, {
    skip: !email,
  });

  const [updateAuction, { isLoading: isUpdating }] = useUpdateAuctionMutation();
  const [deleteAuction, { isLoading: isDeleting }] = useDeleteAuctionMutation();

  const isAuctionEnded = (auction) => {
    return new Date(auction.endTime) < new Date();
  };

  const filteredAuctions = auctions.filter((auction) => {
    if (filterStatus === "All") return true;
    if (filterStatus === "Ended") return isAuctionEnded(auction);
    return auction.status?.toLowerCase() === filterStatus.toLowerCase();
  });

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
      name: auction.name || "",
      description: auction.description || "",
      category: auction.category || "",
      startingPrice: auction.startingPrice || 0,
      condition: auction.condition || "",
      itemYear: auction.itemYear || new Date().getFullYear(),
      startTime: auction.startTime ? auction.startTime.slice(0, 16) : "",
      endTime: auction.endTime ? auction.endTime.slice(0, 16) : "",
      status: auction.status || "pending",
    });
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEditForm = () => {
    const { name, startingPrice, startTime, endTime } = editFormData;
    
    if (!name || !startingPrice || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      toast.error("Start time cannot be in the past");
      return false;
    }

    if (end <= start) {
      toast.error("End time must be after start time");
      return false;
    }

    if (parseFloat(startingPrice) <= 0) {
      toast.error("Starting price must be greater than 0");
      return false;
    }

    return true;
  };

  const handleEditSubmit = async () => {
    if (!selectedAuction) return;
    
    if (!validateEditForm()) return;

    const toastId = toast.loading("Updating auction...");
    
    try {
      // Format the data properly for the backend
      const updateData = {
        name: editFormData.name,
        description: editFormData.description,
        category: editFormData.category,
        startingPrice: parseFloat(editFormData.startingPrice),
        condition: editFormData.condition,
        itemYear: parseInt(editFormData.itemYear),
        startTime: new Date(editFormData.startTime).toISOString(),
        endTime: new Date(editFormData.endTime).toISOString(),
        status: editFormData.status,
      };

      console.log("Updating auction with data:", updateData);
      
      const result = await updateAuction({
        id: selectedAuction._id,
        data: updateData,
      }).unwrap();
      
      console.log("Update result:", result);
      
      toast.success("Auction updated successfully!", { id: toastId });
      setIsEditing(false);
      refetch(); // Refresh the auctions list
      
    } catch (error) {
      console.error("Error updating auction:", error);
      
      let errorMessage = "Failed to update auction";
      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleDelete = async () => {
    if (!selectedAuction) return;
    
    const result = await MySwal.fire({
      title: "Are you sure?",
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
        console.log("Deleting auction with ID:", selectedAuction._id);
        
        const result = await deleteAuction(selectedAuction._id).unwrap();
        console.log("Delete result:", result);
        
        toast.success("Auction deleted successfully!", { id: toastId });
        setIsModalOpen(false);
        refetch(); // Refresh the auctions list
        
      } catch (error) {
        console.error("Error deleting auction:", error);
        
        let errorMessage = "Failed to delete auction";
        if (error.data?.message) {
          errorMessage = error.data.message;
        } else if (error.error) {
          errorMessage = error.error;
        }
        
        toast.error(errorMessage, { id: toastId });
      }
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedAuction) return;

    const toastId = toast.loading("Generating PDF...");

    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(102, 51, 153);
        doc.rect(0, 0, 210, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Auction Details", 105, 8, null, null, "center");

        // Branding
        doc.setFontSize(12);
        doc.setTextColor(102, 51, 153);
        doc.setFont("helvetica", "bold");
        doc.text("REX AUCTION", 14, 20);

        // Generation date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

        // Divider
        doc.setLineWidth(0.5);
        doc.setDrawColor(102, 51, 153);
        doc.line(14, 30, 200, 30);

        // Auction Information
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(102, 51, 153);
        doc.text("Auction Information", 14, 40);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        const detailsX1 = 14;
        const detailsX2 = 60;
        let yPos = 50;

        // Auction details
        doc.setFont("helvetica", "bold");
        doc.text("Item Name:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(selectedAuction.name || "N/A", detailsX2, yPos);
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Category:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(selectedAuction.category || "N/A", detailsX2, yPos);
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Condition:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(selectedAuction.condition || "N/A", detailsX2, yPos);
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Year:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(selectedAuction.itemYear?.toString() || "N/A", detailsX2, yPos);
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Starting Price:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(`$${selectedAuction.startingPrice || 0}`, detailsX2, yPos);
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Status:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(
          isAuctionEnded(selectedAuction) ? "Ended" : selectedAuction.status || "Pending",
          detailsX2,
          yPos
        );
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Start Time:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(
          selectedAuction.startTime ? new Date(selectedAuction.startTime).toLocaleString() : "N/A",
          detailsX2,
          yPos
        );
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("End Time:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(
          selectedAuction.endTime ? new Date(selectedAuction.endTime).toLocaleString() : "N/A",
          detailsX2,
          yPos
        );
        yPos += 15;

        // Divider
        doc.setLineWidth(0.3);
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPos - 5, 200, yPos - 5);

        // Description
        if (selectedAuction.description) {
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(102, 51, 153);
          doc.text("Description", 14, yPos);
          yPos += 10;

          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);

          const splitDescription = doc.splitTextToSize(
            selectedAuction.description,
            180
          );
          doc.text(splitDescription, 14, yPos);

          yPos += splitDescription.length * 7 + 10;
        }

        // History
        if (selectedAuction.history) {
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(102, 51, 153);
          doc.text("History/Provenance", 14, yPos);
          yPos += 10;

          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);

          const splitHistory = doc.splitTextToSize(
            selectedAuction.history,
            180
          );
          doc.text(splitHistory, 14, yPos);

          yPos += splitHistory.length * 7 + 10;
        }

        // Divider
        doc.setLineWidth(0.3);
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPos, 200, yPos);
        yPos += 10;

        // Seller Information
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(102, 51, 153);
        doc.text("Seller Information", 14, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        doc.setFont("helvetica", "bold");
        doc.text("Seller:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(
          selectedAuction.sellerDisplayName || "Anonymous",
          detailsX2,
          yPos
        );
        yPos += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Contact:", detailsX1, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(
          selectedAuction.sellerEmail || "No email provided",
          detailsX2,
          yPos
        );

        // Footer
        doc.setFillColor(102, 51, 153);
        doc.rect(0, 287, 210, 10, "F");

        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(
          "Rex Auction © " + new Date().getFullYear(),
          105,
          293,
          null,
          null,
          "center"
        );

        doc.save(`auction-${selectedAuction._id}.pdf`);
        toast.success("PDF downloaded successfully!", { id: toastId });
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF", { id: toastId });
      }
    }, 500);
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
    pdfButton: isDarkMode
      ? "bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white"
      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white",
    infoBox: isDarkMode
      ? "bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600"
      : "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100",
  };

  return (
    <div
      className={`p-4 sm:p-6 ${themeStyles.background} ${themeStyles.text} min-h-screen`}
    >
      <Header
        header="Auction Management"
        title="Manage your auctions effortlessly"
      />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
          Manage Your Auctions
        </h2>
        <div className="flex flex-wrap gap-2">
          {["All", "Accepted", "Rejected", "pending", "Ended"].map((status) => (
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

      {/* table */}
      <div className={`overflow-x-auto rounded-lg ${themeStyles.shadow}`}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className={`p-8 text-center ${themeStyles.secondaryText}`}>
            Error loading auctions. Please try again.
          </div>
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
                        src={auction.images?.[0] || "/placeholder.svg"}
                        className="h-16 w-20 sm:h-20 sm:w-24 rounded object-cover"
                        alt={auction.name}
                      />
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                      {auction.name}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                      {auction.startTime ? new Date(auction.startTime).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                      {auction.endTime ? new Date(auction.endTime).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-sm sm:text-base">
                      <span
                        className={`${
                          isAuctionEnded(auction)
                            ? "bg-gray-200 text-xs font-bold text-gray-600 py-1 rounded-full px-2"
                            : auction.status === "Rejected"
                            ? "bg-red-200 text-xs font-bold text-red-600 py-1 rounded-full px-2"
                            : auction.status === "pending"
                            ? "bg-yellow-200 text-xs font-bold text-yellow-600 py-1 rounded-full px-2"
                            : "bg-green-200 text-xs font-bold text-green-600 py-1 rounded-full px-2"
                        }`}
                      >
                        {isAuctionEnded(auction) ? "Ended" : auction.status || "Pending"}
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
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      required
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
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Starting Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="startingPrice"
                      value={editFormData.startingPrice}
                      onChange={handleEditChange}
                      min="0.01"
                      step="0.01"
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="condition"
                      value={editFormData.condition}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Item Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="itemYear"
                      value={editFormData.itemYear}
                      onChange={handleEditChange}
                      min="1000"
                      max={new Date().getFullYear()}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={editFormData.startTime}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={editFormData.endTime}
                      onChange={handleEditChange}
                      className={`w-full p-2 rounded ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.text}`}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`px-4 py-2 rounded ${themeStyles.buttonBg} ${themeStyles.buttonText} ${themeStyles.buttonHover}`}
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSubmit}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      {selectedAuction.images?.map((image, index) => (
                        <div key={index} className="w-full aspect-square">
                          <img
                            src={image || "/placeholder.svg"}
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
                          {selectedAuction.startTime ? new Date(selectedAuction.startTime).toLocaleString() : "N/A"}
                        </p>
                        <p className="text-sm sm:text-base">
                          <span className="font-semibold">End Time:</span>{" "}
                          {selectedAuction.endTime ? new Date(selectedAuction.endTime).toLocaleString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">Auction Status</h3>
                      <button
                        onClick={handleDownloadPDF}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${themeStyles.pdfButton} shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                      >
                        <FileDown className="h-4 w-4" />
                        Download PDF
                      </button>
                    </div>
                    <p className="text-sm sm:text-base">
                      <span className="font-semibold">Current Status:</span>{" "}
                      <span
                        className={`${
                          isAuctionEnded(selectedAuction)
                            ? "text-gray-500"
                            : selectedAuction.status === "Rejected"
                            ? "text-red-500"
                            : selectedAuction.status === "pending"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {isAuctionEnded(selectedAuction)
                          ? "Ended"
                          : selectedAuction.status || "Pending"}
                      </span>
                    </p>
                    <div className={`mt-2 p-3 rounded-lg ${themeStyles.infoBox}`}>
                      <p className="text-sm sm:text-base flex items-center gap-2">
                        <span className="font-medium">
                          {isAuctionEnded(selectedAuction)
                            ? `This auction has ended on ${selectedAuction.endTime ? new Date(
                                selectedAuction.endTime
                              ).toLocaleDateString() : "N/A"}`
                            : `Auction status: ${selectedAuction.status || "Pending"}`}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        You can download a PDF record of this auction for your
                        records.
                      </p>
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
                        disabled={isAuctionEnded(selectedAuction)}
                        className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${
                          isDarkMode
                            ? "bg-indigo-700 hover:bg-indigo-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        <FileDown className="h-4 w-4" />
                        Download PDF
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