"use client";

import { useContext, useEffect, useState, useRef } from "react";
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

export default function LiveBid() {
  const { user, loading, setLoading, liveBid, setLiveBid, dbUser } =
    useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const { isDarkMode } = useContext(ThemeContext);
  const [bidAmount, setBidAmount] = useState("");
  const [extraMoney, setExtraMoney] = useState(0);
  const [addBid, { isLoading: isBidLoading }] = useAddBidsMutation();
  const [myBid, setMyBid] = useState(null);
  const [bidAnimation, setBidAnimation] = useState(false);

  // Socket.IO connection
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Local state for real-time data
  const [localTopBidders, setLocalTopBidders] = useState([]);
  const [localRecentActivity, setLocalRecentActivity] = useState([]);
  const [currentHighestBid, setCurrentHighestBid] = useState(0);

  const {
    data: topBiddersData,
    refetch: refetchTopBidders,
    isFetching: isTopBiddersFetching,
  } = useGetTopBiddersQuery(id, {
    pollingInterval: 30000, // Fallback polling every 30 seconds if socket fails
  });

  const {
    data: recentActivityData,
    refetch: refetchRecentActivity,
    isFetching: isRecentActivityFetching,
  } = useGetRecentActivityQuery(id, {
    pollingInterval: 30000, // Fallback polling every 30 seconds if socket fails
  });

  // Initialize local state with fetched data
  useEffect(() => {
    if (topBiddersData && topBiddersData.length > 0) {
      setLocalTopBidders(topBiddersData);

      // Find user's highest bid
      if (user) {
        const userBid = topBiddersData.find(
          (bidder) => bidder.email === user.email
        );
        if (userBid) {
          setMyBid({
            amount: userBid.amount,
            bid: `$${userBid.amount.toLocaleString()}`,
          });

          // Save user's highest bid to localStorage for persistence
          localStorage.setItem(
            `auction_${id}_user_bid`,
            JSON.stringify({
              amount: userBid.amount,
              bid: `$${userBid.amount.toLocaleString()}`,
            })
          );
        }
      }

      // Update current highest bid
      const highestBid = topBiddersData[0]?.amount || 0;
      if (highestBid > currentHighestBid) {
        setCurrentHighestBid(highestBid);
      }
    }
  }, [topBiddersData, user, currentHighestBid, id]);

  useEffect(() => {
    if (recentActivityData && recentActivityData.length > 0) {
      setLocalRecentActivity(recentActivityData);
    }
  }, [recentActivityData]);

  // Save bid data to localStorage for persistence
  useEffect(() => {
    // Save top bidders to localStorage
    if (localTopBidders.length > 0) {
      localStorage.setItem(
        `auction_${id}_top_bidders`,
        JSON.stringify(localTopBidders)
      );
    }

    // Save recent activity to localStorage
    if (localRecentActivity.length > 0) {
      localStorage.setItem(
        `auction_${id}_recent_activity`,
        JSON.stringify(localRecentActivity)
      );
    }

    // Save current highest bid
    if (currentHighestBid > 0) {
      localStorage.setItem(
        `auction_${id}_highest_bid`,
        currentHighestBid.toString()
      );
    }
  }, [localTopBidders, localRecentActivity, currentHighestBid, id]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedTopBidders = localStorage.getItem(`auction_${id}_top_bidders`);
    const storedRecentActivity = localStorage.getItem(
      `auction_${id}_recent_activity`
    );
    const storedHighestBid = localStorage.getItem(`auction_${id}_highest_bid`);

    if (storedTopBidders) {
      setLocalTopBidders(JSON.parse(storedTopBidders));
    }

    if (storedRecentActivity) {
      setLocalRecentActivity(JSON.parse(storedRecentActivity));
    }

    if (storedHighestBid) {
      setCurrentHighestBid(Number.parseFloat(storedHighestBid));
    }
  }, [id]);

  // Load user's bid from localStorage on initial load
  useEffect(() => {
    if (user) {
      const storedUserBid = localStorage.getItem(`auction_${id}_user_bid`);
      if (storedUserBid) {
        setMyBid(JSON.parse(storedUserBid));
      }
    }
  }, [id, user]);

  // Socket.IO connection setup with reconnection logic
  useEffect(() => {
    // Connect to Socket.IO server
    const SOCKET_SERVER_URL = "https://un-aux.onrender.com";

    const connectSocket = () => {
      console.log("Attempting to connect to socket server...");
      socketRef.current = io(SOCKET_SERVER_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      // Connection events
      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        setIsConnected(true);
        setConnectionAttempts(0);

        // Join auction room
        socketRef.current.emit("joinAuction", { auctionId: id });

        // Request latest data
        socketRef.current.emit("getLatestBids", { auctionId: id });
      });

      socketRef.current.on("connection_ack", (data) => {
        console.log("Connection acknowledged:", data);
      });

      // Listen for new bids
      socketRef.current.on("newBid", (bidData) => {
        console.log("New bid received:", bidData);

        if (bidData.auctionId === id) {
          setLiveBid((prev) => ({
            ...prev,
            currentBid: bidData.amount,
          }));

          // Set current highest bid
          if (bidData.amount > currentHighestBid) {
            setCurrentHighestBid(bidData.amount);
            setBidAnimation(true);
            setTimeout(() => setBidAnimation(false), 1500);
          }

          // Update top bidders
          updateTopBidders(bidData);

          // Update recent activity
          updateRecentActivity(bidData);

          // Update user's bid if it's their own
          if (user && bidData.email === user.email) {
            const newUserBid = {
              amount: bidData.amount,
              bid: `$${bidData.amount.toLocaleString()}`,
            };
            setMyBid(newUserBid);

            // Save to localStorage
            localStorage.setItem(
              `auction_${id}_user_bid`,
              JSON.stringify(newUserBid)
            );
          }
        }
      });

      // Listen for latest bid data
      socketRef.current.on("latestBidData", (data) => {
        console.log("Received latest bid data:", data);
        if (data.topBidders) {
          setLocalTopBidders(data.topBidders);
        }
        if (data.recentActivity) {
          setLocalRecentActivity(data.recentActivity);
        }
        if (data.currentBid) {
          setCurrentHighestBid(data.currentBid);
          setLiveBid((prev) => ({
            ...prev,
            currentBid: data.currentBid,
          }));
        }
      });

      socketRef.current.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Socket reconnection attempt ${attemptNumber}`);
        setConnectionAttempts(attemptNumber);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socketRef.current.on("error", (error) => {
        console.error("Socket error:", error);
      });
    };

    connectSocket();

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveAuction", { auctionId: id });
        socketRef.current.disconnect();
      }
    };
  }, [id, setLiveBid, currentHighestBid, user]);

  // Function to update top bidders locally
  const updateTopBidders = (newBid) => {
    setLocalTopBidders((prevBidders) => {
      // Create a copy of the current bidders
      const updatedBidders = [...prevBidders];

      // Find if this bidder already exists
      const existingBidderIndex = updatedBidders.findIndex(
        (bidder) => bidder.email === newBid.email
      );

      if (existingBidderIndex !== -1) {
        // Update existing bidder if new bid is higher
        if (newBid.amount > updatedBidders[existingBidderIndex].amount) {
          updatedBidders[existingBidderIndex] = {
            ...updatedBidders[existingBidderIndex],
            amount: newBid.amount,
          };
        }
      } else {
        // Add new bidder
        updatedBidders.push({
          name: newBid.name,
          email: newBid.email,
          photo: newBid.photo,
          amount: newBid.amount,
          auctionId: newBid.auctionId,
        });
      }

      console.log("updatedBidders", updatedBidders);

      axiosPublic.patch("/auctionList/topBidders", {
        topBidders: updatedBidders,
      });

      // Sort by bid amount (highest first) and limit to top 3
      return updatedBidders.sort((a, b) => b.amount - a.amount).slice(0, 3);
    });
  };

  // Function to update recent activity locally
  const updateRecentActivity = (newBid) => {
    setLocalRecentActivity((prevActivity) => {
      // Add new activity to the beginning
      const updatedActivity = [
        {
          name: newBid.name,
          photo: newBid.photo,
          amount: newBid.amount,
          createdAt: new Date().toISOString(),
        },
        ...prevActivity,
      ];

      // Limit to most recent 3 activities
      return updatedActivity.slice(0, 3);
    });
  };

  // Transform top bidders data for display
  const topBidders =
    localTopBidders?.map((bidder, index) => ({
      name: bidder.name,
      bid: `$${bidder.amount.toLocaleString()}`,
      photo: bidder.photo,
      email: bidder.email,
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

  // Transform recent activity data for display
  const recentActivity =
    localRecentActivity?.map((bidder) => ({
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

        // Initialize current highest bid if not already set
        if (currentHighestBid === 0 && res.data.currentBid) {
          setCurrentHighestBid(res.data.currentBid);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch auction:", error);
        setLoading(false);
      });
  }, [id, axiosPublic, setLiveBid, setLoading, currentHighestBid]);

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
    const current =
      currentHighestBid || liveBid?.currentBid || liveBid?.startingPrice || 0;
    setBidAmount((Number.parseFloat(current) + amount).toFixed(2));
  };

  const handlePlaceBid = async () => {
    const startingPrice = liveBid?.startingPrice || 0;
    const minRequiredBid = Math.round(0.1 * startingPrice);
    const currentBid =
      currentHighestBid || liveBid?.currentBid || liveBid?.startingPrice || 0;

    if (!user) {
      alert("Please log in to place a bid");
      return;
    }

    if (!bidAmount || Number.parseFloat(bidAmount) <= currentBid) {
      alert("Bid must be higher than current bid");
      return;
    }

    if (!bidAmount || Number.parseFloat(bidAmount) < minRequiredBid) {
      return Swal.fire({
        title: "Not enough balance!",
        text: `Your bid must be at least $${minRequiredBid}, which is 10% of the starting price.`,
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

    const bidData = {
      email: user.email,
      name: user.displayName || "Anonymous",
      photo: user.photoURL || "",
      amount: Number.parseFloat(bidAmount),
      auctionId: id,
      bidderUserId: dbUser?._id,
    };

    try {
      // Send bid data to backend
      const response = await axiosPublic.post("/live-bid", bidData);

      if (response.status === 200 || response.status === 201) {
        // Emit the bid through socket for real-time updates
        if (socketRef.current && isConnected) {
          socketRef.current.emit("placeBid", bidData);
        }

        // Update local state immediately for the current user
        setLiveBid((prev) => ({
          ...prev,
          currentBid: Number.parseFloat(bidAmount),
        }));

        // Update current highest bid
        setCurrentHighestBid(Number.parseFloat(bidAmount));

        // Update user's own bid
        const newUserBid = {
          amount: Number.parseFloat(bidAmount),
          bid: `$${Number.parseFloat(bidAmount).toLocaleString()}`,
        };
        setMyBid(newUserBid);

        // Save to localStorage
        localStorage.setItem(
          `auction_${id}_user_bid`,
          JSON.stringify(newUserBid)
        );

        // Update local top bidders and recent activity
        updateTopBidders(bidData);
        updateRecentActivity(bidData);

        // Trigger animation
        setBidAnimation(true);
        setTimeout(() => setBidAnimation(false), 1500);

        setBidAmount("");

        // Show success notification
        Swal.fire({
          title: "Bid Placed!",
          text: `Your bid of $${Number.parseFloat(
            bidAmount
          ).toLocaleString()} has been placed successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Bid not successful");
      }
    } catch (error) {
      console.error("Failed to place bid:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to place bid. Please try again.",
        icon: "error",
      });
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
      {/* Connection status indicator */}
      <div
        className={`fixed top-16 right-4 z-50 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
          isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-white animate-pulse" : "bg-white"
          }`}
        ></span>
        {isConnected
          ? "Live"
          : connectionAttempts > 0
          ? `Reconnecting (${connectionAttempts})`
          : "Offline"}
      </div>

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
                className="w-full h-96 object-center object-cover transition-transform hover:scale-105 duration-300"
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
                className={`p-4 rounded-xl shadow-lg text-center transition ${
                  bidAnimation
                    ? "animate-pulse scale-105"
                    : "hover:scale-[1.02]"
                } flex flex-col justify-center items-center h-full ${
                  isDarkMode
                    ? "bg-gray-800 border border-purple-500"
                    : "bg-white border border-purple-300"
                }`}
              >
                <p className="text-lg font-semibold">Highest Bid</p>
                <h3
                  className={`font-bold text-2xl ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  $
                  {currentHighestBid?.toLocaleString() ||
                    liveBid?.currentBid?.toLocaleString() ||
                    liveBid?.startingPrice?.toLocaleString() ||
                    "0"}
                </h3>
              </div>

              {user && (
                <div
                  className={`p-4 rounded-xl col-span-2 shadow-lg text-center transition hover:scale-[1.02] flex flex-col justify-center items-center h-full ${
                    isDarkMode
                      ? "bg-gray-800 border border-purple-500"
                      : "bg-white border border-purple-300"
                  }`}
                >
                  <p className="text-lg font-semibold">Your Highest Bid</p>
                  <h3
                    className={`font-bold text-2xl ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {myBid?.bid || "$0"}
                  </h3>
                </div>
              )}
            </div>

            <div
              className={`p-4 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold mb-3">Top Bidders</h3>
              <div className="space-y-3">
                {isTopBiddersFetching && topBidders.length === 0 ? (
                  <p
                    className={`text-center py-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Loading bidders...
                  </p>
                ) : topBidders.length > 0 ? (
                  topBidders.slice(0, 3).map((bidder, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      } ${
                        bidder.email === user?.email
                          ? "border-2 border-purple-500"
                          : ""
                      } 
                      ${index === 0 ? "" : ""}`}
                    >
                      {bidder.icon}
                      <img
                        src={bidder.photo || image}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Bidder"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {bidder.name}
                          {bidder.email === user?.email && (
                            <span className="ml-1 text-xs text-purple-500">
                              (You)
                            </span>
                          )}
                        </h3>
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
                {[
                  100,
                  200,
                  Math.round(
                    (currentHighestBid || liveBid?.currentBid || 0) * 0.1
                  ),
                ].map((amount) => (
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
                <label htmlFor="totalMoney">New Total Money:</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setExtraMoney(
                      e.target.value -
                        (currentHighestBid || liveBid?.currentBid || 0)
                    );
                  }}
                  placeholder={`Enter bid (min $${(
                    (currentHighestBid ||
                      liveBid?.currentBid ||
                      liveBid?.startingPrice ||
                      0) + 100
                  ).toLocaleString()})`}
                  className={`w-full p-3 pb-3 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 focus:ring-purple-500"
                      : "bg-white border-gray-300 focus:ring-purple-400"
                  } border`}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="extraMoney">Extra Money:</label>
                <input
                  id="extraMoney"
                  type="number"
                  readOnly
                  value={Math.max(
                    0,
                    bidAmount - (currentHighestBid || liveBid?.currentBid || 0)
                  )}
                  placeholder={`Extra $${extraMoney || 0}`}
                  className={`w-full p-3 pb-3 rounded-lg focus:outline-none focus:ring-2 ${
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
                {isRecentActivityFetching && recentActivity.length === 0 ? (
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
                      } ${
                        bidder.name === user?.displayName
                          ? "border-2 border-purple-500"
                          : ""
                      } 
                      ${index === 0 ? "animate-fadeIn" : ""}`}
                    >
                      <img
                        src={bidder.photo || image}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Bidder"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">
                            {bidder.name}
                            {bidder.name === user?.displayName && (
                              <span className="ml-1 text-xs text-purple-500">
                                (You)
                              </span>
                            )}
                          </h3>
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
