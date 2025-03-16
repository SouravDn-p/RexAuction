import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
const dummyAnnouncements = [
  {
    id: 1,
    title: "Platform Maintenance Schedule Update",
    date: "2024-02-15",
    status: "Published",
  },
  {
    id: 2,
    title: "New Bidding Features Released",
    date: "2024-02-14",
    status: "Published",
  },
  {
    id: 3,
    title: "Holiday Season Operating Hours",
    date: "2024-02-13",
    status: "Draft",
  },
  {
    id: 4,
    title: "Updates to User Agreement",
    date: "2024-02-12",
    status: "Published",
  },
  {
    id: 5,
    title: "Upcoming Platform Enhancements",
    date: "2024-02-11",
    status: "Draft",
  },
];

const statusColors = {
  Published: "bg-green-200 text-green-800",
  Draft: "bg-gray-300 text-gray-800",
};

const AnnouncementManage = () => {
  const [announcements] = useState(dummyAnnouncements);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-purple-50 min-h-screen p-4 md:p-10">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
              Announcement Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and publish announcements for RexAuction platform
            </p>
          </div>
          <Link to="create_announcement">
            <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition">
              <FaPlus /> Create New Announcement
            </button>
          </Link>
        </div>

        {/* Table */}
        <motion.div
          className="bg-white shadow-md rounded-xl overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <table className="min-w-full text-sm md:text-base">
            <thead className="bg-purple-100 text-purple-700 text-left">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement, i) => (
                <motion.tr
                  key={announcement.id}
                  className={`border-t ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <FaBell className="text-purple-500" />
                    {announcement.title}
                  </td>
                  <td className="py-3 px-4">{announcement.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[announcement.status]
                      }`}
                    >
                      {announcement.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-3">
                    <button className="text-purple-600 hover:underline flex items-center gap-1">
                      <FaEdit /> Edit
                    </button>
                    <button className="text-red-500 hover:underline flex items-center gap-1">
                      <FaTrash /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <span>Showing 1 to 5 of 12 results</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-md hover:bg-purple-100">
              &lt; Previous
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-purple-100">
              2
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-purple-100">
              3
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-purple-100">
              Next &gt;
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnnouncementManage;
