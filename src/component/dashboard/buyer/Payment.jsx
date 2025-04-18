import React, { useContext, useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";
import Payment2 from "./Payment2";
import { jsPDF } from "jspdf";

export default function Payment() {
  const [isAgreed, setIsAgreed] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const handleCheckboxChange = () => {
    setIsAgreed((prev) => !prev);
  };

  const bgMain = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-[#1d1d1f]";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const inputBg = isDarkMode ? "bg-gray-700 text-white" : "bg-white";
  const summaryBg = isDarkMode ? "bg-gray-800" : "bg-purple-100";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const borderColor = isDarkMode ? "border-gray-600" : "border";

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

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
    doc.text("Winning Bid:", 14, 45);
    doc.text("Shipping:", 14, 55);
    doc.text("Total:", 14, 65);

    doc.text("$2,450.00", 100, 45);
    doc.text("$25.00", 100, 55);
    doc.text("$2,475.00", 100, 65);

    // Draw a line after the order details
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 70, 200, 70);

    // Shipping Info
    doc.setFontSize(12);
    doc.text("Shipping To:", 14, 80);
    doc.text("John Smith", 14, 90);
    doc.text("123 Main Street", 14, 100);
    doc.text("Apt 4B", 14, 110);
    doc.text("New York, NY 10001", 14, 120);
    doc.text("United States", 14, 130);

    // Draw a line after shipping info
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 135, 200, 135);

    // Footer with company details
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("RexAuction", 14, 150);
    doc.text("support@rexauction.com", 14, 155);
    doc.text("1-800-REX-HELP", 14, 160);

    // Add a footer line
    doc.setLineWidth(0.5);
    doc.setDrawColor(36, 66, 120);
    doc.line(14, 165, 200, 165);

    // Save PDF
    doc.save("invoice.pdf");
  };

  return (
    <div className={`${bgMain} min-h-screen p-6 md:p-10 font-sans`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">RexAuction</h1>
        <div className={`space-x-6 text-sm ${textColor}`}>
          <a href="#">My Account</a>
          <a href="#">Help</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Card */}
          <div className="flex items-start gap-4 mb-6">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG15N0Q2x57cbdlxRzR2aM-CgeeAjjMf0_Kw&s"
              alt="watch"
              className="w-24 h-24 object-cover rounded transition-transform duration-300 hover:scale-110"
            />
            <div>
              <h2 className="text-lg font-semibold">
                Vintage Collector's Watch
              </h2>
              <p className="text-sm">
                Winning Bid: <strong>$2,450.00</strong>
              </p>
              <p className="text-sm">
                Shipping: <strong>$25.00</strong>
              </p>
              <p className="text-sm mt-1">
                Total: <strong>$2,475.00</strong>
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Payment2 />
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className={`${summaryBg} p-6 rounded-md`}>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className={`space-y-2 text-sm ${textColor}`}>
            <div className="flex justify-between">
              <span>Winning Bid</span>
              <span>$2,450.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$25.00</span>
            </div>
            <div className="flex justify-between font-bold text-gray-500 border-t-2 border-gray-300 pt-2">
              <span>Total</span>
              <span>$2,475.00</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className={`mt-6 text-sm ${textColor}`}>
            <h4 className="font-semibold mb-1">Shipping To</h4>
            <p>John Smith</p>
            <p>123 Main Street</p>
            <p>Apt 4B</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
          </div>

          {/* Help Section */}
          <div className={`mt-6 text-sm ${textColor} space-y-2`}>
            <h4 className="font-semibold">Need Help?</h4>
            <p>📞 1-800-REX-HELP</p>
            <p>✉️ support@rexauction.com</p>
            <div className="flex gap-3">
              <p className="text-blue-600 underline cursor-pointer">
                Visit our FAQ
              </p>
              <button
                onClick={handleDownloadInvoice}
                className="text-blue-600 underline cursor-pointer"
              >
                Download Invoice
              </button>
            </div>
          </div>

          {/* Security Icons */}
          <div className="flex justify-between lg:mx-0 mx-10 text-xl text-gray-500 mt-10">
            <span>
              <FaLock />
            </span>
            <span>
              <FaShieldAlt />
            </span>
            <span>
              <IoMdCheckmarkCircle />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
