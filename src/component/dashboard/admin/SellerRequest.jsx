import React, { useState, useEffect, useContext } from "react";
import { FaSortAmountUp, FaSortAmountDown, FaTrash, FaEdit } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContexts } from "../../../providers/AuthProvider";

const SellerRequest = () => {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const { isDarkMode } = useContext(ThemeContext);
  const { dbUser, user } = useContext(AuthContexts);
  console.log(dbUser);

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
          const res = await axios.patch(`http://localhost:3000/users/${userId}`, { role });
          if (res.data.success) {
            Swal.fire("Updated!", "User role has been changed.", "success");
            // Refresh user list after update
            const response = await fetch("http://localhost:3000/users");
            const data = await response.json();
            setUsers(data);
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
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/sellerRequest/${userId}`)
          .then((response) => {
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
          })
          .catch((error) => {
            Swal.fire({
              title: "Failed!",
              text: "Something went wrong.",
              icon: "error",
              customClass: {
                popup: isDarkMode ? "swal-dark-theme" : "",
              },
            });
          });
      }
    });
  };
  useEffect(() => {
    fetch("http://localhost:3000/sellerRequest")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

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
    return sortDirection === "asc"
      ? a[sortField]?.localeCompare(b[sortField])
      : b[sortField]?.localeCompare(a[sortField]);
  });

  return (
    <div className="p-4">
      <p className="text-center font-bold text-3xl mb-4">Seller Request Management</p>
      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              {["name", "email", "date"].map((field) => (
                <th key={field} className="px-6 py-3 text-left text-xs font-medium uppercase">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort(field)}>
                    <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    {sortField === field && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedUsers.map((user, index) => (
              <tr key={user._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full">
                    <span className="text-purple-700 dark:text-purple-300">{user.name?.charAt(0).toUpperCase() || "?"}</span>
                  </div>
                  <span className="ml-4">{user.name}</span>
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.date || "N/A"}</td>
                <td className="px-6 py-4 text-right flex justify-end space-x-2">
                  <button
                    className={`p-1 rounded-full ${
                      isDarkMode
                        ? "hover:bg-gray-600 text-blue-400 hover:text-blue-300"
                        : "hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                    }`}
                    title="Edit User"
                  >
                    <div className="dropdown dropdown-center ">
                      <div tabIndex={0} role="button" className="btn">
                        <FaEdit size={16} />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                      >
                        <li>
                          <a onClick={() => handleRoleChange(dbUser._id, "seller")}>Seller</a>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerRequest;
