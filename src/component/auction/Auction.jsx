import React, { useState } from "react";
import { FaGavel, FaPaintBrush, FaTruck } from "react-icons/fa";
import { FaTruckFront } from "react-icons/fa6";
import { FiCamera, FiClock, FiHeart, FiSearch } from "react-icons/fi";
import { MdLaptopChromebook, MdSportsBasketball } from "react-icons/md";
import { VscHeartFilled } from "react-icons/vsc";

export default function Auction() {
  const [searchQuery, setSearchQuery] = useState("");

  const auctions = [
    {
      id: 1,
      title: "Vintage Camera Collection",
      image:
        "data:image/jpeg;base64,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",

      currentBid: "$1200",
      timeLeft: "2h 45m",
      bidders: 8,
    },
    {
      id: 2,
      title: "Limited Edition Watch",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs6prB-9CvzDuXiLVoHc54N3Hzfi5SJDTmAQ&s",

      currentBid: "$3500",
      timeLeft: "3h 20m",
      bidders: 12,
    },
    {
      id: 3,
      title: "Modern Art Painting",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR47XTZH2JBDcWXu_NWyXd3RaZphvLk9b7J-Q&s",

      currentBid: "$2800",
      timeLeft: "1h 15m",
      bidders: 16,
    },
    {
      id: 4,
      title: "Classic Sports Car",
      image:
        "data:image/jpeg;base64,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",

      currentBid: "$45000",
      timeLeft: "3h 30m",
      bidders: 20,
    },
  ];

  //  search query
  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Section */}
      <div className="bg-purple-100">
        <div className="flex items-center justify-center p-6">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 px-4 flex items-center gap-2 justify-between w-full max-w-[600px] text-gray-800 border-2 rounded-lg bg-white focus:outline-none"
          />
          <FiSearch className="text-purple-500 text-xl ml-[-30px]" />
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap justify-center gap-3 px-4 pb-10">
          {[
            "Electronics",
            "Fashion",
            "Books",
            "Furniture",
            "Sports",
            "Toys",
          ].map((item, idx) => (
            <div
              key={idx}
              className="border rounded-3xl border-purple-500 px-4 py-2 bg-white text-purple-500 text-sm font-medium"
            >
              <h1>{item}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Auctions Section */}
      <div className="px-6">
        <h2 className="text-2xl mt-10 font-bold text-gray-800 pb-4">
          Featured Auctions
        </h2>

        {filteredAuctions.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No auctions found</p>
        ) : (
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {filteredAuctions.map((auction) => (
              <div
                key={auction.id}
                className="border rounded-lg shadow-md bg-white"
              >
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full rounded-t-lg h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-2xl text-black font-bold mt-3">
                    {auction.title}
                  </h3>
                  <div>
                    <div className="flex justify-between mt-4">
                      <p className="text-gray-600">
                        Current Bid <br />
                        <span className="text-purple-600 font-bold">
                          {auction.currentBid}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Time Left <br />
                        <span className="font-bold text-xl">
                          {auction.timeLeft}
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">{auction.bidders} Bidders</p>
                      <button className="mt-3 px-4 py-2 border border-purple-700 hover:bg-purple-700 bg-purple-500 text-white rounded-lg w-[100px]">
                        Bid Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brouse collection section */}
      <div className="bg-gray-100 mt-10 py-10">
        <div className="text-center text-2xl font-bold text-gray-800 mb-6">
          Browse Categories
        </div>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MdLaptopChromebook className="text-purple-500 text-4xl mx-auto" />
            <h1 className="font-bold text-black">Electronics</h1>
            <p className="text-gray-500">3,459 items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaPaintBrush className="text-purple-500 text-4xl mx-auto" />
            <h1 className="font-bold text-black">Art</h1>
            <p className="text-gray-500">1,459 items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <VscHeartFilled className="text-purple-500 text-4xl mx-auto" />
            <h1 className="font-bold text-black">jewellery</h1>
            <p className="text-gray-500">6,459 items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaTruckFront className="text-purple-500 text-4xl mx-auto" />
            <h1 className="font-bold text-black">vehicales </h1>
            <p className="text-gray-500">459 items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MdSportsBasketball className="text-purple-500 text-4xl mx-auto" />
            <h1 className="font-bold text-black">Sports</h1>
            <p className="text-gray-500">2,459 items</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FiCamera className="text-purple-500 text-4xl mx-auto" />
            <h1 className="font-bold text-black">Camera</h1>
            <p className="text-gray-500">3,059 items</p>
          </div>
        </div>
      </div>

      {/* bidding states section */}
      <div className="bg-purple-100  py-16">
        <div className="flex justify-center gap-6 flex-wrap">
          {/* Active Bids */}
          <div className="bg-white p-4 rounded-lg shadow-md w-60 text-center">
            <FaGavel className="text-purple-500 text-4xl mx-auto" />
            <h3 className="font-bold text-gray-800 mt-2">Active Bids</h3>
            <p className="text-purple-500 text-3xl font-semibold">12</p>
            <a href="#" className="text-purple-500 text-sm mt-2 block">
              View All →
            </a>
          </div>

          {/* Items Won */}
          <div className="bg-white p-4 rounded-lg shadow-md w-60 text-center">
            <FiClock className="text-purple-500 text-4xl mx-auto" />
            <h3 className="font-bold text-gray-800 mt-2">Items Won</h3>
            <p className="text-purple-500 text-3xl font-semibold">28</p>
            <a href="#" className="text-purple-500 text-sm mt-2 block">
              View All →
            </a>
          </div>

          {/* Watchlist */}
          <div className="bg-white p-4 rounded-lg shadow-md w-60 text-center">
            <FiHeart className="text-purple-500 text-4xl mx-auto" />
            <h3 className="font-bold text-gray-800 mt-2">Watchlist</h3>
            <p className="text-purple-500 text-3xl font-semibold">5</p>
            <a href="#" className="text-purple-500 text-sm mt-2 block">
              View All →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
