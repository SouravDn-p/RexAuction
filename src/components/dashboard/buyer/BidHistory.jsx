import React, { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import useBidHistory from "../../../hooks/useBidHistory";
import LoadingSpinner from "../../LoadingSpinner";
export default function BidHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [bidHistory, refetch, isLoading] = useBidHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetch]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  const filteredBids = bidHistory
    .filter(
      (bid) =>
        bid?.bidder?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid?.bidAmount?.toString().includes(searchQuery) ||
        bid?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid?.auctionTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? b.bidAmount - a.bidAmount
        : a.bidAmount - b.bidAmount
    );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div
      className={`p-4 md:p-6 h-full ${
        isDarkMode
          ? "bg-gray-900 border-gray-600 font-medium text-white"
          : "bg-gradient-to-b font-medium from-purple-100 via-white to-purple-50 placeholder-gray-500"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1
          className={`text-2xl md:text-3xl font-bold ${
            isDarkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-violet-100"
              : "text-gray-700"
          }`}
        >
          Bid History
        </h1>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search bids..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <FaSearch
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? "text-gray-200" : "text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Sort & Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortOrder("desc")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortOrder === "desc"
                ? "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sort (High → Low)
          </button>
          <button
            onClick={() => setSortOrder("asc")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sortOrder === "asc"
                ? "bg-purple-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sort (Low → High)
          </button>
        </div>

        <span
          className={`text-sm ${
            isDarkMode ? "text-white font-medium" : "text-gray-600 font-medium"
          }`}
        >
          {filteredBids?.length} bids found
        </span>
      </div>

      {/* Table */}
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
          <thead
            className={
              isDarkMode ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-black"
            }
          >
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Bidder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Bid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Position
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            {filteredBids?.length > 0 ? (
              filteredBids.map((bid, index) => (
                <tr
                  key={index}
                  className={`${
                    isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-50 text-gray-600"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={bid?.auctionImage}
                        alt="Bidder"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-4 text-sm font-medium">
                        {bid?.auctionTitle}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${bid?.bidAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatTime(bid?.time)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        bid.status === "End"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {bid?.status}
                    </span>
                    <button
                      onClick={() =>
                        bid?.status === "End"
                          ? navigate(`/dashboard/status`)
                          : navigate(`/liveBid/${bid.auctionId}`)
                      }
                      className={`px-2 py-1 rounded-full text-xs ${
                        bid.status === "End"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {bid.status === "End" ? "auction status" : "live bids"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    # {bid?.position}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm">
                  No bids found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        <div
          className={`text-sm ${isDarkMode ? "text-white" : "text-gray-600"}`}
        >
          Showing {filteredBids?.length} of bids
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-800">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-800">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
