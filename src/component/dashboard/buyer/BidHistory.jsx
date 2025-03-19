import React, { useState } from "react";
import { FaSearch, FaSort } from "react-icons/fa";
import img from "../../../assets/LiveBidAuctionDetails.jpg";

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
    <div className="w-11/12 mx-auto my-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Bid History</h2>

      {/* Search & Sorting Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Search by bidder, bid amount, or status"
          />
          <FaSearch className="absolute top-3 right-3 text-gray-600" />
        </div>

        {/* Sort Button */}
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="px-4 py-2 flex items-center gap-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300"
        >
          <FaSort /> {sortOrder === "desc" ? "Sort: Highest to Lowest" : "Sort: Lowest to Highest"}
        </button>
      </div>

      {/* Bid History Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Bidder</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Bid Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBids.map((bid, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">
                  <div className="flex items-center gap-3">
                    <img src={img} alt="Bidder" className="w-10 h-10 rounded-full" />
                    <span>{bid.bidder}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-purple-600 font-semibold">${bid.bidAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{bid.time}</td>
                <td
                  className={`px-6 py-4 text-sm font-semibold ${
                    bid.status === "Won" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {bid.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Previous
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Next
        </button>
      </div>
    </div>
  );
}
