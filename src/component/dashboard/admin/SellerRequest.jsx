import React, { useState, useEffect, useContext } from "react";
import { GiCancel } from "react-icons/gi";
import { FcCheckmark } from "react-icons/fc";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContexts } from "../../../providers/AuthProvider";

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

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);
    fetch("https://un-aux.onrender.com/sellerRequest")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (user) => user.becomeSellerStatus === role
        );
        setUsers(filtered);
      })
      .catch((error) =>
        console.error("Error fetching seller requests:", error)
      );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://un-aux.onrender.com/sellerRequest"
        );
        const data = await response.json();
        const pendingUsers = data.filter(
          (user) => user.becomeSellerStatus === "pending"
        );
        setUsers(pendingUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (userId, dbUserId) => {
    console.log("userId", userId);
    console.log("dbUserId", dbUserId);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this seller request?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        // Step 1: Update seller request status
        const sellerReqRes = await axios.patch(
          `https://un-aux.onrender.com/sellerRequest/${userId}`,
          { becomeSellerStatus: "accepted" }
        );

        if (sellerReqRes.data.success) {
          // Step 2: Update user role to "seller"
          const roleUpdateRes = await axios.patch(
            `https://un-aux.onrender.com/users/${dbUserId}`,
            { role: "seller" }
          );

          if (roleUpdateRes.data.success) {
            Swal.fire(
              "Approved!",
              "Seller request has been approved and role updated.",
              "success"
            );

            // Step 3: Refresh UI
            setIsModalOpen(false);
            const response = await fetch(
              "https://un-aux.onrender.com/sellerRequest"
            );
            const data = await response.json();
            const pendingUsers = data.filter(
              (user) => user.becomeSellerStatus === "pending"
            );
            setUsers(pendingUsers);
          } else {
            Swal.fire("Error!", "Failed to update user role.", "error");
          }
        } else {
          Swal.fire("Error!", "Failed to approve seller request.", "error");
        }
      } catch (error) {
        console.error("Approval error:", error);
        Swal.fire("Error!", "Something went wrong!", "error");
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a rejection reason!";
        }
      },
    });

    if (reason) {
      try {
        const sellerReqRes = await axios.patch(
          `https://un-aux.onrender.com/sellerRequest/${userId}`,
          { becomeSellerStatus: "rejected", rejectionReason: reason }
        );

        if (sellerReqRes.data.success) {
          Swal.fire(
            "Rejected!",
            "Seller request has been rejected.",
            "success"
          );
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          setIsModalOpen(false);
          setRejectionReason("");
        } else {
          Swal.fire("Error!", "Failed to reject seller request.", "error");
        }
      } catch (error) {
        Swal.fire("Failed!", "Something went wrong.", "error");
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
      }`}
    >
      <div
        className={`max-w-6xl mx-auto p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <h1
          className={`text-2xl md:text-3xl font-bold mb-6 text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Seller Request Management
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex flex-wrap gap-2">
            {["pending", "accepted", "rejected"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleFilter(role)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedRole === role
                    ? "bg-purple-600 text-white"
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
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
                      className="flex items-center cursor-pointer hover:text-blue-500 transition-colors"
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
                    } transition-colors`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 flex items-center justify-center rounded-full ${
                            isDarkMode ? "bg-purple-900" : "bg-purple-100"
                          }`}
                        >
                          <span
                            className={
                              isDarkMode ? "text-purple-300" : "text-purple-700"
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
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openDetailsModal(user)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                        >
                          Details
                        </button>
                      </div>
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

        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between px-4 py-3 sm:px-6 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            } rounded-b-lg`}
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
                    }`}
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
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-blue-50 text-blue-600 border-blue-500"
                            : isDarkMode
                            ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
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
                    }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-lg p-6 mx-4 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full ${
                  isDarkMode ? "bg-purple-900" : "bg-purple-100"
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  {selectedUser.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-3 text-sm text-gray-800 dark:text-gray-200 mb-6">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {selectedUser.phoneNumber || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address || "N/A"}
              </p>
              <p>
                <strong>Request Date:</strong>{" "}
                {formatDate(selectedUser.requestDate)}
              </p>
              <p>
                <strong>Document Type:</strong>{" "}
                {selectedUser.documentType || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                    selectedUser.becomeSellerStatus === "accepted"
                      ? "bg-green-100 text-green-800"
                      : selectedUser.becomeSellerStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedUser.becomeSellerStatus}
                </span>
              </p>
              {selectedUser.sellerRequestMessage && (
                <p>
                  <strong>Request Message:</strong>{" "}
                  <span className="block mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300">
                    {selectedUser.sellerRequestMessage}
                  </span>
                </p>
              )}
            </div>

            {/* Document Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedUser.frontDocument && (
                <div className="border p-3 rounded-lg dark:border-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                    Front Document
                  </p>
                  <img
                    src={selectedUser.frontDocument}
                    alt="Front Document"
                    className="w-full h-48 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  />
                  <a
                    href={selectedUser.frontDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block text-sm"
                  >
                    View Full Image
                  </a>
                </div>
              )}

              {selectedUser.backDocument && (
                <div className="border p-3 rounded-lg dark:border-gray-700">
                  <p className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                    Back Document
                  </p>
                  <img
                    src={selectedUser.backDocument}
                    alt="Back Document"
                    className="w-full h-48 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  />
                  <a
                    href={selectedUser.backDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block text-sm"
                  >
                    View Full Image
                  </a>
                </div>
              )}
            </div>

            {/* Rejection Reason */}
            {selectedUser.becomeSellerStatus === "rejected" && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                  Rejection Reason
                </label>
                <div className="p-3 bg-red-50 dark:bg-gray-800 border border-red-300 dark:border-red-600 text-sm text-red-800 dark:text-red-300 rounded-md">
                  {selectedUser.rejectionReason || "No reason provided."}
                </div>
              </div>
            )}

            {/* Action Buttons at Bottom */}
            {selectedRole === "pending" && (
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    handleApprove(selectedUser._id, selectedUser.dbUserId)
                  }
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    handleReject(selectedUser._id, selectedUser.dbUserId)
                  }
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Reject
                </button>
              </div>
            )}
            {selectedRole !== "pending" && (
              <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerRequest;
