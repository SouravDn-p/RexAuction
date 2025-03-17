import React from "react";
import img from "../../assets/LiveBidAuctionDetails.jpg";
import { GiSelfLove } from "react-icons/gi";
import { FaShare } from "react-icons/fa6";
import { IoFlagOutline } from "react-icons/io5";
import { MdVerifiedUser } from "react-icons/md";
import { AiFillCrown } from "react-icons/ai"; // Crown icon for ranking

export default function LiveBid() {
  const topBidders = [
    { name: "John Doe", bid: "$8000.00", icon: <AiFillCrown className="text-yellow-500 text-2xl" /> },
    { name: "Jane Smith", bid: "$7500.00", icon: <AiFillCrown className="text-gray-500 text-2xl" /> },
    { name: "David Johnson", bid: "$7000.00", icon: <AiFillCrown className="text-orange-500 text-2xl" /> },
  ];

  return (
    <div className="w-11/12 mx-auto my-8 bg-gray-50 p-6 rounded-xl shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between gap-8">

        {/* Left Side (Images & Details) */}
        <div className="lg:w-2/3 w-full">

          {/* Main Image */}
          <div className="w-full rounded-xl overflow-hidden shadow-md">
            <img src={img} className="w-full h-auto object-cover transition-transform hover:scale-105 duration-300" alt="Auction Item" />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-3 pt-3">
            <img src={img} className="rounded-lg shadow-md hover:scale-105 transition" alt="Thumbnail" />
            <img src={img} className="rounded-lg shadow-md hover:scale-105 transition" alt="Thumbnail" />
            <img src={img} className="rounded-lg shadow-md hover:scale-105 transition" alt="Thumbnail" />
          </div>

          {/* Product Name & Description */}
          <div className="py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-2xl sm:text-3xl font-bold text-black">
              <h3>1823s Gramophone</h3>
              <div className="flex items-center gap-3 text-gray-600 text-lg">
                <GiSelfLove className="cursor-pointer hover:text-red-500 transition" />
                <FaShare className="cursor-pointer hover:text-blue-500 transition" />
                <IoFlagOutline className="cursor-pointer hover:text-orange-500 transition" />
              </div>
            </div>
            <h3 className="text-xl font-semibold pt-3">Description:</h3>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              A rare and beautifully preserved 1823s Gramophone, an iconic piece of history that brings timeless music to life...
            </p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-black font-semibold bg-white p-4 rounded-lg shadow-md">
            <div>
              <h3 className="text-gray-700">Condition:</h3>
              <p className="text-gray-500">Good</p>
            </div>
            <div>
              <h3 className="text-gray-700">Year</h3>
              <p className="text-gray-500">1823</p>
            </div>
            <div>
              <h3 className="text-gray-700">Starting Price:</h3>
              <p className="text-gray-500">$5000.00</p>
            </div>
            <div>
              <h3 className="text-gray-700">Reference</h3>
              <p className="text-gray-500">#HHDDJ77</p>
            </div>
          </div>

          {/* Seller Details */}
          <div className="pt-6">
            <h3 className="text-xl text-black font-semibold pb-2">Seller</h3>
            <div className="flex gap-3 items-center bg-white p-4 rounded-lg shadow-md">
              <img src={img} className="w-16 h-16 rounded-full" alt="Seller" />
              <div>
                <h3 className="text-xl text-black font-semibold">John Doe</h3>
                <p className="text-green-600 flex items-center"><MdVerifiedUser className="mr-1" /> Verified seller</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Bidding & Auction Info) */}
        <div className="lg:w-1/3 w-full space-y-6">

          <div className="flex items-center gap-6">
            {/* Auction Timer */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center transition transform hover:scale-105">
              <p className="font-semibold text-xl text-gray-700">Auction ends in</p>
              <h3 className="font-bold text-3xl text-red-600">00:00:00</h3>
            </div>

            {/* Current Bid */}
            <div className="border border-gray-200 bg-white text-black p-6 rounded-lg shadow-lg text-center transition transform hover:scale-105 flex-1">
              <p className="font-semibold text-xl text-gray-700">Current bid</p>
              <h3 className="font-bold text-3xl text-purple-600">$8000.00</h3>
            </div>
          </div>


          {/* Top Bidders */}
          <div className="border bg-white text-black p-3 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Top Bidders</h3>
            {topBidders.map((bidder, index) => (
              <div key={index} className="flex items-center gap-3 p-2 border-b last:border-none">
                {bidder.icon}
                <img src={img} className="w-12 h-12 rounded-full" alt="Bidder" />
                <div>
                  <h3 className="text-lg font-semibold">{bidder.name}</h3>
                  <p className="text-gray-500">{bidder.bid}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bidding Options */}
          <div className="border bg-white text-black p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-center mb-3">Place Your Bid</h3>

            {/* Bid Increment Buttons */}
            <div className="flex justify-between text-purple-600 gap-3">
              <button className="w-1/3 border border-purple-600 py-2 rounded-lg transition hover:bg-purple-100">+100</button>
              <button className="w-1/3 border border-purple-600 py-2 rounded-lg transition hover:bg-purple-100">+200</button>
              <button className="w-1/3 border border-purple-600 py-2 rounded-lg transition hover:bg-purple-100">+300</button>
            </div>

            {/* Custom Bid Input */}
            <div className="mt-4">
              <input
                type="number"
                placeholder="Enter your bid"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Place Bid Button */}
            <button className="w-full bg-purple-600 text-white font-semibold py-3 mt-3 rounded-lg transition hover:bg-purple-700">
              Place Bid
            </button>
          </div>
          {/* Recent Bids (Added) */}
          <div className="border text-black p-3 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Recent Bids</h3>
            {topBidders.map((bidder, index) => (
              <div key={index} className="flex items-center gap-3 p-2 border-b last:border-0">
                <img src={img} className="w-12 h-12 rounded-full" alt="Bidder" />
                <div>
                  <h3 className="text-lg font-semibold">{bidder.name}</h3>
                  <p className="text-gray-500">{bidder.bid}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
