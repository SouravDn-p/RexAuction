import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axios from "axios";

const AuctionStatus = ({ userRole, userId }) => {
  const navigate = useNavigate();
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [hasAlertShown, setHasAlertShown] = useState(false);

  // Fetch buyer details from backend
  useEffect(() => {
    const fetchBuyerInfo = async () => {
      try {
        const response = await axios
          .get
          //   user data fetching api
          ();
        setBuyerInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch buyer info:", error);
      }
    };

    fetchBuyerInfo();
  }, [userId]);

  // Show payment popup only after winning
  useEffect(() => {
    if (buyerInfo?.isWinning && buyerInfo?.hasDuePayment && !hasAlertShown) {
      setHasAlertShown(true); // Preventing multiple alerts

      Swal.fire({
        title: "You Won the Bid! 🎉",
        text: "Make payment to claim your winnings.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      });
    }
  }, [buyerInfo, hasAlertShown]);

  if (!buyerInfo) {
    return (
      <div className="text-center text-gray-600 mt-20 animate-pulse">
        Fetching your bidding status...
      </div>
    );
  }

  const {
    isBuyer,
    buyerName,
    buyerPhoto,
    currentPosition,
    totalBidders,
    isWinning,
    hasDuePayment,
  } = buyerInfo;

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-3xl mt-10 border border-purple-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        {isBuyer ? "Your Bidding Status" : "Buyer Bidding Status"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <motion.div
          className="p-6 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 shadow-lg text-center"
          whileHover={{ scale: 1.03 }}
        >
          <img
            src={buyerPhoto || "https://i.ibb.co/ck1SGFJ/avatar.png"}
            alt="Buyer"
            className="w-24 h-24 mx-auto rounded-full border-4 border-purple-400 shadow-md mb-4"
          />
          <p className="text-gray-600 text-sm">Buyer Name</p>
          <h3 className="text-xl font-semibold text-purple-800">{buyerName}</h3>
        </motion.div>

        {/* Bidding Status Card */}
        <motion.div
          className="p-6 bg-white border border-purple-200 rounded-xl shadow-md space-y-3 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <p className="text-gray-600 text-sm">Position in Bidders</p>
            <p className="font-medium text-lg text-purple-700">
              #{currentPosition} of {totalBidders}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Current Status</p>
            <p className="font-semibold text-green-600 text-lg">
              {isWinning ? "Winning 🏆" : "Still Competing 🔁"}
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">Payment Due</p>
            <p className="font-semibold text-yellow-700 text-lg">
              {hasDuePayment ? "Yes 🔔" : "No ✅"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Payment Button */}
      {hasDuePayment && isWinning && (
        <div className="text-center mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/payment")}
            className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition"
          >
            Make Payment
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default AuctionStatus;
