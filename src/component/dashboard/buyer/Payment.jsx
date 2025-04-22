"use client";

import { useContext, useState, useEffect } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";
import Payment2 from "./Payment2";
import { jsPDF } from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContexts } from "../../../providers/AuthProvider";
import LoadingSpinner from "../../LoadingSpinner";

export default function Payment() {
  const [isAgreed, setIsAgreed] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContexts);
  const location = useLocation();
  const navigate = useNavigate();
  const [auctionData, setAuctionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Styling variables
  const bgMain = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-[#1d1d1f]";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const inputBg = isDarkMode ? "bg-gray-700 text-white" : "bg-white";
  const summaryBg = isDarkMode ? "bg-gray-800" : "bg-purple-100";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const borderColor = isDarkMode ? "border-gray-600" : "border";

  // Get auction data from location state
  useEffect(() => {
    if (location.state?.auctionData) {
      setAuctionData(location.state.auctionData);
    } else if (location.state?.notificationDetails?.auctionData) {
      setAuctionData(location.state.notificationDetails.auctionData);
    } else {
      // If no auction data in state, check if we have an ID to fetch
      const searchParams = new URLSearchParams(location.search);
      const auctionId = searchParams.get("id");

      if (auctionId) {
        // You would need to implement this function to fetch auction data by ID
        // fetchAuctionData(auctionId);
        console.log("Would fetch auction data for ID:", auctionId);
      }
    }
    setLoading(false);
  }, [location]);

  const handleCheckboxChange = () => {
    setIsAgreed((prev) => !prev);
  };

  // Calculate shipping cost (example: 1% of bid amount or minimum $10)
  const calculateShipping = () => {
    if (!auctionData || !auctionData.currentBid) return 10;
    return Math.max(Math.round(auctionData.currentBid * 0.01), 10);
  };

  // Calculate total cost
  const getTotal = () => {
    if (!auctionData || !auctionData.currentBid) return 0;
    return auctionData.currentBid + calculateShipping();
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const shipping = calculateShipping();
    const total = getTotal();

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(36, 66, 120);
    doc.text("Invoice", 105, 20, null, null, "center");

    // Draw a line under the title
    doc.setLineWidth(0.5);
    doc.setDrawColor(36, 66, 120);
    doc.line(14, 25, 200, 25);

    // Invoice Table Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Order Summary", 14, 35);

    // Order Details
    doc.setFontSize(12);
    doc.text("Auction Item:", 14, 45);
    doc.text(auctionData?.name || "Auction Item", 100, 45);

    doc.text("Winning Bid:", 14, 55);
    doc.text(
      `$${auctionData?.currentBid?.toLocaleString() || "0.00"}`,
      100,
      55
    );

    doc.text("Shipping:", 14, 65);
    doc.text(`$${shipping.toLocaleString()}`, 100, 65);

    doc.text("Total:", 14, 75);
    doc.text(`$${total.toLocaleString()}`, 100, 75);

    // Draw a line after the order details
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 80, 200, 80);

    // Auction Details
    doc.setFontSize(14);
    doc.text("Auction Details", 14, 90);

    doc.setFontSize(12);
    doc.text("Auction ID:", 14, 100);
    doc.text(auctionData?._id || "N/A", 100, 100);

    doc.text("Category:", 14, 110);
    doc.text(auctionData?.category || "N/A", 100, 110);

    doc.text("Condition:", 14, 120);
    doc.text(auctionData?.condition || "N/A", 100, 120);

    doc.text("Seller:", 14, 130);
    doc.text(auctionData?.sellerDisplayName || "N/A", 100, 130);

    // Draw a line after auction details
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 135, 200, 135);

    // Shipping Info
    doc.setFontSize(14);
    doc.text("Shipping To", 14, 145);

    doc.setFontSize(12);
    doc.text(user?.name || "User", 14, 155);
    doc.text(user?.email || "user@example.com", 14, 165);
    // Add more shipping details if available

    // Draw a line after shipping info
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 175, 200, 175);

    // Footer with company details
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("RexAuction", 14, 185);
    doc.text("support@rexauction.com", 14, 190);
    doc.text("1-800-REX-HELP", 14, 195);

    // Add a footer line
    doc.setLineWidth(0.5);
    doc.setDrawColor(36, 66, 120);
    doc.line(14, 200, 200, 200);

    // Save PDF with auction name in filename
    const filename = auctionData?.name
      ? `invoice-${auctionData.name.replace(/\s+/g, "-").toLowerCase()}.pdf`
      : "invoice.pdf";

    doc.save(filename);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!auctionData) {
    return (
      <div
        className={`${bgMain} min-h-screen p-6 md:p-10 font-sans flex flex-col items-center justify-center`}
      >
        <h2 className="text-2xl font-bold mb-4">No Auction Data Found</h2>
        <p className="mb-6">Unable to find auction details for this payment.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const shipping = calculateShipping();
  const total = getTotal();

  return (
    <div className={`${bgMain} min-h-screen  md:p-10 font-sans`}>
      {/* Main Content */}
      <div className="">
        {/* Left */}
        <div className="">
          {/* Product Card */}

          <div>
            <Payment2 />
          </div>
        </div>

        {/* Right Side: Order Summary */}
      </div>
    </div>
  );
}
