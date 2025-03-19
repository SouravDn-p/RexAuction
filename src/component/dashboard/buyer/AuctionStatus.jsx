import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axios from "axios";

const BuyerStatus = ({ userRole, userId }) => {
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
  