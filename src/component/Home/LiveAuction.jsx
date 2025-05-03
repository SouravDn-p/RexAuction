import React, { useContext } from "react";
import ThemeContext from "../Context/ThemeContext";
const liveAuctions = [
  {
    title: "Vintage Camera Collection",
    price: "$890",
    timeLeft: "45 minutes",
    img: "https://img.freepik.com/free-photo/vintage-photo-camera-composition_23-2148913935.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Rare Vinyl Records",
    price: "$450",
    timeLeft: "2 hours",
    img: "https://img.freepik.com/premium-photo/vinyl-records-listening-music-from-analog-record-music-passion-vintage-style-old-collection_1048944-28511606.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Antique Furniture",
    price: "$1,200",
    timeLeft: "3 hours",
    img: "https://img.freepik.com/free-photo/ornate-chair-art-nouveau-style-with-stained-glass_23-2150975569.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Classic Timepiece",
    price: "$2,400",
    timeLeft: "1 hour",
    img: "https://img.freepik.com/free-photo/circular-clock-indoors-still-life_23-2150436114.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
];

const LiveAuction = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`w-full py-10 ${
        isDarkMode ? "bg-gray-900 p-14 text-white" : "bg-white p-14 text-black"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-6 ${
          isDarkMode
            ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600"
            : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-800"
        }`}
      >
        Live Auctions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {liveAuctions.map((auction, index) => (
          <div
            key={index}
            className={`rounded-xl overflow-hidden transition duration-300 transform hover:shadow-xl group ${
              isDarkMode
                ? "bg-gray-800 shadow-purple-700/40"
                : "bg-white shadow-md"
            }`}
          >
            <div className="relative overflow-hidden">
              <img
                src={auction.img}
                alt={auction.title}
                className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-purple-800 opacity-0 group-hover:opacity-20 group-hover:animate-flash pointer-events-none"></div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{auction.title}</h3>
              <p
                className={`font-bold text-xl ${
                  isDarkMode ? "text-purple-300" : "text-purple-700"
                }`}
              >
                {auction.price}
              </p>
              <div
                className={`flex items-center justify-between text-sm my-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span>⏳ {auction.timeLeft}</span>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 via-violet-700 to-purple-800 text-white py-2 mt-4 rounded-lg hover:from-purple-500 hover:via-violet-600 hover:to-indigo-700 transition">
                Quick Bid
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`px-6 py-3 rounded-full font-semibold mt-8 mx-auto block transition border-2 ${
          isDarkMode
            ? "border-violet-600 text-violet-400 hover:bg-violet-600 hover:text-white"
            : "border-violet-900 text-violet-900 hover:bg-violet-900 hover:text-white"
        }`}
      >
        See All Live Auction
      </button>
    </div>
  );
};

export default LiveAuction;
