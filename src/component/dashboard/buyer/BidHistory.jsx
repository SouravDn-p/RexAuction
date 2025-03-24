import React, { useContext, useState } from "react";
import { FaSearch, FaSort } from "react-icons/fa";
import img from "../../../assets/LiveBidAuctionDetails.jpg";
import ThemeContext from "../../Context/ThemeContext";

export default function BidHistory() {
  // Sample bid history data
  const bids = [
    { bidder: "John Doe", bidAmount: 8000, time: "2025-03-15 10:00:00", status: "Won" },
    { bidder: "Jane Smith", bidAmount: 7500, time: "2025-03-14 08:30:00", status: "Lost" },
    { bidder: "David Johnson", bidAmount: 7000, time: "2025-03-13 05:15:00", status: "Won" },
    { bidder: "Sarah Brown", bidAmount: 6000, time: "2025-03-12 12:45:00", status: "Lost" },
    { bidder: "Chris Evans", bidAmount: 5000, time: "2025-03-11 09:00:00", status: "Lost" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
 const {isDarkMode} = useContext(ThemeContext)

  // Filter bids by search query
  const filteredBids = bids
    .filter(
      (bid) =>
        bid.bidder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.bidAmount.toString().includes(searchQuery) ||
        bid.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (sortOrder === "desc" ? b.bidAmount - a.bidAmount : a.bidAmount - b.bidAmount));

  return (
    <div
      className={`p-4 md:p-6 h-full ${
        isDarkMode
          ? "bg-gray-900 border-gray-600 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50 placeholder-gray-500"
      }`}
    >
      {/* Header with Title and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1
          className={`text-2xl md:text-3xl font-bold ${
            isDarkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-violet-100"
              : "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
          }`}
        >
          Bid History
        </h1>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search bids..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortOrder("desc")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortOrder === "desc"
                ? isDarkMode
                  ? "bg-purple-600 text-white"
                  : "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sort: Highest to Lowest
          </button>
          <button
            onClick={() => setSortOrder("asc")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortOrder === "asc"
                ? isDarkMode
                  ? "bg-purple-600 text-white"
                  : "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sort: Lowest to Highest
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {filteredBids.length} bids found
          </span>
        </div>
      </div>

      {/* Bid History Table */}
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
          <thead className={isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-black"}>
            <tr>
              <th
                scope="col"
                className="px-6  py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Bidder
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Bid Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {filteredBids.length > 0 ? (
              filteredBids.map((bid, index) => (
                <tr
                  key={index}
                  className={`${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50 text-gray-600"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img src={img} alt="Bidder" className="w-10 h-10 rounded-full" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{bid.bidder}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-purple-600">
                      ${bid.bidAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {bid.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bid.status === "Won"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {bid.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm">
                  No bids found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredBids.length} of {bids.length} bids
        </div>

        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 rounded-md ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
          >
            Previous
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}