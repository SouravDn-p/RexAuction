import React, { useContext, useEffect, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { TbLock } from "react-icons/tb";
import { FaPen } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";

const SellerRequest = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/sellerRequest")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  });
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="">
      <div className="">
        <div
          className={`text-lg h-[500px] mb-4 ${
            isDarkMode ? "bg-gray-800 text-gray-300" : "bg-purple-200 text-gray-600"
          }`}
        >
          <div>
            {/* Navbar Left: Search */}
            <div className="flex items-center justify-between p-3">
              <p className="text-center font-bold text-3xl">Seller Request Management</p>
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-md px-3 py-2 pr-8 w-full md:w-64 text-black dark:text-white"
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr
                    className={`text-gray-600 uppercase text-sm leading-normal ${
                      isDarkMode ? "bg-gray-500" : "bg-gray-200"
                    }`}
                  >
                    <th className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">User ID</th>
                    <th className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">Username</th>
                    <th className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">Email</th>
                    <th className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">Category</th>
                    <th className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">Description</th>
                    <th className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">Actions</th>
                  </tr>
                </thead>
                {users.map((user, index) => (
                  <tbody className="text-sm font-light">
                    <tr
                      className={`border-b border-gray-200 hover:bg-gray-100 ${
                        isDarkMode ? "bg-gray-500" : "bg-gray-200"
                      }`}
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap text-xs sm:text-sm md:text-base">
                        {index + 1}
                      </td>
                      <td className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">
                        {user.seller_name}
                      </td>
                      <td className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">
                        {user.email}
                      </td>
                      <td className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">
                        {user.category}
                      </td>
                      <td className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">
                        {user.description}
                      </td>
                      <td className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">
                        <FaPen />
                      </td>
                      <td className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">
                        <TbLock />
                      </td>
                      <td className="py-3 px-6 text-left text-xs sm:text-sm md:text-base">
                        <FaDeleteLeft />
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;
