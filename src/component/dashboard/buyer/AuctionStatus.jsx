// with dark/light theme
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import ThemeContext from "../../Context/ThemeContext";
import antique from "../../../assets/antique.jpeg";

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
      biddingProductImage: antique,

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

// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { motion } from "framer-motion";
// import ThemeContext from "../../Context/ThemeContext";
// import antique from "../../../assets/antique.jpeg";

// const AuctionStatus = ({ userRole, userId }) => {
//   const navigate = useNavigate();
//   const [buyerInfo, setBuyerInfo] = useState(null);
//   const [hasAlertShown, setHasAlertShown] = useState(false);
//   const { isDarkMode } = useContext(ThemeContext);

//   useEffect(() => {
//     // Add/remove dark class on root
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }

//     // Simulated buyer info
//     setBuyerInfo({
//       isBuyer: true,
//       buyerName: "Joyeta Mondal Kotha",
//       buyerEmail: "dipannitakotha2019@gmail.com",
//       buyerPhoto: "https://i.ibb.co/ck1SGFJ/avatar.png",
//       biddingOnProduct: "Gramophone from 1823's",
//       biddingProductImage: antique,
//     });
//   }, [isDarkMode]);

//   return (
//     <div
//       className={`min-h-screen py-10 px-6 transition duration-300 ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-purple-100 text-gray-900"
//       }`}
//     >
//       <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300 text-center mb-6">
//         Live Auction Status
//       </h2>

//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7 }}
//         className={`max-w-3xl mx-auto rounded-xl p-6 sm:p-10 shadow-xl ${
//           isDarkMode ? "bg-gray-800 text-white" : "bg-white"
//         }`}
//       >
//         {buyerInfo ? (
//           <div className="space-y-6 ">
//             <div className="flex items-center gap-4">
//               <img
//                 src={buyerInfo.buyerPhoto}
//                 alt="Buyer"
//                 className="w-16 h-16 rounded-full border-2 border-purple-400"
//               />
//               <div>
//                 <h3 className="text-lg font-semibold">{buyerInfo.buyerName}</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-300">
//                   {buyerInfo.buyerEmail}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
//               <div>
//                 <h4 className="text-md font-semibold mb-1">Bidding On:</h4>
//                 <p className="text-purple-600 dark:text-purple-300">
//                   {buyerInfo.biddingOnProduct}
//                 </p>
//                 <img
//                   src={buyerInfo.biddingProductImage}
//                   alt="Bidding Item"
//                   className="mt-3 rounded-lg shadow-md w-full max-w-md"
//                 />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-center text-gray-600 dark:text-gray-300">
//             Loading auction details...
//           </p>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default AuctionStatus;
