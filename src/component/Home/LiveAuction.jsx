import React from "react";

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
  return (
    <div className="w-11/12 mx-auto p-2 py-10 text-black">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Auctions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {liveAuctions.map((auction, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={auction.img}
              alt={auction.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{auction.title}</h3>
              <p className="text-purple-600 font-bold text-xl">
                {auction.price}
              </p>
              <div className="flex items-center justify-between text-gray-500 text-sm my-2">
                <span>⏳ {auction.timeLeft}</span>
              </div>
              <button className="w-full bg-violet-900 text-white py-2 mt-3 rounded-lg hover:bg-violet-700 transition">
                Quick Bid
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="bg-violet-900 p-3 rounded-3xl text-white mx-auto block mt-6">
        See All Live Auction
      </button>
    </div>
  );
};

export default LiveAuction;
