import React, { useState, useEffect, useContext } from "react";
import {
  FaSortAmountUp,
  FaSortAmountDown,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/sellerRequest");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async (userId, role) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the role to ${role}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
      background: isDarkMode ? "#1f2937" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.patch(
            `http://localhost:5000/users/${userId}`,
            { role }
          );
          if (res.data.success) {
            Swal.fire({
              title: "Updated!",
              text: "User role has been changed.",
              icon: "success",
              background: isDarkMode ? "#1f2937" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            });
            // Refresh user list after update
            const response = await fetch("http://localhost:5000/users");
            const data = await response.json();
            setUsers(data);
          } else {
            Swal.fire({
              title: "Failed!",
              text: "Could not update user role.",
              icon: "error",
              background: isDarkMode ? "#1f2937" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            });
          }
        } catch (error) {
          console.error("Error updating role:", error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong!",
            icon: "error",
            background: isDarkMode ? "#1f2937" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          });
        }
      }
    });
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: isDarkMode ? "#1f2937" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/sellerRequest/${userId}`)
          .then((response) => {
            if (response.data.success) {
              Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                icon: "success",
                background: isDarkMode ? "#1f2937" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
              });
              setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== userId)
              );
            } else {
              Swal.fire({
                title: "Error!",
                text: response.data.message,
                icon: "error",
                background: isDarkMode ? "#1f2937" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Failed!",
              text: "Something went wrong.",
              icon: "error",
              background: isDarkMode ? "#1f2937" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            });
          });
      }
    });
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
    <div className={`p-4 min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-6xl mx-auto p-6 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Seller Request Management
        </h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                {["name", "email", "date"].map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}
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
                  className={`px-4 py-3 text-right text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:${isDarkMode ? "bg-gray-700" : "bg-gray-50"} transition-colors`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 flex items-center justify-center rounded-full ${isDarkMode ? "bg-purple-900" : "bg-purple-100"}`}>
                          <span className={isDarkMode ? "text-purple-300" : "text-purple-700"}>
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      {user.email}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      {formatDate(user.date)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <div className="dropdown dropdown-end">
                          <button
                            tabIndex={0}
                            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600 text-blue-400" : "hover:bg-blue-100 text-blue-600"}`}
                            title="Edit User"
                          >
                            <FaEdit size={16} />
                          </button>
                          <ul
                            tabIndex={0}
                            className={`dropdown-content menu p-2 shadow rounded-box w-52 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
                          >
                            <li>
                              <button
                                onClick={() => handleRoleChange(user._id, "seller")}
                                className={`${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
                              >
                                Approve as Seller
                              </button>
                            </li>
                          </ul>
                        </div>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-600 text-red-400" : "hover:bg-red-100 text-red-600"}`}
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
                  <td colSpan="4" className="px-4 py-6 text-center">
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
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
          <div className={`flex items-center justify-between px-4 py-3 sm:px-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} rounded-b-lg`}>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, sortedUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${isDarkMode ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600" : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"} text-sm font-medium ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr; Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
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
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${isDarkMode ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600" : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"} text-sm font-medium ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
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