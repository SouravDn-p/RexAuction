import React, { useState, useEffect, useContext } from "react";
import { GiCancel } from "react-icons/gi";
import { FcCheckmark } from "react-icons/fc";
import { FaSortAmountUp, FaSortAmountDown, FaEye } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContexts } from "../../../providers/AuthProvider";
import Header from "../shared/Header/Header";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const SellerRequest = () => {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const { isDarkMode } = useContext(ThemeContext);
  const { dbUser } = useContext(AuthContexts);
  const [selectedRole, setSelectedRole] = useState("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const axiosPublic = useAxiosPublic();

  const handleRoleFilter = async (role) => {
    setSelectedRole(role);
    setCurrentPage(1);

    try {
      const response = await axiosPublic.get("/sellerRequest");
      const data = response.data;

      const filtered = data.filter((user) => user.becomeSellerStatus === role);
      setUsers(filtered);
    } catch (error) {
      console.error("Error fetching seller requests:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPublic.get("/sellerRequest");
        const data = response.data;

        const pendingUsers = data.filter(
          (user) => user.becomeSellerStatus === "pending"
        );
        setUsers(pendingUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [axiosPublic]);

  const handleApprove = async (userId, dbUserId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this seller request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const sellerReqRes = await axiosPublic.patch(
          `/sellerRequest/${userId}`,
          { becomeSellerStatus: "accepted" }
        );

        if (sellerReqRes.data.success) {
          const roleUpdateRes = await axiosPublic.patch(`/users/${dbUserId}`, {
            role: "seller",
          });

          if (roleUpdateRes.data.success) {
            Swal.fire({
              title: "Approved!",
              text: "Seller request has been approved and role updated.",
              icon: "success",
              confirmButtonColor: "#10B981",
            });

            setIsModalOpen(false);

            const response = await axiosPublic.get("/sellerRequest");
            const data = response.data;
            const filteredUsers = data.filter(
              (user) => user.becomeSellerStatus === selectedRole
            );
            setUsers(filteredUsers);
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to update user role.",
              icon: "error",
              confirmButtonColor: "#EF4444",
            });
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to approve seller request.",
            icon: "error",
            confirmButtonColor: "#EF4444",
          });
        }
      } catch (error) {
        console.error("Approval error:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong!",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    });
  };

  const handleReject = async (userId, dbUserId) => {
    const { value: reason } = await Swal.fire({
      title: "Rejection Reason",
      input: "textarea",
      inputLabel: "Why are you rejecting this seller request?",
      inputPlaceholder: "Enter rejection reason...",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a rejection reason!";
        }
      },
    });

    if (reason) {
      try {
        const sellerReqRes = await axiosPublic.patch(
          `/sellerRequest/${userId}`,
          { becomeSellerStatus: "rejected", rejectionReason: reason }
        );

        if (sellerReqRes.data.success) {
          Swal.fire({
            title: "Rejected!",
            text: "Seller request has been rejected.",
            icon: "success",
            confirmButtonColor: "#10B981",
          });
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          setIsModalOpen(false);
          setRejectionReason("");
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to reject seller request.",
            icon: "error",
            confirmButtonColor: "#EF4444",
          });
        }
      } catch (error) {
        console.error("Rejection error:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "requestDate") {
      return sortDirection === "asc"
        ? new Date(a[sortField]) - new Date(b[sortField])
        : new Date(b[sortField]) - new Date(a[sortField]);
    }
    return sortDirection === "asc"
      ? a[sortField]?.localeCompare(b[sortField])
      : b[sortField]?.localeCompare(a[sortField]);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setRejectionReason(user.rejectionReason || "");
    setIsModalOpen(true);
  };

  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto p-6 rounded-lg">
        {/* Header Section */}
        <Header
          header="Seller Requests"
          title="Review and manage seller auction requests"
        />
        {/* Filter Buttons */}
        <div className="flex justify-center mb-10">
          <div
            className={`inline-flex p-1.5 gap-2 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } shadow-lg transition-all duration-300`}
          >
            {["pending", "accepted", "rejected"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleFilter(role)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedRole === role
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {role === "pending"
                  ? "Sellers Request"
                  : role === "accepted"
                  ? "Accepted Sellers"
                  : "Rejected Sellers"}
              </button>
            ))}
          </div>
        </div>

        {/* Table with Seller Requests */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
              <tr>
                {["name", "email", "requestDate"].map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    <div
                      className="flex items-center cursor-pointer hover:text-indigo-500 transition-colors duration-200"
                      onClick={() => handleSort(field)}
                    >
                      <span>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                      {sortField === field && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FaSortAmountUp size={14} />
                          ) : (
                            <FaSortAmountDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th
                  scope="col"
                  className={`px-4 py-3 text-right text-xs font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors duration-200`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 flex items-center justify-center rounded-full ${
                            isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
                          } transition-colors duration-200`}
                        >
                          <span
                            className={
                              isDarkMode ? "text-indigo-300" : "text-indigo-700"
                            }
                          >
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </td>
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {formatDate(user.requestDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openDetailsModal(user)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all duration-200 flex items-center gap-2"
                        aria-label="View seller request details"
                      >
                        <FaEye />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No seller requests found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between px-4 py-3 sm:px-6 ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } rounded-b-lg shadow-lg mt-4`}
          >
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, sortedUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedUsers.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    } transition-all duration-200`}
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? isDarkMode
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-indigo-100 text-indigo-600 border-indigo-500"
                            : isDarkMode
                            ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        } transition-all duration-200`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    } text-sm font-medium ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } transition-all duration-200`}
                  >
                    Next →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div
            className={`w-full max-w-4xl rounded-2xl shadow-2xl p-8 mx-4 transform transition-all duration-300 scale-95 animate-modal-open ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700"
                : "bg-gradient-to-b from-white to-gray-50 border border-gray-200"
            } max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent`}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full ${
                  isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
                } shadow-md transition-colors duration-200`}
              >
                <span
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  {selectedUser.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h2
                  id="modal-title"
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedUser.name}
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {selectedUser.email}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 capitalize ${
                    selectedUser.becomeSellerStatus === "accepted"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : selectedUser.becomeSellerStatus === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {selectedUser.becomeSellerStatus}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3 text-sm">
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <strong>Phone Number:</strong>{" "}
                  {selectedUser.phoneNumber || "N/A"}
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <strong>Address:</strong> {selectedUser.address || "N/A"}
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <strong>Request Date:</strong>{" "}
                  {formatDate(selectedUser.requestDate)}
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <strong>Document Type:</strong>{" "}
                  {selectedUser.documentType || "N/A"}
                </p>
                {selectedUser.sellerRequestMessage && (
                  <p>
                    <strong>Request Message:</strong>
                    <span
                      className={`block mt-1 p-3 rounded-md text-sm ${
                        isDarkMode
                          ? "bg-gray-800 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedUser.sellerRequestMessage}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Document Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {selectedUser.frontDocument && (
                <div
                  className={`border rounded-lg p-4 ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-white"
                  } shadow-md hover:shadow-lg transition-shadow duration-200`}
                >
                  <p
                    className={`font-medium mb-2 ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Front Document
                  </p>
                  <div className="relative group">
                    <img
                      src={selectedUser.frontDocument}
                      alt="Front Document"
                      className="w-full h-48 object-cover rounded-md border border-gray-300 dark:border-gray-600 transition-transform duration-200 group-hover:scale-105"
                    />
                    <a
                      href={selectedUser.frontDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm rounded-md`}
                      aria-label="View front document in new tab"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>
              )}
              {selectedUser.backDocument && (
                <div
                  className={`border rounded-lg p-4 ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-white"
                  } shadow-md hover:shadow-lg transition-shadow duration-200`}
                >
                  <p
                    className={`font-medium mb-2 ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Back Document
                  </p>
                  <div className="relative group">
                    <img
                      src={selectedUser.backDocument}
                      alt="Back Document"
                      className="w-full h-48 object-cover rounded-md border border-gray-300 dark:border-gray-600 transition-transform duration-200 group-hover:scale-105"
                    />
                    <a
                      href={selectedUser.backDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm rounded-md`}
                      aria-label="View back document in new tab"
                    >
                      View Full Image
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Rejection Reason */}
            {selectedUser.becomeSellerStatus === "rejected" && (
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  } mb-2`}
                >
                  Rejection Reason
                </label>
                <div
                  className={`p-4 rounded-md text-sm ${
                    isDarkMode
                      ? "bg-red-900/30 text-red-300 border-red-600"
                      : "bg-red-50 text-red-800 border-red-300"
                  } border`}
                >
                  {selectedUser.rejectionReason || "No reason provided."}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              className={`flex justify-end gap-3 pt-4 border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                aria-label="Close modal"
              >
                Close
              </button>
              {selectedRole === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleApprove(selectedUser._id, selectedUser.dbUserId)
                    }
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                    aria-label="Approve seller request"
                  >
                    <FcCheckmark size={18} />
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleReject(selectedUser._id, selectedUser.dbUserId)
                    }
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                    aria-label="Reject seller request"
                  >
                    <GiCancel size={18} />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes modal-open {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-open {
          animation: modal-open 0.3s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #6366f1;
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default SellerRequest;