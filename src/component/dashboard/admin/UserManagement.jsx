"use client";

import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {
  FaTrash,
  FaEdit,
  FaUserShield,
  FaUserAlt,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import Swal from "sweetalert2";
import ThemeContext from "../../Context/ThemeContext";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LoadingSpinner from "../../LoadingSpinner";
import Header from "../shared/Header/Header";
import { Star, MessageSquare, Users, Award } from "lucide-react";

const UserManagement = () => {
  const axiosPublic = useAxiosPublic();
  const { isDarkMode } = useContext(ThemeContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const totalFeedbacks = 10;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [selectedRole, setSelectedRole] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosPublic.get("/users");
        setUsers(response.data);
        setLoading(false);
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the role to ${role}?`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.patch(`/users/${userId}`, { role });

          if (res.data.success) {
            Swal.fire("Updated!", "User role has been changed.", "success");

            // Refresh user list after update
            const response = await axiosPublic.get("/users");
            setUsers(response.data);
          } else {
            Swal.fire("Failed!", "Could not update user role.", "error");
          }
        } catch (error) {
          console.error("Error updating role:", error);
          Swal.fire("Error!", "Something went wrong!", "error");
        }
      }
    });
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPublic.delete(`/users/${userId}`);

          if (response.data.success) {
            Swal.fire({
              title: "Deleted!",
              text: "User has been deleted.",
              icon: "success",
              customClass: {
                popup: isDarkMode ? "swal-dark-theme" : "",
              },
            });
            // Remove the user from UI
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user._id !== userId)
            );
          } else {
            Swal.fire({
              title: "Error!",
              text: response.data.message,
              icon: "error",
              customClass: {
                popup: isDarkMode ? "swal-dark-theme" : "",
              },
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Failed!",
            text: "Something went wrong.",
            icon: "error",
            customClass: {
              popup: isDarkMode ? "swal-dark-theme" : "",
            },
          });
        }
      }
    });
  };  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;

    const comparison = a[sortField].localeCompare(b[sortField]);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Stat Card Component
  const StatCard = ({ icon, title, value, color, isDarkMode }) => (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
        isDarkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div
            className={`h-12 w-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
          >
            <div className="text-white">{icon}</div>
          </div>
          <div>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {title}
            </p>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Role counts for the dashboard
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-96 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 md:p-6 h-full ${
        isDarkMode
          ? "bg-gray-900 border-gray-600 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50 placeholder-gray-500"
      }`}
    >
      {/* Header with Title and Search */}
      <Header
        header={"User Management"}
        title={
          "Manage users, monitor activity, and keep your platform organized"
        }
      />
      {/* Statistics Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 delay-100 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <StatCard
          icon={<FaUserAlt className="w-6 h-6" />}
          title="Total Users"
          value={users?.length || 0}
          color="from-amber-500 to-yellow-500"
          isDarkMode={isDarkMode}
        />

        <StatCard
          icon={<FaUserShield className="w-6 h-6" />}
          title="Admins"
          value={roleCounts.admin || 0}
          color="from-violet-500 to-purple-500"
          isDarkMode={isDarkMode}
        />

        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Sellers"
          value={roleCounts.seller || 0}
          color="from-blue-500 to-indigo-500"
          isDarkMode={isDarkMode}
        />

        <StatCard
          icon={<FaUserAlt className="w-6 h-6" />}
          title="5-Star Reviews"
          value={roleCounts.buyer || 0}
          color="from-emerald-500 to-teal-500"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleRoleFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "all"
                ? isDarkMode
                  ? "bg-purple-600 text-white"
                  : "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => handleRoleFilter("admin")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "admin"
                ? isDarkMode
                  ? "bg-purple-600 text-white"
                  : "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => handleRoleFilter("seller")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "seller"
                ? isDarkMode
                  ? "bg-purple-600 text-white"
                  : "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sellers
          </button>
          <button
            onClick={() => handleRoleFilter("buyer")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedRole === "buyer"
                ? isDarkMode
                  ? "bg-purple-600 text-white"
                  : "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Buyers
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {filteredUsers.length} users found
          </span>
        </div>
      </div>

      {/* User Table */}
      <div
        className={`overflow-x-auto rounded-lg border ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <table
          className={`min-w-full divide-y ${
            isDarkMode
              ? "divide-gray-700 bg-gray-800"
              : "divide-gray-200 bg-white"
          }`}
        >
          <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <span>User</span>
                  {sortField === "name" && (
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell"
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <span>Email</span>
                  {sortField === "email" && (
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <span>Registration Date</span>
                  {sortField === "date" && (
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  <span>Role</span>
                  {sortField === "role" && (
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
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr
                  key={user._id || index}
                  className={`${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
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
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.date || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : user.role === "seller"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className={`p-1 rounded-full ${
                          isDarkMode
                            ? "hover:bg-gray-600 text-blue-400 hover:text-blue-300"
                            : "hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                        }`}
                        title="Edit User"
                      >
                        <div className="dropdown dropdown-center z-30">
                          <div tabIndex={0} role="button" className="btn">
                            <FaEdit size={16} />
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                          >
                            <li>
                              <a
                                onClick={() =>
                                  handleRoleChange(user._id, "admin")
                                }
                              >
                                Admin
                              </a>
                            </li>
                            <li>
                              <a
                                onClick={() =>
                                  handleRoleChange(user._id, "buyer")
                                }
                              >
                                Buyer
                              </a>
                            </li>
                            <li>
                              <a
                                onClick={() =>
                                  handleRoleChange(user._id, "seller")
                                }
                              >
                                Seller
                              </a>
                            </li>
                          </ul>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className={`p-1 rounded-full ${
                          isDarkMode
                            ? "hover:bg-gray-600 text-red-400 hover:text-red-300"
                            : "hover:bg-red-100 text-red-600 hover:text-red-800"
                        }`}
                        title="Delete User"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm">
                  No users found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {indexOfFirstUser + 1} to{" "}
            {Math.min(indexOfLastUser, sortedUsers.length)} of{" "}
            {sortedUsers.length} users
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number
                    ? isDarkMode
                      ? "bg-purple-600 text-white"
                      : "bg-purple-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add custom styles for SweetAlert2 in dark mode */}
      {isDarkMode && (
        <style jsx global>{`
          .swal-dark-theme {
            background-color: #1f2937 !important;
            color: #f3f4f6 !important;
          }
          .swal-dark-theme .swal2-title,
          .swal-dark-theme .swal2-content {
            color: #f3f4f6 !important;
          }
          .swal-dark-theme .swal2-html-container {
            color: #d1d5db !important;
          }
        `}</style>
      )}
    </div>
  );
};

export default UserManagement;
