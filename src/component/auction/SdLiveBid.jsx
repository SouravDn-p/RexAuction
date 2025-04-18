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
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";
import {
  FaHeart,
  FaThumbsUp,
  FaFaceSmile,
  FaFaceSurprise,
} from "react-icons/fa6";

export default function SdLiveBid() {
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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [reactions, setReactions] = useState({
    likes: 0,
    loves: 0,
    smiles: 0,
    wows: 0,
  });
  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const shareRef = useRef(null);
  const reactionRef = useRef(null);
  const [autoBidAmount, setAutoBidAmount] = useState(0);

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
    pollingInterval: 30000,
  });

  const {
    data: recentActivityData,
    refetch: refetchRecentActivity,
    isFetching: isRecentActivityFetching,
  } = useGetRecentActivityQuery(id, {
    pollingInterval: 30000,
  });

  // Initialize local state with fetched data
  useEffect(() => {
    if (topBiddersData && topBiddersData.length > 0) {
      setLocalTopBidders(topBiddersData);

      if (user) {
        const userBid = topBiddersData.find(
          (bidder) => bidder.email === user.email
        );
        if (userBid) {
          setMyBid({
            amount: userBid.amount,
            bid: `$${userBid.amount.toLocaleString()}`,
            autoBid: `$${userBid.autoBid.toLocaleString()}`,
          });
          localStorage.setItem(
            `auction_${id}_user_bid`,
            JSON.stringify({
              amount: userBid.amount,
              bid: `$${userBid.amount.toLocaleString()}`,
              autoBid: `$${userBid.autoBid.toLocaleString()}`,
            })
          );
        }
      }

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
    if (localTopBidders.length > 0) {
      localStorage.setItem(
        `auction_${id}_top_bidders`,
        JSON.stringify(localTopBidders)
      );
    }
    if (localRecentActivity.length > 0) {
      localStorage.setItem(
        `auction_${id}_recent_activity`,
        JSON.stringify(localRecentActivity)
      );
    }
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
    const SOCKET_SERVER_URL = "http://localhost:5000";

    const connectSocket = () => {
      console.log("Attempting to connect to socket server...");
      socketRef.current = io(SOCKET_SERVER_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        setIsConnected(true);
        setConnectionAttempts(0);
        socketRef.current.emit("joinAuction", { auctionId: id });
        socketRef.current.emit("getLatestBids", { auctionId: id });
      });

      socketRef.current.on("connection_ack", (data) => {
        console.log("Connection acknowledged:", data);
      });

      socketRef.current.on("newBid", (bidData) => {
        console.log("New bid received:", bidData);
        if (bidData.auctionId === id) {
          setLiveBid((prev) => ({
            ...prev,
            currentBid: bidData.amount,
          }));
          if (bidData.amount > currentHighestBid) {
            setCurrentHighestBid(bidData.amount);
            setBidAnimation(true);
            setTimeout(() => setBidAnimation(false), 1500);
          }
          updateTopBidders(bidData);
          updateRecentActivity(bidData);
          if (user && bidData.email === user.email) {
            const newUserBid = {
              amount: bidData.amount,
              bid: `$${bidData.amount.toLocaleString()}`,
            };
            setMyBid(newUserBid);
            localStorage.setItem(
              `auction_${id}_user_bid`,
              JSON.stringify(newUserBid)
            );
          }
        }
      });

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

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveAuction", { auctionId: id });
        socketRef.current.disconnect();
      }
    };
  }, [id, setLiveBid, currentHighestBid, user]);

  const updateTopBidders = (newBid) => {
    setLocalTopBidders((prevBidders) => {
      const updatedBidders = [...prevBidders];
      const existingBidderIndex = updatedBidders.findIndex(
        (bidder) => bidder.email === newBid.email
      );

      if (existingBidderIndex !== -1) {
        if (newBid.amount > updatedBidders[existingBidderIndex].amount) {
          updatedBidders[existingBidderIndex] = {
            ...updatedBidders[existingBidderIndex],
            amount: newBid.amount,
          };
        }
      } else {
        updatedBidders.push({
          name: newBid.name,
          email: newBid.email,
          photo: newBid.photo,
          amount: newBid.amount,
          auctionId: newBid.auctionId,
          autoBid: newBid.autoBid,
        });
      }

      console.log("updatedBidders", updatedBidders);
      axiosPublic.patch("/auctionList/topBidders", {
        topBidders: updatedBidders,
      });

      return updatedBidders.sort((a, b) => b.amount - a.amount).slice(0, 3);
    });
  };

  const updateRecentActivity = (newBid) => {
    setLocalRecentActivity((prevActivity) => {
      const updatedActivity = [
        {
          name: newBid.name,
          photo: newBid.photo,
          amount: newBid.amount,
          createdAt: new Date().toISOString(),
        },
        ...prevActivity,
      ];
      return updatedActivity.slice(0, 3);
    });
  };

  const topBidders =
    localTopBidders?.map((bidder, index) => ({
      name: bidder.name,
      bid: `$${bidder?.amount?.toLocaleString() || 0}`,
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

  const recentActivity =
    localRecentActivity?.map((bidder) => ({
      name: bidder.name,
      bid: `$${bidder?.amount?.toLocaleString() || 0}`,
      photo: bidder.photo,
      createdAt: bidder.createdAt,
    })) || [];

  useEffect(() => {
    setLoading(true);
    axiosPublic
      .get(`/auction/${id}`)
      .then((res) => {
        setLiveBid(res.data);
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
  const handleAutoBidIncrement = (amount) => {
    const current =
      currentHighestBid || liveBid?.currentBid || liveBid?.startingPrice || 0;
    setAutoBidAmount((Number.parseFloat(current) + amount).toFixed(2));
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

    console.log("myBid?.autoBid", myBid?.autoBid);

    const bidData = {
      email: user.email,
      name: user.displayName || "Anonymous",
      photo: user.photoURL || "",
      amount: Number.parseFloat(bidAmount),
      auctionId: id,
      autoBid: myBid?.autoBid || 0,
      bidderUserId: dbUser?._id,
    };

    console.log("bidData in place bid", bidData);

    try {
      console.log("localTopBidders", localTopBidders);
      console.log("bidData", bidData);
      const response = await axiosPublic.post("/live-bid", bidData);

      if (response.status === 200 || response.status === 201) {
        if (socketRef.current && isConnected) {
          socketRef.current.emit("placeBid", bidData);
        }

        setLiveBid((prev) => ({
          ...prev,
          currentBid: Number.parseFloat(bidAmount),
        }));
        setCurrentHighestBid(Number.parseFloat(bidAmount));

        const newUserBid = {
          amount: Number.parseFloat(bidAmount),
          bid: `$${Number.parseFloat(bidAmount).toLocaleString()}`,
          autoBid: `$${Number.parseFloat(autoBidAmount).toLocaleString()}`,
        };
        setMyBid(newUserBid);
        localStorage.setItem(
          `auction_${id}_user_bid`,
          JSON.stringify(newUserBid)
        );

        updateTopBidders(bidData);
        updateRecentActivity(bidData);

        setBidAnimation(true);
        setTimeout(() => setBidAnimation(false), 1500);
        setBidAmount("");

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

  const handleAutoBid = async () => {
    const startingPrice = liveBid?.startingPrice || 0;
    const minRequiredBid = Math.round(0.1 * startingPrice);
    const currentBid =
      currentHighestBid || liveBid?.currentBid || liveBid?.startingPrice || 0;

    if (!user) {
      alert("Please log in to place a bid");
      return;
    }

    if (!autoBidAmount || Number.parseFloat(autoBidAmount) <= currentBid) {
      alert("Auto Bid must be higher than current bid");
      return;
    }

    if (!autoBidAmount || Number.parseFloat(autoBidAmount) < minRequiredBid) {
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
    console.log("currentBid", currentBid);

    const bidData = {
      email: user.email,
      name: user.displayName || "Anonymous",
      photo: user.photoURL || "",
      amount: Number.parseFloat(currentBid),
      auctionId: id,
      bidderUserId: dbUser?._id,
      autoBid: Number.parseFloat(autoBidAmount) || 0,
    };

    console.log("bidData in place autoBid", bidData);

    try {
      const response = await axiosPublic.post("/live-bid", bidData);

      if (response.status === 200 || response.status === 201) {
        if (socketRef.current && isConnected) {
          socketRef.current.emit("placeBid", bidData);
        }

        setLiveBid((prev) => ({
          ...prev,
          currentBid: Number.parseFloat(currentBid),
        }));
        setCurrentHighestBid(Number.parseFloat(currentBid));

        const newUserBid = {
          amount: Number.parseFloat(currentBid),
          bid: `$${Number.parseFloat(currentBid).toLocaleString()}`,
          autoBid: `$${Number.parseFloat(autoBidAmount).toLocaleString()}`,
        };
        setMyBid(newUserBid);
        localStorage.setItem(
          `auction_${id}_user_bid`,
          JSON.stringify(newUserBid)
        );

        updateTopBidders(bidData);
        updateRecentActivity(bidData);

        setBidAnimation(true);
        setTimeout(() => setBidAnimation(false), 1500);
        setBidAmount("");

        Swal.fire({
          title: "Auto Bid Placed!",
          text: `Your bid of $${Number.parseFloat(
            autoBidAmount
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

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = liveBid?.name || "Check out this auction!";
    const description =
      liveBid?.description || "An amazing item up for auction!";

    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          title + " " + url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        Swal.fire({
          title: "Link Copied!",
          text: "Auction link has been copied to clipboard",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowShareOptions(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareOptions(false);
  };

  const handleReaction = (type) => {
    if (!user) {
      alert("Please log in to react to this auction");
      return;
    }

    if (userReaction === type) {
      setReactions((prev) => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1),
      }));
      setUserReaction(null);
      saveReactionToDatabase(null);
    } else {
      if (userReaction) {
        setReactions((prev) => ({
          ...prev,
          [userReaction]: Math.max(0, prev[userReaction] - 1),
        }));
      }

      setReactions((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }));
      setUserReaction(type);
      saveReactionToDatabase(type);
    }

    setShowReactions(false);
  };

  const saveReactionToDatabase = async (reactionType) => {
    try {
      if (!user) return;

      const response = await axiosPublic.post("/auction-reaction", {
        auctionId: id,
        userId: user.uid,
        reactionType,
      });

      if (response.data.success) {
        console.log("Reaction saved successfully:", response.data);
      } else {
        console.error("Failed to save reaction:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to save reaction:", error);
    }
  };

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await axiosPublic
          .get(`/auction-reactions/${id}`, {
            params: { userId: user?.uid },
            timeout: 3000,
          })
          .catch((error) => {
            if (
              error.response?.status === 404 ||
              error.code === "ECONNABORTED"
            ) {
              console.log(
                "Reaction endpoint not available, using default values"
              );
              return {
                data: {
                  success: true,
                  reactionCounts: { likes: 0, loves: 0, smiles: 0, wows: 0 },
                  userReactions: [],
                },
              };
            }
            throw error;
          });

        if (response.data.success) {
          setReactions(
            response.data.reactionCounts || {
              likes: 0,
              loves: 0,
              smiles: 0,
              wows: 0,
            }
          );
          if (user && response.data.userReactions?.length > 0) {
            setUserReaction(response.data.userReactions[0].reactionType);
          }
        }
      } catch (error) {
        console.error("Failed to fetch reactions:", error);
        setReactions({ likes: 0, loves: 0, smiles: 0, wows: 0 });
      }
    };

    fetchReactions();
    const interval = setInterval(fetchReactions, 30000);
    return () => clearInterval(interval);
  }, [id, user, axiosPublic]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setShowReactions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-purple-100/30"
      }`}
    >
      {/* Banner Section */}
      <div className="relative w-full h-[30vh] lg:h-[40vh] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://i.ibb.co.com/LD4RqkpN/4025865-17454.jpg"
            alt="Live Bidding Banner"
            className="w-full h-full object-cover object-center scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/80"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="text-right px-4 mt-20 lg:mt-10 sm:px-6 md:px-8 lg:px-12 mr-4 sm:mr-6 md:mr-8 lg:mr-12 text-white relative z-10">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight">
              <span className="text-violet-400">LIVE BIDDING</span>{" "}
              <span className="text-white">BID YOUR AUCTION</span>
            </h1>
          </div>
        </div>
      </div>

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
        className={`w-11/12 mx-auto py-10 ${
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
                  <div className="relative" ref={reactionRef}>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowReactions(!showReactions)}
                    >
                      {userReaction ? (
                        userReaction === "likes" ? (
                          <FaThumbsUp className="text-blue-500" />
                        ) : userReaction === "loves" ? (
                          <FaHeart className="text-red-500" />
                        ) : userReaction === "smiles" ? (
                          <FaFaceSmile className="text-yellow-500" />
                        ) : userReaction === "wows" ? (
                          <FaFaceSurprise className="text-yellow-500" />
                        ) : userReaction === "flags" ? (
                          <span
                            className="text-xl text-orange-500"
                            role="img"
                            aria-label="White Flag"
                          >
                            🏳️
                          </span>
                        ) : (
                          <GiSelfLove
                            className={`hover:text-red-500 transition ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          />
                        )
                      ) : (
                        <GiSelfLove
                          className={`hover:text-red-500 transition ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                      )}
                      <span className="text-sm font-medium">
                        {reactions.likes +
                          reactions.loves +
                          reactions.smiles +
                          reactions.wows +
                          reactions.flags >
                          0 &&
                          reactions.likes +
                            reactions.loves +
                            reactions.smiles +
                            reactions.wows +
                            reactions.flags}
                      </span>
                    </div>

                    {showReactions && (
                      <div
                        className={`absolute top-full left-0 mt-2 p-2 rounded-xl shadow-lg z-10 flex gap-2 ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <button
                          onClick={() => handleReaction("likes")}
                          className={`p-2 rounded-full transition ${
                            userReaction === "likes"
                              ? "bg-blue-100"
                              : "hover:bg-gray-100"
                          }`}
                          title="Like"
                        >
                          <FaThumbsUp
                            className={`text-xl ${
                              userReaction === "likes"
                                ? "text-blue-500"
                                : "text-blue-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleReaction("loves")}
                          className={`p-2 rounded-full transition ${
                            userReaction === "loves"
                              ? "bg-red-100"
                              : "hover:bg-gray-100"
                          }`}
                          title="Love"
                        >
                          <FaHeart
                            className={`text-xl ${
                              userReaction === "loves"
                                ? "text-red-500"
                                : "text-red-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleReaction("smiles")}
                          className={`p-2 rounded-full transition ${
                            userReaction === "smiles"
                              ? "bg-yellow-100"
                              : "hover:bg-gray-100"
                          }`}
                          title="Smile"
                        >
                          <FaFaceSmile
                            className={`text-xl ${
                              userReaction === "smiles"
                                ? "text-yellow-500"
                                : "text-yellow-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleReaction("wows")}
                          className={`p-2 rounded-full transition ${
                            userReaction === "wows"
                              ? "bg-yellow-100"
                              : "hover:bg-gray-100"
                          }`}
                          title="Wow"
                        >
                          <FaFaceSurprise
                            className={`text-xl ${
                              userReaction === "wows"
                                ? "text-yellow-500"
                                : "text-yellow-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleReaction("flags")}
                          className={`p-2 rounded-full transition ${
                            userReaction === "flags"
                              ? "bg-orange-100"
                              : "hover:bg-gray-100"
                          }`}
                          title="Flag"
                        >
                          <span
                            className={`text-xl ${
                              userReaction === "flags"
                                ? "text-orange-500"
                                : "text-orange-400"
                            }`}
                            role="img"
                            aria-label="White Flag"
                          >
                            🏳️
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={shareRef}>
                    <FaShare
                      className={`cursor-pointer hover:text-blue-500 transition ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                      onClick={() => setShowShareOptions(!showShareOptions)}
                    />

                    {showShareOptions && (
                      <div
                        className={`absolute top-full right-0 mt-2 p-2 rounded-xl shadow-lg z-10 ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-2 min-w-[150px]">
                          <button
                            onClick={() => handleShare("facebook")}
                            className={`flex items-center gap-2 p-2 rounded-md transition ${
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <FaFacebook className="text-blue-600" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => handleShare("twitter")}
                            className={`flex items-center gap-2 p-2 rounded-md transition ${
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <FaTwitter className="text-blue-400" />
                            <span>Twitter</span>
                          </button>
                          <button
                            onClick={() => handleShare("whatsapp")}
                            className={`flex items-center gap-2 p-2 rounded-md transition ${
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <FaWhatsapp className="text-green-500" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleShare("copy")}
                            className={`flex items-center gap-2 p-2 rounded-md transition ${
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <FaLink className="text-gray-500" />
                            <span>Copy Link</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

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
              <div className="lg:flex gap-4 items-center justify-between">
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
                  className={`flex mt-5 lg:mt-0 items-center gap-2 px-4 py-2 rounded-lg transition ${
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
                <>
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
                      {myBid?.bid || "$ 0"}
                    </h3>
                  </div>
                  <div
                    className={`p-4 rounded-xl col-span-2 shadow-lg text-center transition hover:scale-[1.02] flex flex-col justify-center items-center h-full ${
                      isDarkMode
                        ? "bg-gray-800 border border-purple-500"
                        : "bg-white border border-purple-300"
                    }`}
                  >
                    <p className="text-lg font-semibold">Your Auto Bid</p>
                    <h3
                      className={`font-bold text-2xl ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {myBid?.autoBid || "$0"}
                    </h3>
                  </div>
                </>
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
              className={`p-5 rounded-xl shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold text-center mb-4">
                Set Your Auto Bid
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
                    onClick={() => handleAutoBidIncrement(amount)}
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
                <label htmlFor="totalMoney">Auto Highest Bid:</label>
                <input
                  type="number"
                  value={autoBidAmount}
                  onChange={(e) => {
                    setAutoBidAmount(e.target.value);
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

              <button
                onClick={() => handleAutoBid()}
                disabled={formatTime(countdown) === "Ended" || isBidLoading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  formatTime(countdown) === "Ended" || isBidLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white`}
              >
                {isBidLoading
                  ? "Placing Auto Bid..."
                  : formatTime(countdown) === "Ended"
                  ? "Auction Ended"
                  : "Place Auto Bid"}
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
