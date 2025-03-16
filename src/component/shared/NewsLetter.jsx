import React from "react";
import newsLetter from "../../assets/5974451_22060-removebg-preview.png";

const Newsletter = () => {
  return (
    <div className="relative border-2 border-purple-700 bg-gradient-to-b from-purple-200 to-purple-500 px-6 md:px-10 py-6 rounded-lg shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between 
      transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,69,0,0.8)]">
      
      {/* Left Side - Image with Animation */}
      <div className="mb-4 md:mb-0">
        <img
          src={newsLetter}
          alt="Auction Sold"
          className="w-[200px] md:w-[300px] mx-auto animate-floating"
        />
      </div>

      {/* Right Side - Text & Subscription Form */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h3 className="text-orange-600 font-bold text-lg md:text-xl">REX AUCTION</h3>
        <h2 className="text-xl md:text-2xl font-bold mt-1">
          Get Exclusive Benefits
        </h2>

        {/* Subscription Form */}
        <div className="mt-4 flex flex-col sm:flex-row items-center border rounded-full overflow-hidden shadow-md">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full px-4 text-center py-3 focus:outline-none text-sm sm:text-base"
          />
          <button className="bg-orange-400 text-white px-6 py-3 font-semibold w-full sm:w-auto">
            SUBSCRIBE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
