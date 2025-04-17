import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Lottie from "lottie-react";
import sparkleAnimation from "../../assets/Lotties/banner.json";

const Slider = () => {
  const { dbUser } = useAuth();
  const bannerImage = "https://i.ibb.co.com/Pvc4sVfL/Untitled-design-35.jpg";

  return (
<div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh] overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src={bannerImage}
              alt="Eid Special Auction Banner"
              className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/80"></div>
          </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 right-[15%] w-24 h-24 sm:w-32 sm:h-32 opacity-70">
          <Lottie animationData={sparkleAnimation} loop autoplay />
        </div>
        <div className="absolute top-[20%] left-[10%] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-400/20 animate-pulse filter blur-sm"></div>
      </div>

      {/* Centepurple Content */}
      <div className="absolute inset-0 lg:mt-[100px] flex flex-col items-center justify-center text-center px-2 sm:px-3 text-white pt-[60px] sm:pt-10">
        {/* Main Title */}
        <div className="relative mb-3 sm:mb-5 group">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-none">
            <span className="text-yellow-400 drop-shadow-glow animate-glow">PREMIUM</span>{" "}
            <span className="text-white drop-shadow-glow">AUCTIONS</span>
          </h1>
          <div className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Subtitle */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold  relative inline-block">
          <span className="relative z-10 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            BID LIKE AN EXPERT
          </span>
          <span className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400/50 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl opacity-90 leading-relaxed">
          Join thousands winning exclusive items with our intelligent bidding system that maximizes your chances while protecting your budget.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 w-full px-4">
          <Link
            to="/register"
            className="relative overflow-hidden group flex-1 sm:flex-none min-w-[200px] max-w-xs bg-gradient-to-br from-purple-500 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              START BIDDING NOW
            </span>
            <span className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </Link>

          {dbUser?.role === "buyer" && (
            <Link
              to="/dashboard/becomeSeller"
              className="relative overflow-hidden group flex-1 sm:flex-none min-w-[200px] max-w-xs border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                SELL YOUR ITEMS
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
          )}
        </div>

        {/* Floating Auction Items (Mobile Only) */}
        <div className="sm:hidden absolute bottom-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-yellow-400/30 animate-bounce">
          <span className="text-yellow-400 text-xl">💰</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;