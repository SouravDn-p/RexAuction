import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import ThemeContext from "../../Context/ThemeContext";

function SellerLandingPage() {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`flex flex-col items-center justify-center h-screen  text-white ${
        isDarkMode
          ? "bg-gradient-to-br from-blue-900 to-purple-600"
          : "bg-gradient-to-br from-violet-500 to-purple-500"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative text-center p-6">
        <Player
          autoplay
          loop
          src="https://assets5.lottiefiles.com/packages/lf20_ysas4vcp.json"
          className="w-60 h-60 mx-auto"
        />
        <h1 className="text-3xl md:text-5xl font-bold my-4">
          Become a Seller to Create Live Auctions
        </h1>
        <Link
          to="/dashboard/becomeSeller"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-100 transition duration-300 inline-block"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default SellerLandingPage;
