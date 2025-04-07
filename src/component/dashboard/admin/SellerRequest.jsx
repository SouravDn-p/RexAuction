import React, { useState, useEffect, useContext } from "react";
import { GiCancel } from "react-icons/gi";
import { FcCheckmark } from "react-icons/fc";
import { FaSortAmountUp, FaSortAmountDown, FaEdit } from "react-icons/fa";
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
  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);

    fetch("http://localhost:5000/sellerRequest")
      .then((res) => res.json())
      .then((data) => {
        if (role === "pending") {
          const filtered = data.filter(
            (user) => user.becomeSellerStatus === "pending"
          );
          setUsers(filtered);
        } else if (role === "accepted") {
          const filtered = data.filter(
            (user) => user.becomeSellerStatus === "accepted"
          );
          setUsers(filtered);
        } else if (role === "rejected") {
          const filtered = data.filter(
            (user) => user.becomeSellerStatus === "rejected"
          );
          setUsers(filtered);
        } else {
          setUsers(data); // fallback
        }
      })
      .catch((error) => {
        console.error("Error fetching seller requests:", error);
      });
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/sellerRequest");
        const data = await response.json();
        const acceptedUsers = data.filter(
          (user) => user.becomeSellerStatus === "pending"
        );
        setUsers(acceptedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (userId, dbUserId, role) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the role to ${role}?`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        // First patch request: update seller request status
        const sellerReqRes = await axios.patch(
          `http://localhost:5000/sellerRequest/${userId}`,
          { becomeSellerStatus: role }
        );

        if (sellerReqRes.data.success) {
          // Second patch request: update user's role
          const userRoleRes = await axios.patch(
            `http://localhost:5000/users/${dbUserId}`,
            { role: "seller" }
          );

          Swal.fire("Updated!", "User role has been changed.", "success");

          // Refresh user list after update
          const response = await fetch(
            "http://localhost:5000/sellerRequest/pending"
          );
          const data = await response.json();
          setUsers(data);
        } else {
          Swal.fire("Failed!", "Could not update user role.", "error");
        }
      } catch (error) {
        console.error("Error updating role:", error);
        Swal.fire("Error!", "Something went wrong!", "error");
      }
    });
  };

  // Handle delete user
  const handleDelete = async (userId, role) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Rejected it!",
      background: isDarkMode ? "#1f2937" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.patch(
          `http://localhost:5000/sellerRequest/${userId}`,
          { becomeSellerStatus: role }
        );

        if (res.data.success) {
          Swal.fire({
            title: "Rejected!",
            text: "User has been Rejected.",
            icon: "success",
            background: isDarkMode ? "#1f2937" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          });

          // Remove user from the UI
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
        } else {
          Swal.fire({
            title: "Error!",
            text: res.data.message || "Failed to delete user.",
            icon: "error",
            background: isDarkMode ? "#1f2937" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Failed!",
          text: "Something went wrong.",
          icon: "error",
          background: isDarkMode ? "#1f2937" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        });
      }
    }
  };

  // Sort users
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort logic
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a[sortField]) - new Date(b[sortField])
        : new Date(b[sortField]) - new Date(a[sortField]);
    }
    return sortDirection === "asc"
      ? a[sortField]?.localeCompare(b[sortField])
      : b[sortField]?.localeCompare(a[sortField]);
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

        {/* Filters */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                {["name", "email", "date"].map((field) => (
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
                {selectedRole === "pending" && (
                  <th
                    scope="col"
                    className={`px-4 py-3 text-right text-xs font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Actions
                  </th>
                )}
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
                    {/* Name */}
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

                    {/* Email */}
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </td>

                    {/* Date */}
                    <td
                      className={`px-4 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {formatDate(user.requestDate)}
                    </td>

                    {/* Actions */}
                    {selectedRole === "pending" && (
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <div className=" flex items-center justify-center gap-2">
                            <ul
                              tabIndex={0}
                              className={` rounded-box  ${
                                isDarkMode ? "bg-gray-700" : "bg-white"
                              }`}
                            >
                              <li>
                                <button
                                  onClick={() =>
                                    handleRoleChange(
                                      user?._id,
                                      user?.dbUserId,
                                      "accepted"
                                    )
                                  }
                                  className={`${
                                    isDarkMode
                                      ? "hover:bg-gray-600"
                                      : "hover:bg-white"
                                  }`}
                                >
                                  <FcCheckmark size={16} />
                                </button>
                              </li>
                            </ul>
                            <button
                              onClick={() => handleDelete(user._id, "rejected")}
                              className={`p-2 rounded-full ${
                                isDarkMode
                                  ? "hover:bg-gray-600 text-red-400"
                                  : "hover:bg-red-100 text-red-600"
                              }`}
                              title="Reject User"
                            >
                              <GiCancel size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={selectedRole === "pending" ? 4 : 3}
                    className="px-4 py-6 text-center"
                  >
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No seller requests found there
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
                    <span className="sr-only">Previous</span>
                    &larr; Previous
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
                    <span className="sr-only">Next</span>
                    Next &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerRequest;
