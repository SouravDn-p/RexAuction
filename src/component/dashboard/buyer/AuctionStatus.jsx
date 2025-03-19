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