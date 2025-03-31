import React, { useContext, useEffect, useState } from "react";
import img from "../../assets/LiveBidAuctionDetails.jpg";
import { GiSelfLove } from "react-icons/gi";
import { FaShare } from "react-icons/fa6";
import { IoFlagOutline } from "react-icons/io5";
import { MdVerifiedUser } from "react-icons/md";
import { AiFillCrown } from "react-icons/ai";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContexts } from "../../providers/AuthProvider";
import LoadingSpinner from "../LoadingSpinner";

export default function LiveBid() {
  const { user, loading, setLoading, liveBid, setLiveBid } =
    useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const [countdowns, setCountdowns] = useState(null);

  const topBidders = [
    {
      name: "John Doe",
      bid: "$8000.00",
      icon: <AiFillCrown className="text-yellow-500 text-2xl" />,
    },
    {
      name: "Jane Smith",
      bid: "$7500.00",
      icon: <AiFillCrown className="text-gray-500 text-2xl" />,
    },
    {
      name: "David Johnson",
      bid: "$7000.00",
      icon: <AiFillCrown className="text-orange-500 text-2xl" />,
    },
  ];

  useEffect(() => {
    setLoading(true);
    console.log(id);
    axiosPublic.get(`/auction/${id}`).then((res) => {
      setLiveBid(res.data);
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!liveBid || !liveBid.endTime) return;

    const interval = setInterval(() => {
      const endTime = new Date(liveBid.endTime).getTime();
      const currentTime = new Date().getTime();
      const remainingSecond = Math.floor((0, (endTime - currentTime) / 1000));
      setCountdowns(remainingSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [liveBid]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Ended";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${secs}s`;
    }
  };
  if (loading) {
    return LoadingSpinner;
  }

  return (
    <div className="w-11/12 mx-auto mb-8 mt-24 bg-gray-50 p-6 rounded-xl shadow-lg ">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* Left Side (Images & Details) */}
        <div className="lg:w-2/3 w-full ">
          {/* Main Image */}
          <div className="w-full rounded-xl overflow-hidden shadow-md">
            <img
              src={liveBid?.images[0]}
              className="w-full h-96 object-cover transition-transform hover:scale-105 duration-300"
              alt="Auction Item"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-3 pt-3 ">
            {liveBid?.images.slice(1, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                className="rounded-lg shadow-md hover:scale-105 transition h-56 w-full object-cover"
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>

          {/* Product Name & Description */}
          <div className="py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-2xl sm:text-3xl font-bold text-black">
              <h3>{liveBid?.name}</h3>
              <div className="flex items-center gap-3 text-gray-600 text-lg">
                <GiSelfLove className="cursor-pointer hover:text-red-500 transition" />
                <FaShare className="cursor-pointer hover:text-blue-500 transition" />
                <IoFlagOutline className="cursor-pointer hover:text-orange-500 transition" />
              </div>
            </div>
            <h3 className="text-xl font-semibold pt-3">Description:</h3>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              {liveBid?.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-black font-semibold bg-white p-4 rounded-lg shadow-md">
            <div>
              <h3 className="text-gray-700">Condition:</h3>
              <p className="text-gray-500">{liveBid?.condition}</p>
            </div>
            <div>
              <h3 className="text-gray-700">Year</h3>
              <p className="text-gray-500"> {liveBid?.itemYear}</p>
            </div>
            <div>
              <h3 className="text-gray-700">Starting Price:</h3>
              <p className="text-gray-500">$ {liveBid?.startingPrice}</p>
            </div>
            <div>
              <h3 className="text-gray-700">Reference</h3>
              <p className="text-gray-500">
                # {liveBid?.reference ? liveBid?.reference : " None"}
              </p>
            </div>
          </div>

          {/* Seller Details */}
          <div className="pt-6">
            <h3 className="text-xl text-black font-semibold pb-2">Seller</h3>
            <div className="flex gap-3 items-center bg-white p-4 rounded-lg shadow-md">
              <img
                src={liveBid?.sellerPhotoUrl}
                className="w-16 h-16 rounded-full"
                alt="Seller"
              />
              <div>
                <h3 className="text-xl text-black font-semibold">
                  {liveBid?.sellerDisplayName
                    ? liveBid?.sellerDisplayName
                    : "User"}
                </h3>
                <h3 className="text-xl text-black font-semibold">
                  {liveBid?.sellerEmail}
                </h3>
                <p className="text-green-600 flex items-center">
                  <MdVerifiedUser className="mr-1" /> Verified seller
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Bidding & Auction Info) */}
        <div className="lg:w-1/3 w-full space-y-6">
          <div className="grid grid-cols-2  items-center gap-6">
            {/* Auction Timer */}
            <div className="bg-white h-28 p-6 rounded-lg shadow-lg text-center transition transform hover:scale-105 flex justify-center items-center flex-col">
              {formatTime(countdowns) === "Ended" || (
                <p className=" text-xl font-bold text-red-600  ">Ends In</p>
              )}
              <h3 className="font-bold text-3xl text-red-600">
                {formatTime(countdowns)}
              </h3>
            </div>

            {/* Current Bid */}
            <div className="border h-28 border-gray-200 bg-white text-black p-6 rounded-lg shadow-lg text-center transition transform hover:scale-105 flex-1">
              <p className="font-semibold text-xl text-gray-700">Current bid</p>
              <h3 className="font-bold text-3xl text-purple-600">
                $ {liveBid?.currentBid}
              </h3>
            </div>
          </div>

          {/* Top Bidders */}
          <div className="border bg-white text-black p-3 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Top Bidders</h3>
            {topBidders.map((bidder, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 border-b last:border-none"
              >
                {bidder.icon}
                <img
                  src={img}
                  className="w-12 h-12 rounded-full"
                  alt="Bidder"
                />
                <div>
                  <h3 className="text-lg font-semibold">{bidder.name}</h3>
                  <p className="text-gray-500">{bidder.bid}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bidding Options */}
          <div className="border bg-white text-black p-5 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-center mb-3">
              Place Your Bid
            </h3>

            {/* Bid Increment Buttons */}
            <div className="flex justify-between text-purple-600 gap-3">
              <button className="w-1/3 border border-purple-600 py-2 rounded-lg transition hover:bg-purple-100">
                +100
              </button>
              <button className="w-1/3 border border-purple-600 py-2 rounded-lg transition hover:bg-purple-100">
                +200
              </button>
              <button className="w-1/3 border border-purple-600 py-2 rounded-lg transition hover:bg-purple-100">
                +300
              </button>
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
              <div
                key={index}
                className="flex items-center gap-3 p-2 border-b last:border-0"
              >
                <img
                  src={img}
                  className="w-12 h-12 rounded-full"
                  alt="Bidder"
                />
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
