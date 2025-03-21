// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { motion } from "framer-motion";
// import axios from "axios";

// const AuctionStatus = ({ userRole, userId }) => {
//   const navigate = useNavigate();
//   const [buyerInfo, setBuyerInfo] = useState(null);
//   const [hasAlertShown, setHasAlertShown] = useState(false);

//   // Fetch buyer details from backend
//   useEffect(() => {
//     const fetchBuyerInfo = {
//       isBuyer: true,
//       buyerName: "John Doe",
//       buyerPhoto: "", // leave blank to fallback to avatar
//       currentPosition: 2,
//       totalBidders: 10,
//       isWinning: true,
//       hasDuePayment: true,
//     };
//     setBuyerInfo(fetchBuyerInfo);
//   }, []);

//   // Show payment popup only after winning
//   useEffect(() => {
//     if (buyerInfo?.isWinning && buyerInfo?.hasDuePayment && !hasAlertShown) {
//       setHasAlertShown(true); // Preventing multiple alerts

//       Swal.fire({
//         title: "You Won the Bid! 🎉",
//         text: "Make payment to claim your winnings.",
//         icon: "success",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#6366f1",
//       });
//     }
//   }, [buyerInfo, hasAlertShown]);

//   if (!buyerInfo) {
//     return (
//       <div className="text-center text-gray-600 mt-20 animate-pulse">
//         Fetching your bidding status...
//       </div>
//     );
//   }

//   const {
//     isBuyer,
//     buyerName,
//     buyerPhoto,
//     currentPosition,
//     totalBidders,
//     isWinning,
//     hasDuePayment,
//   } = buyerInfo;

//   return (
//     <motion.div
//       className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-3xl mt-10 border border-purple-200"
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//     >
//       <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
//         {isBuyer ? "Your Bidding Status" : "Buyer Bidding Status"}
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Profile Card */}
//         <motion.div
//           className="p-6 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 shadow-lg text-center"
//           whileHover={{ scale: 1.03 }}
//         >
//           <img
//             src={buyerPhoto || "https://i.ibb.co/ck1SGFJ/avatar.png"}
//             alt="Buyer"
//             className="w-24 h-24 mx-auto rounded-full border-4 border-purple-400 shadow-md mb-4"
//           />
//           <p className="text-gray-600 text-sm">Buyer Name</p>
//           <h3 className="text-xl font-semibold text-purple-800">{buyerName}</h3>
//         </motion.div>

//         {/* Bidding Status Card */}
//         <motion.div
//           className="p-6 bg-white border border-purple-200 rounded-xl shadow-md space-y-3 text-center"
//           whileHover={{ scale: 1.02 }}
//         >
//           <div>
//             <p className="text-gray-600 text-sm">Position in Bidders</p>
//             <p className="font-medium text-lg text-purple-700">
//               #{currentPosition} of {totalBidders}
//             </p>
//           </div>

//           <div>
//             <p className="text-gray-600 text-sm">Current Status</p>
//             <p className="font-semibold text-green-600 text-lg">
//               {isWinning ? "Winning 🏆" : "Still Competing 🔁"}
//             </p>
//           </div>

//           <div>
//             <p className="text-gray-600 text-sm">Payment Due</p>
//             <p className="font-semibold text-yellow-700 text-lg">
//               {hasDuePayment ? "Yes 🔔" : "No ✅"}
//             </p>
//           </div>
//         </motion.div>
//       </div>

//       {/* Payment Button */}
//       {hasDuePayment && isWinning && (
//         <div className="text-center mt-8">
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             whileHover={{ scale: 1.05 }}
//             onClick={() => navigate("/payment")}
//             className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition"
//           >
//             Make Payment
//           </motion.button>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default AuctionStatus;

// with dark/light theme
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import ThemeContext from "../../Context/ThemeContext";

const AuctionStatus = ({ userRole, userId }) => {
  const navigate = useNavigate();
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [hasAlertShown, setHasAlertShown] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchBuyerInfo = {
      isBuyer: true,
      buyerName: "Joyeta Mondal Kotha",
      buyerEmail: "dipannitakotha2019@gmail.com",
      buyerPhoto: "https://i.ibb.co/ck1SGFJ/avatar.png",
      biddingOnProduct: "Gramophone from 1823's",
      biddingProductImage: "https://ibb.co/Mb7NNFd",
      // "data:image/jpeg;base64,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",
      currentPosition: 2,
      totalBidders: 10,
      isWinning: true,
      hasDuePayment: true,
    };
    setBuyerInfo(fetchBuyerInfo);
  }, []);

  useEffect(() => {
    if (buyerInfo?.isWinning && buyerInfo?.hasDuePayment && !hasAlertShown) {
      setHasAlertShown(true);
      Swal.fire({
        title: "You Won the Bid! 🎉",
        text: "Make payment to claim your winnings.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      });
    }
  }, [buyerInfo, hasAlertShown]);

  if (!buyerInfo) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 mt-20 animate-pulse">
        Fetching your bidding status...
      </div>
    );
  }

  const {
    buyerName,
    buyerEmail,
    buyerPhoto,
    biddingOnProduct,
    biddingProductImage,
    currentPosition,
    totalBidders,
    isWinning,
    hasDuePayment,
  } = buyerInfo;

  return (
    <motion.div
      className={`max-w-5xl mx-auto p-6 bg-purple-100 text-white rounded-2xl shadow-xl mt-10 transition-all duration-300 
        ${
          isDarkMode
            ? "bg-gray-900 text-white border border-gray-700"
            : "bg-purple-100 text-gray-800 border border-gray-200"
        }
          `}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Profile Info */}
      <div className=" animate-border bg-purple-300 rounded-xl p-6 text-center mb-8 shadow-md relative">
        <img
          src={buyerPhoto}
          alt="Buyer"
          className="w-24 h-24 mx-auto rounded-full border-4 border-purple-400 shadow-md mb-4"
        />
        <h2 className="text-xl font-bold mb-1">Buyer : {buyerName}</h2>
        <p className="text-gray-900">{buyerEmail}</p>
      </div>

      {/* Product Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
        {/* Left: Product details */}
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-2">
            You're Bidding On:
          </h3>
          <p className="text-xl font-bold mb-4">{biddingOnProduct}</p>
          <p className="text-gray-700">
            This is a rare collectible item up for auction. Make sure you place
            your bids wisely!
          </p>
        </div>

        {/* Right: Product image */}
        <div className="flex justify-center">
          <img
            src={biddingProductImage}
            alt="Bidding Product"
            className="rounded-xl w-72 h-72 object-cover shadow-lg border-4 border-purple-500"
          />
        </div>
      </div>

      {/* Bidding Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-purple-300 rounded-lg p-4">
          <p className="text-sm text-gray-800">Position</p>
          <p className="font-semibold text-purple-800">
            #{currentPosition} of {totalBidders}
          </p>
        </div>

        <div className="bg-purple-300 rounded-lg p-4">
          <p className="text-sm text-gray-8s00">Status</p>
          <p className="font-semibold text-green-800">
            {isWinning ? "Winning 🏆" : "Still Competing 🔁"}
          </p>
        </div>

        <div className="bg-purple-300 rounded-lg p-4">
          <p className="text-sm text-gray-800">Payment Due</p>
          <p className="font-semibold text-yellow-700">
            {hasDuePayment ? "Yes 🔔" : "No ✅"}
          </p>
        </div>
      </div>

      {/* CTA Payment Button */}
      {hasDuePayment && isWinning && (
        <div className="text-center mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/payment")}
            className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-md hover:bg-purple-700 transition"
          >
            Make Payment
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default AuctionStatus;
