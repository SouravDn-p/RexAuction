import React from "react";
import Lottie from "lottie-react";
import celebrationAnimation from "../../assets/Lotties/celebrate.json";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Slider = () => {
  const { dbUser } = useAuth();
  const bannerImage = "https://i.ibb.co.com/Pvc4sVfL/Untitled-design-35.jpg"; // 3rd image from your banners

  return (
    <div className="relative w-full h-[50vh] sm:h-[65vh] md:h-[75vh] lg:h-[100vh]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt="Eid Special Auction Banner"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Decorative Blurred Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-yellow-400 opacity-50 filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-yellow-400 opacity-50 filter blur-xl animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-yellow-400 opacity-40 filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-left">
        <div className="text-left px-2 ml-1 sm:px-4 sm:ml-4 md:ml-10 lg:ml-20 text-white relative z-10">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight">
            <span className="text-yellow-400">EID SPECIAL</span>{" "}
            <span className="text-white">AUCTIONS</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-lg mb-4 sm:mb-6 max-w-[90%] sm:max-w-xs lg:max-w-md">
            Celebrate Eid with exciting auctions! Our Eid Special Auctions bring
            you exclusive deals, rare collectibles, and premium items at
            unbeatable prices.
          </p>

          {/* Call to Action */}
          <div className="relative inline-block">
            {dbUser?.role === "buyer" ? (
              <Link
                className="bg-gradient-to-r from-red-600 to-red-400 text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full hover:shadow-xl hover:shadow-red-500/40 hover:scale-110 transition-all duration-300 shadow-md shadow-red-500/30 relative z-20 inline-flex items-center whitespace-nowrap"
                to="/dashboard/becomeSeller"
              >
                <span className="animate-pulse">50% OFF AUCTIONEER FEE</span>
              </Link>
            ) : (
              <div className="bg-gradient-to-r from-red-600 to-red-400 text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full animate-pulse shadow-md shadow-red-500/30 relative z-20 inline-flex items-center whitespace-nowrap">
                50% OFF AUCTIONEER FEE
              </div>
            )}
            <div className="absolute -top-8 sm:-top-10 md:-top-12 -left-4 sm:-left-5 md:-left-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 z-10 pointer-events-none">
              <Lottie
                animationData={celebrationAnimation}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 sm:mt-6 flex space-x-4">
            <button className="bg-teal-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-teal-600 transition-all">
              Get Started for Free
            </button>
            <button className="bg-transparent border border-white text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-white hover:text-black transition-all">
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;