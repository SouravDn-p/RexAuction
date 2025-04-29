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
  FaEdit,
  FaShoppingBag,
  FaMoneyCheckAlt,
} from "react-icons/fa";
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

const formatNumber = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};
const profileData = {
  totalBids: 25,
  auctionsWon: 5,
};

const biddingTips = [
  {
    id: 1,
    title: "Set a Budget",
    description: "Determine your maximum bid to avoid overspending.",
    icon: <FaWallet />,
  },
  {
    id: 2,
    title: "Research Items",
    description: "Understand the value and condition of auction items.",
    icon: <FaStar />,
  },
  {
    id: 3,
    title: "Bid Strategically",
    description: "Place bids late to increase your chances of winning.",
    icon: <FaGavel />,
  },
];

// Demo data for auction status fallback
const demoAuctionData = [
 
];

const BuyerProfile = () => {
  const { user, loading: authLoading, dbUser } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [currentCover, setCurrentCover] = useState(coverPhoto);
  const [selectedCover, setSelectedCover] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [payments, setPayments] = useState([]);
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [auctionStatus, setAuctionStatus] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  const [biddingFilter, setBiddingFilter] = useState("all");
  const [biddingSort, setBiddingSort] = useState("date-desc");
  const [auctionStatusLoading, setAuctionStatusLoading] = useState(false);
  const [auctionStatusError, setAuctionStatusError] = useState(null);
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
        .get(`http://localhost:5000/users?email=${user.email}`)
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
        .get(`http://localhost:5000/payments?buyerEmail=${user.email}`)
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
        .get(`http://localhost:5000/bids?buyerEmail=${user.email}`)
        .then((res) => setBiddingHistory(res.data.slice(0, 5)))
        .catch((err) => console.error("Error fetching bidding history:", err));
    }
  }, [user]);

  // Fetch auction status for buyer
  useEffect(() => {
    if (user?.email) {
      setAuctionStatusLoading(true);
      axios
        .get("http://localhost:5000/auctions")
        .then((res) => {
          const auctions = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.auctions)
            ? res.data.auctions
            : [];

          if (!auctions.length) {
            setAuctionStatus(demoAuctionData.slice(0, 4));
            setAuctionStatusLoading(false);
            return;
          }

          const userBids = auctions
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

          setAuctionStatus(userBids.slice(0, 4));
          setAuctionStatusLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching auction status:", err);
          setAuctionStatusError("Failed to load auction status.");
          setAuctionStatusLoading(false);
          setAuctionStatus(demoAuctionData.slice(0, 4));
        });
    }
  }, [user]);

  // Fetch cover options and user cover
  useEffect(() => {
    const fetchCoverOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cover-options");
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
            `http://localhost:5000/cover/${user.uid}`
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
      await axios.patch("http://localhost:5000/cover", {
        userId: user.uid,
        image: selectedCover,
      });
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
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          status
            ? "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            : "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        }`}
      >
        {status ? "Won" : "Lost"}
      </span>
    );
  };

  const boxStyle = `rounded-2xl shadow-lg ${
    isDarkMode
      ? "bg-gray-800/80 border-gray-700 hover:bg-gray-700"
      : "bg-white border-gray-200 hover:bg-gray-50"
  } transition-all duration-300`;

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
  const filteredAuctionStatus = auctionStatus.filter((bid) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Won") return bid.isWinning;
    if (statusFilter === "Lost") return !bid.isWinning;
    return true;
  });

  if (authLoading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } p-4 md:p-8 font-sans`}
    >
      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative h-64 md:h-80 bg-cover bg-center rounded-2xl overflow-hidden shadow-xl"
        style={{
          backgroundImage: `linear-gradient(rgba(101, 33, 168, 0.7), rgba(11, 15, 14, 0.7)), url(${currentCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 flex flex-col items-center gap-4">
            <motion.img
              src={user?.photoURL || "https://i.imgur.com/8Km9tLL.png"}
              alt={user?.displayName || "Buyer"}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Welcome Back, {user?.displayName?.split(" ")[0] || "Buyer"}!
            </h1>
            <p className="text-purple-100 max-w-2xl mx-auto text-sm md:text-base">
              Track your bids and manage your purchases with ease.
            </p>
          </div>
        </div>
      
      </motion.div>

      {/* Cover Image Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-2xl w-full max-w-4xl shadow-2xl`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-semibold tracking-tight ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Choose Your Cover Image
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </motion.button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {coverOptions.map((cover) => (
                <motion.div
                  key={cover.id}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedCover === cover.image
                      ? "ring-4 ring-purple-500"
                      : "ring-1 ring-gray-300 dark:ring-gray-600"
                  }`}
                  onClick={() => setSelectedCover(cover.image)}
                >
                  <img
                    src={cover.image}
                    alt={`Cover ${cover.id}`}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = coverPhoto;
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={saveCoverImage}
                disabled={!selectedCover || isSaving}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                  </>
                ) : (
                  "Save Changes"
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
        className="px-6 -mt-20 mb-8 max-w-7xl mx-auto"
      >
        <div
          className={`flex flex-col md:flex-row items-center gap-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <div className="lg:text-left text-center w-full">
            <h1
              className={`text-3xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.displayName || "No name"}
            </h1>
            <p
              className={`text-gray-400 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mt-2 text-sm md:text-base`}
            >
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
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
             
                {dbUser?.role && (
                  <span
                    className={`text-xs font-semibold px-4 py-1 rounded-full capitalize bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300`}
                  >
                    {dbUser.role}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <FaStar className="text-yellow-400" />
                <span className="text-sm">4.5 Buyer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bidding Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8 max-w-7xl mx-auto"
      >
        <motion.div
          whileHover={{ y: -5, rotate: 1 }}
          className={`relative rounded-2xl shadow-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-48 justify-between border-l-4 border-purple-500 bg-gradient-to-br ${
            isDarkMode ? "from-gray-800 to-gray-700" : "from-purple-50 to-white"
          }`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 tracking-wide">
                Total Bids
              </p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={profileData.totalBids} duration={2} />
              </h3>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Your bidding activity
              </p>
            </div>
            <motion.div
              className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/50"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaGavel className="text-2xl text-purple-500" />
            </motion.div>
          </div>
          <div className="h-1 bg-purple-500"></div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full"></div>
        </motion.div>
        <motion.div
          whileHover={{ y: -5, rotate: -1 }}
          className={`relative rounded-2xl shadow-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-48 justify-between border-t-4 border-green-500 bg-gradient-to-br ${
            isDarkMode ? "from-gray-800 to-gray-700" : "from-green-50 to-white"
          }`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 tracking-wide">
                Auctions Won
              </p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={profileData.auctionsWon} duration={2} />
              </h3>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Successful wins
              </p>
            </div>
            <motion.div
              className="p-3 rounded-full bg-green-50 dark:bg-green-900/50"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaStar className="text-2xl text-green-500" />
            </motion.div>
          </div>
          <div className="h-1 bg-green-500"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/10 rounded-tr-full"></div>
        </motion.div>
        <motion.div
          whileHover={{ y: -5, rotate: 1 }}
          className={`relative rounded-2xl shadow-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-48 justify-between border-r-4 border-blue-500 bg-gradient-to-br ${
            isDarkMode ? "from-gray-800 to-gray-700" : "from-blue-50 to-white"
          }`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wide">
                Account Balance
              </p>
              {balanceLoading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : balanceError ? (
                <p className="text-red-400 text-sm">Error loading balance</p>
              ) : (
                <p className="text-3xl font-bold text-white">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
              )}
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Available for bidding
              </p>
            </div>
            <motion.div
              className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/50"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaWallet className="text-2xl text-blue-500" />
            </motion.div>
          </div>
          <div className="h-1 bg-blue-500"></div>
          <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500/10 rounded-br-full"></div>
        </motion.div>
      </motion.div>

      {/* Buyer Tools Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`${boxStyle} mb-8 max-w-7xl mx-auto`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 tracking-tight">
            <FaGavel className="text-purple-500" />
            Your Activity
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {["overview", "bidding", "payments", "status"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
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
                <h3 className="text-xl font-semibold mb-4">Bidding Trends</h3>
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
                        name="Bids Placed"
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
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {chartData.slice(0, 3).map((entry, index) => (
                      <motion.div
                        key={entry.date}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg text-center ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        } shadow-sm`}
                      >
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.date}</p>
                        <p className="text-2xl font-bold mt-1">{entry.count}</p>
                        <div
                          className={`h-1 mt-2 ${
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
                    <FaFilter className="text-gray-500" />
                    <select
                      value={biddingFilter}
                      onChange={(e) => setBiddingFilter(e.target.value)}
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-200"
                      } border font-semibold`}
                    >
                      <option value="all">All Bids</option>
                      <option value="Won">Won</option>
                      <option value="Active">Active</option>
                      <option value="Outbid">Outbid</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaSort className="text-gray-500" />
                    <select
                      value={biddingSort}
                      onChange={(e) => setBiddingSort(e.target.value)}
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-200"
                      } border font-semibold`}
                    >
                      <option value="date-desc">Date (Newest)</option>
                      <option value="date-asc">Date (Oldest)</option>
                      <option value="amount-desc">Amount (High to Low)</option>
                      <option value="amount-asc">Amount (Low to High)</option>
                    </select>
                  </div>
                </div>
                {sortedBiddingHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FaGavel className="mx-auto text-4xl text-purple-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      No bids found
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start bidding to see your history here!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate("/auctions")}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm"
                    >
                      Start Bidding
                    </motion.button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600 dark:text-gray-300">
                          <th className="pb-3 font-medium">Auction</th>
                          <th className="pb-3 font-medium">Your Bid</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedBiddingHistory.map((bid) => (
                          <motion.tr
                            key={bid._id}
                            whileHover={{
                              backgroundColor: isDarkMode
                                ? "rgba(139, 92, 246, 0.1)"
                                : "rgba(221, 214, 254, 0.3)",
                            }}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            <td className="py-3">{bid.auctionName || "N/A"}</td>
                            <td className="py-3 text-green-500">
                              ${typeof bid.amount === "number" ? bid.amount.toFixed(2) : "0.00"}
                            </td>
                            <td className="py-3">{renderStatusBadge(bid.status)}</td>
                            <td className="py-3">
                              {bid.createdAt
                                ? new Date(bid.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
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
                {paymentsLoading ? (
                  <p className="text-center text-gray-500">Loading payments...</p>
                ) : paymentsError ? (
                  <p className="text-center text-red-500">{paymentsError}</p>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <FaShoppingBag className="mx-auto text-4xl text-purple-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      No payments found
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start bidding to win items and make payments!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate("/auctions")}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm"
                    >
                      Start Bidding
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <SharedPayment />
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-600 dark:text-gray-300">
                            <th className="pb-3 font-medium">Auction</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {payments.map((payment) => (
                            <motion.tr
                              key={payment._id}
                              whileHover={{
                                backgroundColor: isDarkMode
                                  ? "rgba(139, 92, 246, 0.1)"
                                  : "rgba(221, 214, 254, 0.3)",
                              }}
                              className="text-gray-700 dark:text-gray-300"
                            >
                              <td className="py-3">{payment.auctionName || "N/A"}</td>
                              <td className="py-3 text-green-500">
                                ${typeof payment.amount === "number" ? payment.amount.toFixed(2) : "0.00"}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    payment.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  }`}
                                >
                                  {payment.status || "Pending"}
                                </span>
                              </td>
                              <td className="py-3">
                                {payment.createdAt
                                  ? new Date(payment.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
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
                <h3 className="text-xl font-semibold mb-4">Recent Auction Status</h3>
                <div className="flex justify-start gap-3 mb-6">
                  {["All", "Won", "Lost"].map((status) => (
                    <motion.button
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusFilter === status
                          ? "bg-purple-600 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
                {auctionStatusLoading ? (
                  <p className="text-center text-gray-500">Loading auction status...</p>
                ) : auctionStatusError ? (
                  <p className="text-center text-red-500">{auctionStatusError}</p>
                ) : filteredAuctionStatus.length === 0 ? (
                  <>
                    <p className="text-center text-gray-500 mb-4">
                      No auction status found.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {demoAuctionData
                        .filter((bid) => {
                          if (statusFilter === "All") return true;
                          if (statusFilter === "Won") return bid.isWinning;
                          if (statusFilter === "Lost") return !bid.isWinning;
                          return true;
                        })
                        .slice(0, 4)
                        .map((status) => (
                          <motion.div
                            key={status.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-lg shadow-md ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-100"
                            } flex flex-col gap-2`}
                          >
                            <img
                              src={status.image}
                              alt={status.product}
                              className="w-full h-32 object-cover rounded"
                              onError={(e) => (e.target.src = coverPhoto)}
                            />
                            <div>
                              <h4 className="font-semibold">{status.product}</h4>
                              <p className="text-sm">
                                Position: #{status.position} / {status.totalBidders}
                              </p>
                              <p className="text-sm">{renderStatusBadge(status.isWinning)}</p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredAuctionStatus.map((status) => (
                        <motion.div
                          key={status.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg shadow-md ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          } flex flex-col gap-2`}
                        >
                          <img
                            src={status.image}
                            alt={status.product}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => (e.target.src = coverPhoto)}
                          />
                          <div>
                            <h4 className="font-semibold">{status.product}</h4>
                            <p className="text-sm">
                              Position: #{status.position} / {status.totalBidders}
                            </p>
                            <p className="text-sm">{renderStatusBadge(status.isWinning)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate("/dashboard/auction-status")}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center mx-auto gap-2"
                      >
                        View All Status <FaArrowRight />
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bidding Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`${boxStyle} mb-8 max-w-7xl mx-auto`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 tracking-tight">
            <FaStar className="text-purple-500" />
            Bidding Tips
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {biddingTips.map((tip) => (
            <motion.div
              key={tip.id}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl shadow-lg flex flex-col items-center text-center bg-gradient-to-br ${
                isDarkMode
                  ? "from-gray-700 to-gray-600"
                  : "from-purple-50 to-indigo-50"
              } border-t-4 ${
                tip.id === 1
                  ? "border-purple-500"
                  : tip.id === 2
                  ? "border-green-500"
                  : "border-blue-500"
              }`}
            >
              <div className={`text-3xl mb-4 ${
                tip.id === 1
                  ? "text-purple-500"
                  : tip.id === 2
                  ? "text-green-500"
                  : "text-blue-500"
              }`}>{tip.icon}</div>
              <h3 className="text-lg font-semibold">{tip.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{tip.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-6 text-center">
         
        </div>
      </motion.div>

      {/* Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className={`${boxStyle}`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 tracking-tight flex items-center gap-2">
              <FaWallet className="text-purple-500" />
              Account Balance
            </h3>
            {balanceLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : balanceError ? (
              <p className="text-red-400">Error loading balance</p>
            ) : (
              <>
                 <p className="text-3xl font-bold text-white">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Available for bidding
                </p>
              </>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className={`${boxStyle}`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 tracking-tight flex items-center gap-2">
              <FaMoneyCheckAlt className="text-purple-500" />
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent activity available.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className={`${boxStyle}`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 tracking-tight flex items-center gap-2">
              <FaShoppingBag className="text-purple-500" />
              Watching Now
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No items currently watched.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyerProfile;