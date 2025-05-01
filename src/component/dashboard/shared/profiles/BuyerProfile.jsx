import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import useAuth from "../../../../hooks/useAuth";
import coverPhoto from "../../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../../LoadingSpinner";
import axios from "axios";
import {
  FaGavel,
  FaWallet,
  FaStar,
  FaFilter,
  FaSort,
  FaArrowRight,
  FaMoneyCheckAlt,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import { IoIosHammer } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ThemeContext from "../../../Context/ThemeContext";
import SharedPayment from "../payment/SharedPayment";

// Demo images for auction status
import antique from "/DemoAuctionImg/antique.jpg";
import antique2 from "/DemoAuctionImg/antique2.jpg";
import antique3 from "/DemoAuctionImg/antique3.jpg";
import antique4 from "/DemoAuctionImg/antique4.jpeg";

const profileData = {
  totalBids: 25,
  auctionWon: 5,
};

const biddingTips = [
  {
    id: 1,
    title: "Set a Budget",
    description:
      "Determine your maximum bid before the auction starts to avoid overspending.",
    icon: <FaWallet className="text-3xl text-purple-500" />,
    overlayIcon: <FaWallet className="text-6xl text-purple-500" />,
  },
  {
    id: 2,
    title: "Research Items",
    description:
      "Study the auction items to understand their value and condition.",
    icon: <FaStar className="text-3xl text-purple-500" />,
    overlayIcon: <FaStar className="text-6xl text-purple-500" />,
  },
  {
    id: 3,
    title: "Bid Strategically",
    description:
      "Place bids late in the auction to increase your chances of winning.",
    icon: <FaGavel className="text-3xl text-purple-500" />,
    overlayIcon: <FaGavel className="text-6xl text-purple-500" />,
  },
];

// Demo data for auction status fallback
const demoAuctionData = [
  {
    id: "1",
    product: "Antique Vase",
    image: antique,
    position: "1",
    totalBidders: 5,
    isWinning: true,
  },
  {
    id: "2",
    product: "Old Painting",
    image: antique2,
    position: "2",
    totalBidders: 8,
    isWinning: false,
  },
  {
    id: "3",
    product: "Vintage Car",
    image: antique3,
    position: "1",
    totalBidders: 6,
    isWinning: true,
  },
  {
    id: "4",
    product: "Gold Watch",
    image: antique4,
    position: "3",
    totalBidders: 4,
    isWinning: false,
  },
];

const BuyerProfile = () => {
  const { user, loading: authLoading, dbUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { isDarkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [currentCover, setCurrentCover] = useState(coverPhoto);
  const [selectedCover, setSelectedCover] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [payments, setPayments] = useState([]);
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [auctiontatus, setauctiontatus] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  const [biddingFilter, setBiddingFilter] = useState("all");
  const [biddingSort, setBiddingSort] = useState("date-desc");
  const [auctiontatusLoading, setauctiontatusLoading] = useState(false);
  const [auctiontatusError, setauctiontatusError] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  // Fetch account balance
  useEffect(() => {
    if (user?.email) {
      setBalanceLoading(true);
      axios
        .get(
          `https://rex-auction-server-side-jzyx.onrender.com/users?email=${user.email}`
        )
        .then((res) => {
          const userData = res.data[0];
          setAccountBalance(userData?.accountBalance || 0);
          setBalanceLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching account balance:", err);
          setBalanceError("Failed to load account balance.");
          setBalanceLoading(false);
        });
    }
  }, [user]);

  // Fetch payments for buyer
  useEffect(() => {
    if (user?.email) {
      setPaymentsLoading(true);
      axios
        .get(
          `https://rex-auction-server-side-jzyx.onrender.com/payments?buyerEmail=${user.email}`
        )
        .then((res) => {
          setPayments(res.data.slice(0, 5));
          setPaymentsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching payments:", err);
          setPaymentsError("Failed to load payments.");
          setPaymentsLoading(false);
        });
    }
  }, [user]);

  // Fetch bidding history for buyer
  useEffect(() => {
    if (user?.email) {
      axios
        .get(
          `https://rex-auction-server-side-jzyx.onrender.com/bids?buyerEmail=${user.email}`
        )
        .then((res) => setBiddingHistory(res.data.slice(0, 5)))
        .catch((err) => console.error("Error fetching bidding history:", err));
    }
  }, [user]);

  // Fetch auction status for buyer
  useEffect(() => {
    if (user?.email) {
      setauctiontatusLoading(true);
      axios
        .get("https://rex-auction-server-side-jzyx.onrender.com/auction")
        .then((res) => {
          console.log("Auction status response:", res.data);

          const auction = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.auction)
            ? res.data.auction
            : [];

          if (!auction.length) {
            setauctiontatus(demoAuctionData.slice(0, 4));
            setauctiontatusLoading(false);
            return;
          }

          const userBids = auction
            .filter((auction) => Array.isArray(auction.topBidders))
            .filter((auction) =>
              auction.topBidders.some((b) => b.email === user.email)
            )
            .map((auction) => {
              const userBid = auction.topBidders.find(
                (b) => b.email === user.email
              );
              const isAuctionEnded = new Date(auction.endTime) < new Date();
              return {
                id: auction._id,
                product: auction.name,
                image: auction.images?.[0] || coverPhoto,
                position: userBid?.position ?? "-",
                totalBidders: auction.topBidders.length,
                isWinning: isAuctionEnded
                  ? userBid?.position === 1
                  : userBid?.isWinning ?? false,
              };
            });

          setauctiontatus(userBids.slice(0, 4));
          setauctiontatusLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching auction status:", err);
          setauctiontatusError("Failed to load auction status.");
          setauctiontatusLoading(false);
          setauctiontatus(demoAuctionData.slice(0, 4));
        });
    }
  }, [user]);

  // Fetch cover options and user cover
  useEffect(() => {
    const fetchCoverOptions = async () => {
      try {
        const response = await axios.get(
          "https://rex-auction-server-side-jzyx.onrender.com/cover-options"
        );
        setCoverOptions(response.data);
      } catch (error) {
        console.error("Error fetching cover options:", error);
        setCoverOptions([
          { id: 1, image: coverPhoto },
          { id: 2, image: "https://i.ibb.co/KSCtW5n/download-2.jpg" },
          { id: 3, image: "https://i.ibb.co/60Q0GGYP/download-3.jpg" },
          { id: 4, image: "https://i.ibb.co/RGwFXk1S/download-4.jpg" },
        ]);
      }
    };

    const fetchUserCover = async () => {
      if (user?.uid) {
        try {
          const response = await axios.get(
            `https://rex-auction-server-side-jzyx.onrender.com/cover/${user.uid}`
          );
          if (response.data.image) {
            setCurrentCover(response.data.image);
          }
        } catch (error) {
          console.error("Error fetching user cover:", error);
          setCurrentCover(coverPhoto);
        }
      }
    };

    fetchCoverOptions();
    fetchUserCover();
  }, [user]);

  const saveCoverImage = async () => {
    if (!selectedCover || !user?.uid) return;
    setIsSaving(true);
    try {
      await axios.patch(
        "https://rex-auction-server-side-jzyx.onrender.com/cover",
        {
          userId: user.uid,
          image: selectedCover,
        }
      );
      setCurrentCover(selectedCover);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving cover image:", error);
      alert("Failed to save cover image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStatusBadge = (status) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        } shadow-sm`}
      >
        {status ? "Won" : "Lost"}
      </span>
    );
  };

  const boxStyle = `border rounded-xl shadow-lg ${
    isDarkMode
      ? "bg-gray-800/90 border-gray-700 hover:bg-gray-700"
      : "bg-white/90 border-gray-200 hover:bg-gray-50"
  } transition-all duration-300`;

  const titleStyle = `text-2xl md:text-3xl font-bold ${
    isDarkMode ? "text-white" : "text-gray-900"
  }`;

  const labelStyle = `text-sm ${
    isDarkMode ? "text-gray-300" : "text-gray-600"
  }`;

  // Filter and sort bidding history
  const filteredBiddingHistory = biddingHistory.filter((bid) => {
    if (biddingFilter === "all") return true;
    return bid.status === biddingFilter;
  });

  const sortedBiddingHistory = filteredBiddingHistory.sort((a, b) => {
    if (biddingSort === "date-desc") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (biddingSort === "date-asc") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    } else if (biddingSort === "amount-desc") {
      return (b.amount || 0) - (a.amount || 0);
    } else if (biddingSort === "amount-asc") {
      return (a.amount || 0) - (b.amount || 0);
    }
    return 0;
  });

  // Filter auction status
  const filteredauctiontatus = auctiontatus.filter((bid) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Won") return bid.isWinning;
    if (statusFilter === "Lost") return !bid.isWinning;
    return true;
  });

  // Prepare chart data for bidding activity
  const chartData = biddingHistory.length
    ? biddingHistory
        .reduce((acc, bid) => {
          const date = new Date(
            bid.createdAt || Date.now()
          ).toLocaleDateString();
          const existing = acc.find((item) => item.date === date);
          if (existing) {
            existing.count += 1;
            existing.amount += typeof bid.amount === "number" ? bid.amount : 0;
          } else {
            acc.push({
              date,
              count: 1,
              amount: typeof bid.amount === "number" ? bid.amount : 0,
            });
          }
          return acc;
        }, [])
        .slice(-5)
    : [
        { date: "2025-04-23", count: 2, amount: 100 },
        { date: "2025-04-24", count: 3, amount: 150 },
        { date: "2025-04-25", count: 1, amount: 200 },
        { date: "2025-04-26", count: 4, amount: 180 },
        { date: "2025-04-27", count: 2, amount: 250 },
      ];

  if (authLoading) return <LoadingSpinner />;
  const formatNumber = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white"
          : "bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 text-gray-800"
      } transition-all duration-500 p-4 md:p-8 pt-16`}
    >
      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-[350px] bg-cover bg-center rounded-2xl overflow-hidden shadow-xl"
        style={{
          backgroundImage: `url(${currentCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="absolute right-4 top-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold flex items-center shadow-lg backdrop-blur-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Edit Cover
        </motion.button>
      </motion.div>

      {/* Cover Image Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-8 rounded-2xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto`}
          >
            <h2
              className={`text-3xl font-bold text-center mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Choose Your Cover Image
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {coverOptions.map((cover) => (
                <motion.div
                  key={cover.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer border-4 rounded-xl transition-all overflow-hidden ${
                    selectedCover === cover.image
                      ? "border-purple-500 ring-4 ring-purple-300/50"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedCover(cover.image)}
                >
                  <img
                    src={cover.image}
                    alt={`Cover ${cover.id}`}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = coverPhoto;
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-end mt-8 space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(false)}
                className={`px-6 py-3 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } font-semibold transition-colors`}
                disabled={isSaving}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveCoverImage}
                className={`px-6 py-3 rounded-full ${
                  isSaving
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                } text-white font-semibold shadow-lg transition-all`}
                disabled={isSaving || !selectedCover}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Cover"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-6 -mt-20 mb-8"
      >
        <div
          className={`flex flex-col md:flex-row items-center gap-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <div className="relative flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-32 h-32 rounded-full border-4 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-white bg-gray-200"
              } overflow-hidden shadow-xl relative`}
            >
              <img
                src={
                  user?.photoURL ||
                  "https://img.freepik.com/premium-vector/flat-businessman-character_33040-132.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid&w=740"
                }
                alt="Profile picture"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://img.freepik.com/premium-vector/flat-businessman-character_33040-132.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid&w=740";
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </div>
          <div className="lg:text-left text-center w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className={titleStyle}>{user?.displayName || "No name"}</h1>
                <p className={`mt-2 ${labelStyle}`}>
                  Email: {user?.email || "No email"}
                  {dbUser?.location ? (
                    <span> • Location: {dbUser?.location}</span>
                  ) : (
                    ""
                  )}
                  {dbUser?.memberSince ? (
                    <span> • Member Since: {dbUser?.memberSince}</span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-500" />
                  <span className="text-sm font-semibold">4.5</span>
                </div>
                {dbUser?.role && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      dbUser.role === "buyer"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {dbUser.role}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
              
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/auction")}
                  className={`px-6 py-2 text-sm rounded-full font-semibold ${
                    isDarkMode
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  } shadow-md flex items-center gap-2`}
                >
                  <IoIosHammer className="text-lg" />
                  Explore auction
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bidding Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`${boxStyle} mb-8 overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={titleStyle}>Bidding Dashboard</h2>
          <p className={`mt-1 ${labelStyle}`}>
            Overview of your bidding performance and balance
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-br from-blue-900/80 to-blue-800/80"
                : "bg-gradient-to-br from-blue-50 to-blue-100"
            } flex items-center gap-4 border ${
              isDarkMode ? "border-blue-700" : "border-blue-200"
            } relative overflow-hidden`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <FaGavel className="text-6xl text-blue-500" />
            </div>
            <div className="bg-blue-500/20 p-3 rounded-full">
              <FaGavel className="text-2xl text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Bids</h3>
              <p className="text-2xl font-bold">
                <CountUp end={profileData.totalBids} duration={2} />
              </p>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                +5 this month
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-br from-green-900/80 to-green-800/80"
                : "bg-gradient-to-br from-green-50 to-green-100"
            } flex items-center gap-4 border ${
              isDarkMode ? "border-green-700" : "border-green-200"
            } relative overflow-hidden`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <FaStar className="text-6xl text-green-500" />
            </div>
            <div className="bg-green-500/20 p-3 rounded-full">
              <FaStar className="text-2xl text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">auction Won</h3>
              <p className="text-2xl font-bold">
                <CountUp end={profileData.auctionWon} duration={2} />
              </p>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-green-300" : "text-green-600"
                }`}
              >
                20% success rate
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-900/80 to-purple-800/80"
                : "bg-gradient-to-br from-purple-50 to-purple-100"
            } flex items-center gap-4 border ${
              isDarkMode ? "border-purple-700" : "border-purple-200"
            } relative overflow-hidden`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <FaWallet className="text-6xl text-purple-500" />
            </div>
            <div className="bg-purple-500/20 p-3 rounded-full">
              <FaWallet className="text-2xl text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Account Balance</h3>
              {balanceLoading ? (
                <p className="text-gray-500 text-sm">Loading balance...</p>
              ) : balanceError ? (
                <p className="text-red-500 text-sm">{balanceError}</p>
              ) : (
                <>
                 <p className="text-3xl font-bold text-gray-600">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
                  <p
                    className={`text-xs mt-1 ${
                      isDarkMode ? "text-purple-300" : "text-purple-600"
                    }`}
                  >
                    Available for bidding
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Buyer Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`${boxStyle} mb-8`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className={titleStyle}>Your Activity</h2>
              <p className={labelStyle}>
                Track your bids, payments, and auction status
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["overview", "bidding", "payments", "status"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? isDarkMode
                        ? "bg-purple-600 text-white shadow-purple-md"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab === "overview"
                    ? "Overview"
                    : tab === "bidding"
                    ? "Bidding History"
                    : tab === "payments"
                    ? "Payments"
                    : "Auction Status"}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaChartLine className="text-purple-500" />
                  Bidding Trends
                </h3>
                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-xl shadow-md`}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorBar"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6D28D9"
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#4B5563" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: isDarkMode ? "#E5E7EB" : "#4B5563" }}
                        axisLine={{
                          stroke: isDarkMode ? "#6B7280" : "#D1D5DB",
                        }}
                      />
                      <YAxis
                        tick={{ fill: isDarkMode ? "#E5E7EB" : "#4B5563" }}
                        axisLine={{
                          stroke: isDarkMode ? "#6B7280" : "#D1D5DB",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                          border: `1px solid ${
                            isDarkMode ? "#374151" : "#E5E7EB"
                          }`,
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        itemStyle={{
                          color: isDarkMode ? "#E5E7EB" : "#111827",
                        }}
                        labelStyle={{
                          fontWeight: "bold",
                          color: isDarkMode ? "#E5E7EB" : "#111827",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: "20px",
                          color: isDarkMode ? "#E5E7EB" : "#4B5563",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        name="Bids"
                        fill="url(#colorBar)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={2000}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index % 3 === 0
                                ? "#F59E0B"
                                : index % 3 === 1
                                ? "#10B981"
                                : "#EF4444"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Additional stats summary */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {chartData.slice(0, 3).map((entry, index) => (
                      <motion.div
                        key={entry.date}
                        whileHover={{ y: -5 }}
                        className={`p-4 rounded-xl shadow-md ${
                          isDarkMode ? "bg-gray-700" : "bg-white"
                        } border ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        } text-center`}
                      >
                        <p className="text-sm font-medium">{entry.date}</p>
                        <p className="text-2xl font-bold mt-1">{entry.count}</p>
                        <div
                          className={`h-1 mt-2 rounded-full ${
                            index % 3 === 0
                              ? "bg-yellow-500"
                              : index % 3 === 1
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "bidding" && (
              <motion.div
                key="bidding"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-purple-500" />
                    <select
                      value={biddingFilter}
                      onChange={(e) => setBiddingFilter(e.target.value)}
                      className={`p-2 rounded-full ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                      } border font-semibold transition-colors`}
                    >
                      <option value="all">All Bids</option>
                      <option value="Won">Won</option>
                      <option value="Active">Active</option>
                      <option value="Outbid">Outbid</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaSort className="text-purple-500" />
                    <select
                      value={biddingSort}
                      onChange={(e) => setBiddingSort(e.target.value)}
                      className={`p-2 rounded-full ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                      } border font-semibold transition-colors`}
                    >
                      <option value="date-desc">Date (Newest)</option>
                      <option value="date-asc">Date (Oldest)</option>
                      <option value="amount-desc">Amount (High to Low)</option>
                      <option value="amount-asc">Amount (Low to High)</option>
                    </select>
                  </div>
                </div>
                {sortedBiddingHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <FaGavel className="text-4xl text-purple-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">
                      No Bids Found
                    </h4>
                    <p className="text-gray-500 mb-6">
                      You haven't placed any bids yet.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/auction")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 mx-auto"
                    >
                      <IoIosHammer className="text-lg" />
                      Start Bidding
                    </motion.button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedBiddingHistory.map((bid) => (
                      <motion.div
                        key={bid._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl shadow-md ${
                          isDarkMode ? "bg-gray-700" : "bg-white"
                        } border ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        } hover:${
                          isDarkMode ? "bg-gray-600" : "bg-gray-50"
                        } transition-colors`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold truncate">
                            {bid.auctionName || "N/A"}
                          </h4>
                          {renderStatusBadge(bid.status)}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaWallet className="text-purple-500" />
                          <p className="text-sm">
                            Bid Amount: $
                            {typeof bid.amount === "number"
                              ? bid.amount.toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                        <p className={labelStyle}>
                          Date:{" "}
                          {bid.createdAt
                            ? new Date(bid.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === "payments" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FaMoneyCheckAlt className="text-green-500" />
                    Payment History
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard/sharedPayment")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md flex items-center gap-2"
                  >
                    View All
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </div>
                {paymentsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : paymentsError ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">{paymentsError}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold"
                    >
                      Try Again
                    </motion.button>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <FaMoneyCheckAlt className="text-4xl text-green-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">
                      No Payments Found
                    </h4>
                    <p className="text-gray-500 mb-6">
                      You haven't made any payments yet.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/auction")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 mx-auto"
                    >
                      <IoIosHammer className="text-lg" />
                      Start Bidding
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <SharedPayment />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {payments.map((payment) => (
                        <motion.div
                          key={payment._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl shadow-md ${
                            isDarkMode ? "bg-gray-700" : "bg-white"
                          } border ${
                            isDarkMode ? "border-gray-600" : "border-gray-200"
                          } hover:${
                            isDarkMode ? "bg-gray-600" : "bg-gray-50"
                          } transition-colors`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold truncate">
                              {payment.auctionName || "N/A"}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-md capitalize ${
                                payment.status === "completed"
                                  ? "bg-green-500 text-white"
                                  : "bg-yellow-500 text-white"
                              }`}
                            >
                              {payment.status || "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <FaWallet className="text-purple-500" />
                            <p className="text-sm">
                              Amount: $
                              {typeof payment.amount === "number"
                                ? payment.amount.toFixed(2)
                                : "0.00"}
                            </p>
                          </div>
                          <p className={labelStyle}>
                            Date:{" "}
                            {payment.createdAt
                              ? new Date(
                                  payment.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
            {activeTab === "status" && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FaBell className="text-yellow-500" />
                    Recent Auction Status
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard/status")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md flex items-center gap-2"
                  >
                    View All
                    <FaArrowRight />
                  </motion.button>
                </div>
                <div className="flex justify-start gap-3 mb-6">
                  {["All", "Won", "Lost"].map((status) => (
                    <motion.button
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusFilter === status
                          ? "bg-purple-600 text-white"
                          : isDarkMode
                          ? "bg-gray-600 text-white hover:bg-gray-500"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
                {auctiontatusLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : auctiontatusError ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">{auctiontatusError}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold"
                    >
                      Try Again
                    </motion.button>
                  </div>
                ) : filteredauctiontatus.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <FaBell className="text-4xl text-yellow-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">
                      No Auction Status Found
                    </h4>
                    <p className="text-gray-500 mb-6">
                      You haven't participated in any auction yet.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/auction")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 mx-auto"
                    >
                      <IoIosHammer className="text-lg" />
                      Start Bidding
                    </motion.button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredauctiontatus.map((status) => (
                      <motion.div
                        key={status.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl shadow-md ${
                          isDarkMode ? "bg-gray-700" : "bg-white"
                        } flex items-center gap-4 border ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        } hover:${
                          isDarkMode ? "bg-gray-600" : "bg-gray-50"
                        } transition-colors`}
                      >
                        <img
                          src={status.image}
                          alt={status.product}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => (e.target.src = coverPhoto)}
                        />
                        <div>
                          <h4 className="font-semibold">{status.product}</h4>
                          <p className="text-sm">
                            Position: #{status.position} / {status.totalBidders}
                          </p>
                          <p className="text-sm mt-1">
                            {renderStatusBadge(status.isWinning)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bidding Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`${boxStyle} mb-8`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={titleStyle}>Bidding Tips</h2>
          <p className={labelStyle}>Improve your bidding strategy</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {biddingTips.map((tip) => (
            <motion.div
              key={tip.id}
              whileHover={{ scale: 1.03 }}
              className={`p-6 rounded-xl shadow-lg ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-700/80 to-gray-600/80"
                  : "bg-gradient-to-br from-gray-100 to-gray-200"
              } flex flex-col items-center text-center border ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              } relative overflow-hidden`}
            >
              <div className="absolute -right-4 -bottom-4 opacity-20">
                {tip.overlayIcon}
              </div>
              <div className="bg-purple-500/20 p-3 rounded-full mb-4">
                {tip.icon}
              </div>
              <h3 className="text-lg font-semibold">{tip.title}</h3>
              <p className={`text-sm ${labelStyle} mt-2`}>{tip.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/bidding-strategies")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-semibold shadow-md"
          >
            Learn More Strategies
          </motion.button>
        </div>
      </motion.div>

      {/* Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-6"
        >
          <div className={`${boxStyle}`}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaWallet className="text-purple-500" />
                Account Balance
              </h3>
              {balanceLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">Loading balance...</p>
                </div>
              ) : balanceError ? (
                <p className="text-3xl font-bold text-white">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
              ) : (
                <>
                 <p className="text-3xl font-bold text-gray-300">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
                  <p className={labelStyle}>Available for bidding</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-4 w-full py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    } text-white font-semibold transition-colors`}
                  >
                    Add Funds
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="space-y-6"
        >
          <div className={`${boxStyle}`}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaBell className="text-yellow-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FaGavel className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">New bid placed</p>
                    <p className={`text-xs ${labelStyle}`}>
                      1 hour ago on "Antique Vase"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaStar className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Auction won</p>
                    <p className={`text-xs ${labelStyle}`}>
                      Yesterday on "Gold Watch"
                    </p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-4 w-full py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } font-semibold transition-colors`}
              >
                View All Activity
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-6"
        >
          <div className={`${boxStyle}`}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaStar className="text-blue-500" />
                Watching Now
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaStar className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Vintage Car</p>
                    <p className={`text-xs ${labelStyle}`}>
                      Ending in 2 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaStar className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Old Painting</p>
                    <p className={`text-xs ${labelStyle}`}>
                      Ending tomorrow
                    </p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-4 w-full py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } font-semibold transition-colors`}
              >
                View All Watched
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyerProfile;