import React, { useEffect, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { TbLock } from "react-icons/tb";
import { FaPen } from "react-icons/fa";

const SellerRequest = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/sellerRequest")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  });
  return (
    <div>
      <div className="text-black ">
        <div>
          {/* Navbar Left: Search */}
          <div className=" flex items-center justify-between p-3">
            <p className="text-center font-bold text-3xl">Seller Request Management</p>
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
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                  {/* <th className="py-3 px-6 text-left">Actions</th> */}
                </tr>
              </thead>
              {users.map((user, index) => (
                <tbody className=" text-sm font-light">
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 text-left">{user.seller_name}</td>
                    <td className="py-3 px-6 text-left">{user.email}</td>
                    <td className="py-3 px-6 text-left">{user.category}</td>
                    <td className="py-3 px-6 text-left">{user.description}</td>
                    <div>
                    <td className="py-3 px-6 text-left"><FaPen />                    </td>
                    <td className="py-3 px-6 text-left"><TbLock />                    </td>
                    <td className="py-3 px-6 text-left"><FaDeleteLeft /></td>

                    </div>
                    
                    {/* <td className="py-3 px-6 text-left">✓</td> */}
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;
