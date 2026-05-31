import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeContext from "../../Context/ThemeContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useBidHistory from "../../../hooks/useBidHistory";

const AuctionStatus = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [filterStatus, setFilterStatus] = useState("All");
  const [bidHistory, refetch, isLoading] = useBidHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);
    return () => clearInterval(interval);
  }, [refetch]);

  const filteredBids = bidHistory.filter((bid) => {
    if (filterStatus === "All") return true;
    if (filterStatus === "Won") return bid.status === "Won";
    if (filterStatus === "Lost") return bid.status === "Lost";
    return false;
  });

  const themeStyles = {
    background: isDarkMode ? "bg-gray-900" : "bg-gray-100",
    text: isDarkMode ? "text-white" : "text-gray-900",
    tableBg: isDarkMode ? "bg-gray-800" : "bg-white",
    tableHeaderBg: isDarkMode ? "bg-gray-700" : "bg-gray-200",
    tableHover: isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-50",
    border: isDarkMode ? "border-gray-700" : "border-gray-300",
    buttonBg: isDarkMode ? "bg-gray-600" : "bg-gray-300",
    buttonText: isDarkMode ? "text-white" : "text-gray-700",
    buttonHover: isDarkMode ? "hover:bg-gray-500" : "hover:bg-gray-400",
    activeFilterBg: "bg-purple-600",
    activeFilterText: "text-white",
  };

  if (isLoading) {
    return (
      <div className="text-center mt-20 text-gray-500 dark:text-gray-300 animate-pulse">
        Loading your auctions...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${themeStyles.background} ${themeStyles.text}`}
    >
      {/* Filter Buttons */}
      <div className="flex justify-center sm:justify-start gap-3 mb-6">
        {["All", "Won", "Lost"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? `${themeStyles.activeFilterBg} ${themeStyles.activeFilterText}`
                : `${themeStyles.buttonBg} ${themeStyles.buttonText} ${themeStyles.buttonHover}`
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bids Table */}
      <div
        className={`overflow-x-auto rounded-lg shadow ${themeStyles.border}`}
      >
        <table
          className={`min-w-full ${themeStyles.tableBg} rounded-lg overflow-hidden`}
        >
          <thead className={`${themeStyles.tableHeaderBg}`}>
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Position</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredBids.map((bid) => (
              <tr
                key={bid.auctionId}
                className={`${themeStyles.tableHover} border-b ${themeStyles.border}`}
              >
                <td className="py-3 px-4">
                  <img
                    src={bid.auctionImage}
                    alt={bid.auctionTitle}
                    className="w-20 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4">{bid.auctionTitle}</td>
                <td className="py-3 px-4">
                  #{bid.position} / {bid.topBiddersLength}
                  <div className="relative pt-1 mt-2">
                    <div className="flex mb-2 items-center justify-between">
                      <span className="font-bold text-sm">Position</span>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                        #{bid.position} / {bid.topBiddersLength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-teal-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            bid.position !== "N/A" && bid.topBiddersLength
                              ? (parseInt(bid.position) / bid.topBiddersLength) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      bid.status === "Won"
                        ? "bg-green-200 text-green-800"
                        : bid.status === "Lost"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {bid.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuctionStatus;