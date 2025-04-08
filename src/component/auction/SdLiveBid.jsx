import React, { useContext, useEffect, useState } from "react";
import image from "../../assets/LiveBidAuctionDetails.jpg";
import { GiSelfLove } from "react-icons/gi";
import { FaShare } from "react-icons/fa6";
import { IoFlagOutline } from "react-icons/io5";
import { MdVerifiedUser } from "react-icons/md";
import { AiFillCrown } from "react-icons/ai";
import { FaEnvelope } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContexts } from "../../providers/AuthProvider";
import LoadingSpinner from "../LoadingSpinner";
import ThemeContext from "../Context/ThemeContext";
import {
  useAddBidsMutation,
  useGetTopBiddersQuery,
  useGetRecentActivityQuery,
} from "../../redux/features/api/LiveBidApi";
import Swal from "sweetalert2";
import io from "socket.io-client";

export default function SdLiveBid() {
  const { user, loading, setLoading, liveBid, setLiveBid, dbUser, setDbUser } =
    useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const { isDarkMode } = useContext(ThemeContext);
  const [bidAmount, setBidAmount] = useState("");
  const [addBid, { isLoading: isBidLoading }] = useAddBidsMutation();

  const {
    data: topBiddersData,
    refetch: refetchTopBidders,
    isFetching: isTopBiddersFetching,
  } = useGetTopBiddersQuery(id);
  const {
    data: recentActivityData,
    refetch: refetchRecentActivity,
    isFetching: isRecentActivityFetching,
  } = useGetRecentActivityQuery(id);

  const topBidders =
    topBiddersData?.map((bidder, index) => ({
      name: bidder.name,
      bid: `$${bidder.amount.toLocaleString()}`,
      photo: bidder.photo,
      icon: (
        <AiFillCrown
          className={`text-2xl ${
            index === 0
              ? "text-yellow-500"
              : index === 1
              ? "text-gray-500"
              : "text-orange-500"
          }`}
        />
      ),
    })) || [];

  const recentActivity =
    recentActivityData?.map((bidder) => ({
      name: bidder.name,
      bid: `$${bidder.amount.toLocaleString()}`,
      photo: bidder.photo,
      createdAt: bidder.createdAt,
    })) || [];

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get(`/auction/${id}`)
      .then((res) => {
        setLiveBid(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch auction:", error);
        setLoading(false);
      });
  }, [id, axiosPublic, setLiveBid, setLoading]);

  useEffect(() => {
    if (!liveBid || !liveBid.endTime) return;

    const endTime = new Date(liveBid.endTime).getTime();
    if (isNaN(endTime)) return;

    const calculateCountdown = () => {
      const currentTime = new Date().getTime();
      const remainingSeconds = Math.max(
        0,
        Math.floor((endTime - currentTime) / 1000)
      );
      setCountdown(remainingSeconds);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [liveBid]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Ended";
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    else if (hours > 0) return `${hours}h ${minutes}m`;
    else return `${minutes}m ${secs}s`;
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  };

  const handleBidIncrement = (amount) => {
    const current = liveBid?.currentBid || liveBid?.startingPrice || 0;
    setBidAmount((parseFloat(current) + amount).toFixed(2));
  };

  const handlePlaceBid = async () => {
    if (!user) {
      alert("Please log in to place a bid");
      return;
    }
    if (
      !bidAmount ||
      parseFloat(bidAmount) <=
        (liveBid?.currentBid || liveBid?.startingPrice || 0)
    ) {
      alert("Bid must be higher than current bid");
      return;
    }

    if (dbUser?.accountBalance < bidAmount) {
      return Swal.fire({
        title: "Not enough balance!",
        text: "You don't have enough balance to place this bid.",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Add Balance",
        cancelButtonText: "Cancel",
        draggable: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/addBalance";
        }
      });
    }
    const currentBalance =
      dbUser?.accountBalance - (bidAmount - liveBid?.currentBid);

    // console.log(dbUser?.accountBalance);
    // console.log(bidAmount);
    // console.log(liveBid?.currentBid);
    const bidData = {
      email: user.email,
      name: user.displayName || "Anonymous",
      photo: user.photoURL || "",
      amount: parseFloat(bidAmount),
      auctionId: id,
    };

    try {
      // 👉 Using axios to send bid data to backend
      const response = await axiosPublic.post("/live-bid", bidData);

      if (response.status === 200 || response.status === 201) {
        setLiveBid((prev) => ({
          ...prev,
          currentBid: parseFloat(bidAmount),
        }));
        try {
          const res = await axiosPublic.patch(`/accountBalance/${dbUser._id}`, {
            accountBalance: currentBalance,
          });

          if (res.data.success) {
            Swal.fire(
              "Updated!",
              "User accountBalance has been upgraded.",
              "success"
            );
            if (user?.email) {
              setLoading(true);
              axiosPublic
                .get(`/user/${user.email}`)
                .then((res) => {
                  setDbUser(res.data);
                  setLoading(false);
                })
                .catch((error) => {
                  console.error("Error fetching user data:", error);
                  setErrorMessage("Failed to load user data");
                  setLoading(false);
                });
            }
          } else {
            Swal.fire("Failed!", "Could not update user role.", "error");
          }
        } catch (error) {
          console.error("Error updating role:", error);
          Swal.fire("Error!", "Something went wrong!", "error");
        }
        setBidAmount("");
        await Promise.all([refetchTopBidders(), refetchRecentActivity()]);
      } else {
        throw new Error("Bid not successful");
      }
    } catch (error) {
      console.error("Failed to place bid:", error);
      alert("Failed to place bid. Please try again.");
    }
  };

  const handleMessageSeller = () => {
    if (!user) {
      alert("Please log in to message the seller");
      return;
    }
    navigate("/dashboard/chat", {
      state: {
        selectedUser: {
          _id: liveBid?.sellerId,
          email: liveBid?.sellerEmail,
          name: liveBid?.sellerDisplayName || "Seller",
          photo: liveBid?.sellerPhotoUrl || image,
        },
        auctionId: id,
        auctionName: liveBid?.name,
        auctionImage: liveBid?.images?.[0] || image,
      },
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen mt-20 ${
        isDarkMode ? "bg-gray-900" : "bg-purple-200/80"
      }`}
    >
      <div
        className={`w-11/12 mx-auto py-12 ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 w-full space-y-6">
            <div className="w-full rounded-xl overflow-hidden shadow-lg">
              <img
                src={liveBid?.images?.[0] || image}
                className="w-full h-96 object-cover transition-transform hover:scale-105 duration-300"
                alt="Auction Item"
                onError={(e) => {
                  e.target.src = image;
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((_, index) => (
                <img
                  key={index}
                  src={liveBid?.images?.[index + 1] || image}
                  className="rounded-lg shadow-md hover:scale-105 transition h-40 w-full object-cover"
                  alt={`Thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.target.src = image;
                  }}
                />
              ))}
            </div>

            <div
              className={`p-6 rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {liveBid?.name}
                </h3>
                <div className="flex items-center gap-3 text-xl">
                  <GiSelfLove
                    className={`cursor-pointer hover:text-red-500 transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <FaShare
                    className={`cursor-pointer hover:text-blue-500 transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <IoFlagOutline
                    className={`cursor-pointer hover:text-orange-500 transition ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold pt-4">Description:</h3>
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } mt-2`}
              >
                {liveBid?.description || "No description available"}
              </p>
            </div>

            <div
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div>
                <h3
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Condition:
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {liveBid?.condition || "N/A"}
                </p>
              </div>
              <div>
                <h3
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Year
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {liveBid?.itemYear || "N/A"}
                </p>
              </div>
              <div>
                <h3
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Starting Price:
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  ${liveBid?.startingPrice?.toLocaleString() || "0"}
                </p>
              </div>
              <div>
                <h3
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Reference
                </h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  #{liveBid?.reference || "N/A"}
                </p>
              </div>
            </div>

            <div
              className={`p-6 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-semibold pb-4">Seller Information</h3>
              <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={liveBid?.sellerPhotoUrl || image}
                    className="w-16 h-16 rounded-full object-cover"
                    alt="Seller"
                    onError={(e) => {
                      e.target.src = image;
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {liveBid?.sellerDisplayName || "Anonymous"}
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm`}
                    >
                      {liveBid?.sellerEmail}
                    </p>
                    <p className="text-green-500 flex items-center text-sm mt-1">
                      <MdVerifiedUser className="mr-1" /> Verified seller
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleMessageSeller}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-purple-100 hover:bg-purple-200 text-purple-600"
                  }`}
                >
                  <FaEnvelope /> Message Seller
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 w-full space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl shadow-lg text-center transition hover:scale-[1.02] flex flex-col justify-center items-center h-full ${
                  formatTime(countdown) === "Ended"
                    ? "bg-red-100 text-red-800"
                    : isDarkMode
                    ? "bg-gray-800 border border-red-500"
                    : "bg-white border border-red-300"
                }`}
              >
                {formatTime(countdown) === "Ended" ? (
                  <h3 className="font-bold text-xl">Auction Ended</h3>
                ) : (
                  <>
                    <p className="text-lg font-semibold">Ends In</p>
                    <h3 className="font-bold text-2xl text-red-500">
                      {formatTime(countdown)}
                    </h3>
                  </>
                )}
              </div>

              <div
                className={`p-4 rounded-xl shadow-lg text-center transition hover:scale-[1.02] flex flex-col justify-center items-center h-full ${
                  isDarkMode
                    ? "bg-gray-800 border border-purple-500"
                    : "bg-white border border-purple-300"
                }`}
              >
                <p className="text-lg font-semibold">Current Bid</p>
                <h3
                  className={`font-bold text-2xl ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  $
                  {liveBid?.currentBid?.toLocaleString() ||
                    liveBid?.startingPrice?.toLocaleString() ||
                    "0"}
                </h3>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold mb-3">Top Bidders</h3>
              <div className="space-y-3">
                {isTopBiddersFetching ? (
                  <p
                    className={`text-center py-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading bidders...
                  </p>
                ) : topBidders.length > 0 ? (
                  topBidders.map((bidder, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {bidder.icon}
                      <img
                        src={bidder.photo || image}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Bidder"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{bidder.name}</h3>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {bidder.bid}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className={`text-center py-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No bids yet! Be the first to place your bid!
                  </p>
                )}
              </div>
            </div>

            <div
              className={`p-5 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold text-center mb-4">
                Place Your Bid
              </h3>
              <div className="flex gap-3 mb-4">
                {[100, 200, 300].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleBidIncrement(amount)}
                    className={`flex-1 py-2 rounded-lg transition ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                        : "bg-purple-100 hover:bg-purple-200 border border-purple-200"
                    } text-purple-600 font-medium`}
                  >
                    +{amount}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Enter bid (min $${
                    (liveBid?.currentBid || liveBid?.startingPrice || 0) + 100
                  })`}
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 focus:ring-purple-500"
                      : "bg-white border-gray-300 focus:ring-purple-400"
                  } border`}
                />
              </div>
              <button
                onClick={handlePlaceBid}
                disabled={formatTime(countdown) === "Ended" || isBidLoading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  formatTime(countdown) === "Ended" || isBidLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white`}
              >
                {isBidLoading
                  ? "Placing Bid..."
                  : formatTime(countdown) === "Ended"
                  ? "Auction Ended"
                  : "Place Bid"}
              </button>
            </div>

            <div
              className={`p-4 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {isRecentActivityFetching ? (
                  <p
                    className={`text-center py-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading recent activity...
                  </p>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((bidder, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <img
                        src={bidder.photo || image}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Bidder"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{bidder.name}</h3>
                          <span
                            className={`text-sm font-semibold ${
                              isDarkMode ? "text-purple-400" : "text-purple-600"
                            }`}
                          >
                            {bidder.bid}
                          </span>
                        </div>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {formatRelativeTime(bidder.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className={`text-center py-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No recent bids yet! Start the bidding now!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
