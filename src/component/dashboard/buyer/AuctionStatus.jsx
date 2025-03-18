import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuctionStatus = (userRole, userId) => {
  const navigate = useNavigate();
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [hasAlertShown, setHasAlertShown] = usestate(false);

  // fetch buyer details from backend
  useEffect(() => {
    const fetchBuyerInfo = async () => {
      try {
        const response = await axios
          .get
          // put data fetching api of user
          ();
        setBuyerInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch buyer info : ", error);
      }
    };
    fetchBuyerInfo();
  }, [userId]);
};

export default AuctionStatus;
