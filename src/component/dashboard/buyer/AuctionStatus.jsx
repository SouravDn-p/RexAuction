import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeContext from "../../Context/ThemeContext";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../../../firebase/firebase.init";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
// images for demo auction data
import antique from "../../../../public/DemoAuctionImg/antique.jpg";
import antique2 from "../../../../public/DemoAuctionImg/antique2.jpg";
import antique3 from "../../../../public/DemoAuctionImg/antique3.jpg";
import antique4 from "../../../../public/DemoAuctionImg/antique4.jpeg";
import antique5 from "../../../../public/DemoAuctionImg/antique5.jpeg";
import antique6 from "../../../../public/DemoAuctionImg/antique6.jpeg";

const AuctionStatus = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const axiosSecure = useAxiosSecure();

  // Get buyer info from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBuyerInfo({
          buyerName: user.displayName || "Unknown Buyer",
          buyerEmail: user.email,
          buyerPhoto: user.photoURL || "https://i.ibb.co/ck1SGFJ/avatar.png",
        });
      } else {
        setBuyerInfo(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all auction data
  const { data: allAuctions = [], isLoading } = useQuery({
    queryKey: ["userAuctionData", buyerInfo?.buyerEmail],
    enabled: !!buyerInfo?.buyerEmail,
    queryFn: async () => {
      const res = await axiosSecure.get("/auctions");
      return res.data || [];
    },
  });

  // Extract only auctions the user has participated in
  const bids = allAuctions
    .filter((auction) => Array.isArray(auction.bidders))
    .filter((auction) =>
      auction.bidders.some((b) => b.email === buyerInfo?.buyerEmail)
    )
    .map((auction) => {
      const userBid = auction.bidders.find(
        (b) => b.email === buyerInfo?.buyerEmail
      );

      return {
        id: auction._id,
        product: auction.name,
        image: auction.images?.[0] || antique,
        position: userBid?.position ?? "-",
        totalBidders: auction.bidders.length,
        isWinning: userBid?.isWinning ?? false,
      };
    });

  const filteredBids = bids.filter((bid) => {
    if (filterStatus === "All") return true;
    if (filterStatus === "Won") return bid.isWinning;
    if (filterStatus === "Lost") return !bid.isWinning;
  });

  // Demo data to show when no bids are found
  const demoData = [
    {
      id: "1",
      product: "Antique Vase",
      image: antique,
      position: "1",
      totalBidders: 5,
      isWinning: true,
    },
    {
      id: "2",
      product: "Old Painting",
      image: antique2,
      position: "2",
      totalBidders: 8,
      isWinning: false,
    },
    {
      id: "3",
      product: "Vintage Car",
      image: antique3,
      position: "1",
      totalBidders: 6,
      isWinning: true,
    },
    {
      id: "4",
      product: "Gold Watch",
      image: antique4,
      position: "3",
      totalBidders: 4,
      isWinning: false,
    },
    {
      id: "5",
      product: "Diamond Necklace",
      image: antique5,
      position: "1",
      totalBidders: 7,
      isWinning: true,
    },
    {
      id: "6",
      product: "Rare Sculpture",
      image: antique6,
      position: "2",
      totalBidders: 9,
      isWinning: false,
    },
  ];

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

  if (!buyerInfo || isLoading) {
    return (
      <div className="text-center mt-20 text-gray-500 dark:text-gray-300 animate-pulse">
        Loading your profile...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${themeStyles.background} ${themeStyles.text}`}
    >
      {/* Buyer Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex flex-col sm:flex-row items-center sm:justify-between ${
          isDarkMode ? "bg-gray-800" : "bg-purple-100"
        } rounded-lg shadow p-6 mb-8`}
      >
        <div className="flex items-center gap-4">
          <img
            src={buyerInfo.buyerPhoto}
            alt="Buyer"
            className="w-20 h-20 rounded-full border-4 border-purple-500"
          />
          <div>
            <h2 className="text-xl font-bold">{buyerInfo.buyerName}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {buyerInfo.buyerEmail}
            </p>
          </div>
        </div>
      </motion.div>

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
            {filteredBids.length === 0
              ? demoData
                  .filter((bid) => {
                    if (filterStatus === "All") return true;
                    if (filterStatus === "Won") return bid.isWinning;
                    if (filterStatus === "Lost") return !bid.isWinning;
                  })
                  .map((bid) => (
                    <tr
                      key={bid.id}
                      className={`${themeStyles.tableHover} border-b ${themeStyles.border}`}
                    >
                      <td className="py-3 px-4">
                        <img
                          src={bid.image}
                          alt={bid.product}
                          className="w-20 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4">{bid.product}</td>
                      <td className="py-3 px-4">
                        #{bid.position} / {bid.totalBidders}
                        {/* Progress Bar */}
                        <div className="relative pt-1 mt-2">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="font-bold text-sm">
                                Position
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                #{bid.position} / {bid.totalBidders}
                              </span>
                            </div>
                          </div>
                          <div className="flex mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-teal-500 h-2.5 rounded-full"
                                style={{
                                  width: `${
                                    (bid.position / bid.totalBidders) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            bid.isWinning
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {bid.isWinning ? "Won" : "Lost"}
                        </span>
                      </td>
                    </tr>
                  ))
              : filteredBids.map((bid) => (
                  <tr
                    key={bid.id}
                    className={`${themeStyles.tableHover} border-b ${themeStyles.border}`}
                  >
                    <td className="py-3 px-4">
                      <img
                        src={bid.image}
                        alt={bid.product}
                        className="w-20 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4">{bid.product}</td>
                    <td className="py-3 px-4">
                      #{bid.position} / {bid.totalBidders}
                      {/* Progress Bar */}
                      <div className="relative pt-1 mt-2">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="font-bold text-sm">Position</span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                              #{bid.position} / {bid.totalBidders}
                            </span>
                          </div>
                        </div>
                        <div className="flex mb-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-teal-500 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (bid.position / bid.totalBidders) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          bid.isWinning
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {bid.isWinning ? "Won" : "Lost"}
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
