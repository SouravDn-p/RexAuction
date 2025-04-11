import React, { useContext, useState } from "react";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import { BsCreditCard2Back, BsPhone } from "react-icons/bs";
import { SiVisa, SiMastercard } from "react-icons/si";
import ThemeContext from "../../Context/ThemeContext";
import axios from "axios";

const Payment2 = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { isDarkMode } = useContext(ThemeContext);

  // Card payment inputs
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Mobile banking selection
  const [mobileBankingOption, setMobileBankingOption] = useState("");

  const handleCreatePayment = async () => {
    console.log("handleCreatePayment function triggered");
  
    const Payment = {
      email: "user@example.com", 
      paymentPrice: 24745,
      transactionId: `TXN-${Date.now()}`, 
      date: new Date(),
      status: "pending",
      // paymentMethod: paymentMethod,
      // ...(paymentMethod === "card" && {
      //   cardNumber: cardNumber,
      //   expiryDate: expiryDate,
      //   cvc: cvc,
      // }),
      // ...(paymentMethod === "mobile" && {
      //   mobileBankingOption: mobileBankingOption,
      // }),
    };
    
    const response = await axios.post("http://localhost:5000/paymentsWithSSL", Payment);
     if(response.data?.gatewayURL){
      window.location.replace(response.data.gatewayURL);
     }



    console.log("API Response:", response);
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-5xl rounded-lg transition-all duration-300 ${
          isDarkMode ? "" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <FaLock className="text-green-500 text-lg" />
        </div>

        <h2 className="text-2xl font-bold text-center">Payment</h2>

        {/* Order Summary */}
        <div
          className={`p-6 rounded-lg my-6 ${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-900"
          }`}
        >
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="flex justify-between">
            <span>Bid Price</span> <span>৳24,500</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span> <span>৳245</span>
          </div>
          <hr className="my-2 border-gray-500" />
          <div className="flex justify-between font-bold">
            <span>Total</span> <span>৳24,745</span>
          </div>
        </div>

        {/* Payment Method */}
        <h3 className="font-semibold text-blue-400 mb-4">Choose a Payment Method</h3>

        <div className="space-y-5">
          {/* Card Payment */}
          <div
            className={`p-4 border rounded-lg cursor-pointer flex items-center space-x-3 transition ${
              paymentMethod === "card" ? "border-blue-500 bg-blue-300/20" : "border-gray-500"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <BsCreditCard2Back className="text-xl text-blue-400" />
            <span className="font-medium">Credit/Debit Card</span>
          </div>

          {paymentMethod === "card" && (
            <div
              className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <label className="block text-sm font-medium">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-3 border rounded-lg mt-1 bg-transparent"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <SiVisa className="text-blue-400 text-xl" />
                  <SiMastercard className="text-red-400 text-xl" />
                </div>
              </div>
              <div className="flex space-x-3 mt-3">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-3 border rounded-lg mt-1 bg-transparent"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full p-3 border rounded-lg mt-1 bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Banking */}
          <div
            className={`p-4 border rounded-lg cursor-pointer flex items-center space-x-3 transition ${
              paymentMethod === "mobile" ? "border-blue-500 bg-blue-300/20" : "border-gray-500"
            }`}
            onClick={() => setPaymentMethod("mobile")}
          >
            <BsPhone className="text-xl text-blue-400" />
            <span className="font-medium">Mobile Banking</span>
          </div>

          {paymentMethod === "mobile" && (
            <div
              className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <div
                className="flex justify-between p-3 border rounded-lg cursor-pointer"
                onClick={() => setMobileBankingOption("bKash")}
              >
                <span className="font-medium text-pink-500">bKash</span>
                <img
                  src="https://i.ibb.co/cXVmyXGv/images-removebg-preview-1.png"
                  alt="bKash"
                  className="h-8"
                />
              </div>
              <div
                className="flex justify-between p-3 border rounded-lg cursor-pointer mt-2"
                onClick={() => setMobileBankingOption("Nagad")}
              >
                <span className="font-medium text-yellow-600">Nagad</span>
                <img
                  src="https://i.ibb.co/yBbmYdnP/images-removebg-preview-2.png"
                  alt="Nagad"
                  className="h-8"
                />
              </div>
              <div
                className="flex justify-between p-3 border rounded-lg cursor-pointer mt-2"
                onClick={() => setMobileBankingOption("Rocket")}
              >
                <span className="font-medium text-purple-500">Rocket</span>
                <img
                  src="https://i.ibb.co/vxSGZK1Q/rocket.png"
                  alt="Rocket"
                  className="h-8"
                />
              </div>
            </div>
          )}
        </div>

        {/* Security Assurance */}
        <div className="flex items-center space-x-2 text-green-400 my-6">
          <FaCheckCircle />
          <span className="text-sm font-medium">SSL Secured & PCI DSS</span>
        </div>

        {/* Payment Button */}
        <button
          onClick={handleCreatePayment}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold transition"
        >
          Make Payment
        </button>

        {/* Security Note */}
        <div className="text-gray-400 text-sm flex items-center justify-center mt-3">
          <FaLock className="mr-2" />
          Your information is secure and encrypted
        </div>
      </div>
    </div>
  );
};

export default Payment2;