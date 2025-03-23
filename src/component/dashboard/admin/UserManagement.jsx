import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  });
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
        axios.delete(`http://localhost:5000/users/${userId}`)
          .then((response) => {
            if (response.data.success) {
              Swal.fire("Deleted!", "User has been deleted.", "success");
              // Remove the user from UI
              setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
            } else {
              Swal.fire("Error!", response.data.message, "error");
            }
          })
          .catch((error) => {
            Swal.fire("Failed!", "Something went wrong.", "error");
          });
      }
    });
  };
  return (
    <div className="text-black">
      <div>
        {/* Navbar Left: Search */}
        <div className=" flex items-center justify-between p-3">
          <p className="text-center font-bold text-3xl">User Management</p>
          <input
            type="text"
            placeholder="Search..."
            // value={searchQuery}
            // onChange={handleSearchChange}
            className="border rounded-md px-3 py-2 pr-8 w-full md:w-64 text-black dark:text-white"
          />
          {/* <Search className="absolute right-2 h-4 w-4 text-gray-500 dark:text-gray-300" /> */}
        </div>

        <div>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Registration Date</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Action</th>
                {/* <th className="py-3 px-6 text-left">Actions</th> */}
              </tr>
            </thead>
            {users.map((user, index) => (
              <tbody className=" text-sm font-light">
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-6 text-left">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.date}</td>
                  <td className="py-3 px-6 text-left">{user.role}</td>
                  <button onClick={() => handleDelete(user._id)}>
                    <FaDeleteLeft className="text-red-500 cursor-pointer" />
                  </button>

                  {/* <td className="py-3 px-6 text-left">✓</td> */}
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
