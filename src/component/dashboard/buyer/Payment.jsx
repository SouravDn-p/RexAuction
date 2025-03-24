import React, { useContext, useState } from "react";
import { FaLock, FaRegCreditCard, FaShieldAlt } from "react-icons/fa";
import { GrPaypal } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ThemeContext from "../../Context/ThemeContext";

export default function Payment() {
  const [isAgreed, setIsAgreed] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const handleCheckboxChange = () => {
    setIsAgreed((prev) => !prev);
  };

  const bgMain = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-[#1d1d1f]";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const inputBg = isDarkMode ? "bg-gray-700 text-white" : "bg-white";
  const summaryBg = isDarkMode ? "bg-gray-800" : "bg-purple-100";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const borderColor = isDarkMode ? "border-gray-600" : "border";

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
              <h2 className="text-lg font-semibold">Vintage Collector's Watch</h2>
              <p className="text-sm">Winning Bid: <strong>$2,450.00</strong></p>
              <p className="text-sm">Shipping: <strong>$25.00</strong></p>
              <p className="text-sm mt-1">Total: <strong>$2,475.00</strong></p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-medium mb-3">Payment Method</h3>
            <div className="flex gap-3 mb-4 flex-wrap">
              <button className="bg-blue-100 flex gap-2 text-blue-700 px-4 py-2 rounded font-medium mb-2 md:mb-0">
                <FaRegCreditCard className="mt-1 text-xl" />
                <h1>Credit/Debit Card</h1>
              </button>
              <button className={`${cardBg} ${textColor} px-4 py-2 rounded flex gap-1 mb-2 md:mb-0`}>
                <GrPaypal className="mt-1" />
                <span>PayPal</span>
              </button>
              <button className={`${cardBg} ${textColor} px-4 py-2 rounded mb-2 md:mb-0`}>
                More Options
              </button>
            </div>

            {/* Card Form */}
            <div className="space-y-4">
              <input type="text" placeholder="1234 5678 9012 3456" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
                <input type="text" placeholder="123" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
              </div>
              <input type="text" placeholder="Name on card" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
            </div>

            {/* Billing Address */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Billing Address</h4>
              <label className="flex items-center space-x-2 mb-3">
                <input type="checkbox" className="w-4 h-4" />
                <span>Same as shipping address</span>
              </label>
              <div className="space-y-3">
                <input type="text" placeholder="Street address" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
                <input type="text" placeholder="Apt, suite, etc. (optional)" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
                <div className="flex gap-4">
                  <input type="text" placeholder="City" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
                  <select className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`}>
                    <option disabled selected>Select State</option>
                    <option>NY</option>
                    <option>CA</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <input type="text" placeholder="ZIP" className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`} />
                  <select className={`p-2 rounded-lg ${borderColor} w-full ${inputBg}`}>
                    <option>United States</option>
                    <option>Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-6">
              <label className="flex items-center space-x-2 mb-4">
                <input type="checkbox" className="w-4 h-4" checked={isAgreed} onChange={handleCheckboxChange} />
                <span>
                  I agree to the{" "}
                  <a href="#" className="underline text-blue-600">Terms and Conditions</a>
                </span>
              </label>
              <button
                className={`${isAgreed ? "bg-purple-600" : "bg-gray-400 cursor-not-allowed"} text-white w-full py-3 rounded text-lg font-semibold`}
                disabled={!isAgreed}
              >
                Pay $2,475.00
              </button>
            </div>
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
            <p className="text-blue-600 underline cursor-pointer">Visit our FAQ</p>
          </div>

          {/* Security Icons */}
          <div className="flex justify-between lg:mx-0 mx-10 text-xl text-gray-500 mt-10">
            <span><FaLock /></span>
            <span><FaShieldAlt /></span>
            <span><IoMdCheckmarkCircleOutline /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
