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

// Demo images for auction status
import antique from "/DemoAuctionImg/antique.jpg";
import antique2 from "/DemoAuctionImg/antique2.jpg";
import antique3 from "/DemoAuctionImg/antique3.jpg";
import antique4 from "/DemoAuctionImg/antique4.jpeg";

const profileData = {
  totalBids: 25,
  auctionsWon: 5,
};

const biddingTips = [
  {
    id: 1,
    title: "Set a Budget",
    description:
      "Determine your maximum bid before the auction starts to avoid overspending.",
    icon: <FaWallet />,
  },
  {
    id: 2,
    title: "Research Items",
    description:
      "Study the auction items to understand their value and condition.",
    icon: <FaStar />,
  },
  {
    id: 3,
    title: "Bid Strategically",
    description:
      "Place bids late in the auction to increase your chances of winning.",
    icon: <FaGavel />,
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
      setAuctionStatusLoading(true);
      axios
        .get("https://rex-auction-server-side-jzyx.onrender.com/auctions")
        .then((res) => {
          console.log("Auction status response:", res.data);

          // Handle non-array response
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
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
        }`}
      >
        {status ? "Won" : "Lost"}
      </span>
    );
  };

  const boxStyle = `border rounded-xl shadow-lg ${
    isDarkMode
      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
      : "bg-white border-gray-200 hover:bg-gray-50"
  } transition-all duration-300`;

  const titleStyle = `text-2xl font-bold ${
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
  const filteredAuctionStatus = auctionStatus.filter((bid) => {
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
            existing.count += 1; // Count bids
            existing.amount += typeof bid.amount === "number" ? bid.amount : 0; // Sum bid amounts (optional)
          } else {
            acc.push({
              date,
              count: 1,
              amount: typeof bid.amount === "number" ? bid.amount : 0,
            });
          }
          return acc;
        }, [])
        .slice(-5) // Show last 5 days for brevity
    : [
        { date: "2025-04-23", count: 2, amount: 100 },
        { date: "2025-04-24", count: 3, amount: 150 },
        { date: "2025-04-25", count: 1, amount: 200 },
        { date: "2025-04-26", count: 4, amount: 180 },
        { date: "2025-04-27", count: 2, amount: 250 },
      ];

  if (authLoading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-b from-purple-50 to-indigo-50 text-gray-800"
      } transition-all duration-300 p-4 md:p-8`}
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
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute right-4 top-4 bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold flex items-center shadow-md"
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
        </button>
      </motion.div>

      {/* Cover Image Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center"
        >
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-8 rounded-2xl w-full max-w-5xl shadow-2xl`}
          >
            <h2
              className={`text-2xl font-bold text-center mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Choose Your Cover Image
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coverOptions.map((cover) => (
                <motion.div
                  key={cover.id}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer border-4 rounded-lg transition-all ${
                    selectedCover === cover.image
                      ? "border-purple-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedCover(cover.image)}
                >
                  <img
                    src={cover.image}
                    alt={`Cover ${cover.id}`}
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = coverPhoto;
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-end mt-8 space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-6 py-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } font-semibold`}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={saveCoverImage}
                className={`px-6 py-2 rounded-full ${
                  isSaving
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white font-semibold`}
                disabled={isSaving || !selectedCover}
              >
                {isSaving ? "Saving..." : "Save Cover"}
              </button>
            </div>
          </div>
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
              whileHover={{ scale: 1.1 }}
              className={`w-32 h-32 rounded-full border-4 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-white bg-gray-200"
              } overflow-hidden shadow-lg`}
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
            </motion.div>
          </div>
          <div className="lg:text-left text-center w-full">
            <h1
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {user?.displayName || "No name"}
            </h1>
            <p
              className={`text-gray-400 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } mt-2`}
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
              <div className="flex items-center gap-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 text-sm border rounded-full font-semibold ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  } shadow-md`}
                >
                  Edit Profile
                </motion.button>
                {dbUser?.role && (
                  <span
                    className={`text-xs font-semibold px-4 py-1 rounded-full capitalize ${
                      dbUser.role === "buyer" ? "bg-green-600 text-white" : ""
                    }`}
                  >
                    {dbUser.role}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="text-sm">4.5 Buyer Rating</span>
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
        className={`${boxStyle} mb-8`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={titleStyle}>Bidding Dashboard</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-900 to-blue-700"
                : "bg-gradient-to-r from-blue-100 to-blue-200"
            } flex items-center gap-4`}
          >
            <FaGavel className="text-3xl text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Bids</h3>
              <p className="text-2xl font-bold">
                <CountUp end={profileData.totalBids} duration={2} />
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode
                ? "bg-gradient-to-r from-green-900 to-green-700"
                : "bg-gradient-to-r from-green-100 to-green-200"
            } flex items-center gap-4`}
          >
            <FaStar className="text-3xl text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Auctions Won</h3>
              <p className="text-2xl font-bold">
                <CountUp end={profileData.auctionsWon} duration={2} />
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-900 to-purple-700"
                : "bg-gradient-to-r from-purple-100 to-purple-200"
            } flex items-center gap-4`}
          >
            <FaWallet className="text-3xl text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">Account Balance</h3>
              {balanceLoading ? (
                <p className="text-gray-500 text-sm">Loading balance...</p>
              ) : balanceError ? (
                <p className="text-red-500 text-sm">{balanceError}</p>
              ) : (
                <p className="text-2xl font-bold">
                  $<CountUp end={accountBalance} decimals={2} duration={2} />
                </p>
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
          <h2 className={titleStyle}>Your Activity</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {["overview", "bidding", "payments", "status"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  activeTab === tab
                    ? isDarkMode
                      ? "bg-purple-600 text-white"
                      : "bg-purple-600 text-white"
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
                                ? "#F59E0B" // Yellow
                                : index % 3 === 1
                                ? "#10B981" // Green
                                : "#EF4444" // Red
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Additional stats summary */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {chartData.slice(0, 3).map((entry, index) => (
                      <div
                        key={entry.date}
                        className={`p-3 rounded-lg text-center ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <p className="text-sm font-medium">{entry.date}</p>
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
                      </div>
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
                      className={`p-2 rounded-full ${
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
                      className={`p-2 rounded-full ${
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
                  <p className="text-center text-gray-500">No bids found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          } border-b ${
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <th className="text-left py-3 px-4">Auction</th>
                          <th className="text-left py-3 px-4">Your Bid</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedBiddingHistory.map((bid) => (
                          <motion.tr
                            key={bid._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`border-t ${
                              isDarkMode ? "border-gray-700" : "border-gray-200"
                            } hover:${
                              isDarkMode ? "bg-gray-700" : "bg-gray-50"
                            } transition-colors`}
                          >
                            <td className="py-3 px-4">
                              {bid.auctionName || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              $
                              {typeof bid.amount === "number"
                                ? bid.amount.toFixed(2)
                                : "0.00"}
                            </td>
                            <td className="py-3 px-4">
                              {renderStatusBadge(bid.status)}
                            </td>
                            <td className="py-3 px-4">
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
                  <p className="text-center text-gray-500">
                    Loading payments...
                  </p>
                ) : paymentsError ? (
                  <p className="text-center text-red-500">{paymentsError}</p>
                ) : payments.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No payments found.
                  </p>
                ) : (
                  <>
                    <SharedPayment />
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } border-b ${
                              isDarkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <th className="text-left py-3 px-4">Auction</th>
                            <th className="text-left py-3 px-4">Amount</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <motion.tr
                              key={payment._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className={`border-t ${
                                isDarkMode
                                  ? "border-gray-700"
                                  : "border-gray-200"
                              } hover:${
                                isDarkMode ? "bg-gray-700" : "bg-gray-50"
                              } transition-colors`}
                            >
                              <td className="py-3 px-4">
                                {payment.auctionName || "N/A"}
                              </td>
                              <td className="py-3 px-4">
                                $
                                {typeof payment.amount === "number"
                                  ? payment.amount.toFixed(2)
                                  : "0.00"}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-md ${
                                    payment.status === "completed"
                                      ? "bg-green-500 text-white"
                                      : "bg-yellow-500 text-white"
                                  }`}
                                >
                                  {payment.status || "Pending"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {payment.createdAt
                                  ? new Date(
                                      payment.createdAt
                                    ).toLocaleDateString()
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
                <h3 className="text-xl font-semibold mb-4">
                  Recent Auction Status
                </h3>
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
                          ? "bg-gray-600 text-white hover:bg-gray-500"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      }`}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
                {auctionStatusLoading ? (
                  <p className="text-center text-gray-500">
                    Loading auction status...
                  </p>
                ) : auctionStatusError ? (
                  <p className="text-center text-red-500">
                    {auctionStatusError}
                  </p>
                ) : filteredAuctionStatus.length === 0 ? (
                  <>
                    <p className="text-center text-gray-500 mb-4">
                      No auction status found.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            } flex items-center gap-4`}
                          >
                            <img
                              src={status.image}
                              alt={status.product}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => (e.target.src = coverPhoto)}
                            />
                            <div>
                              <h4 className="font-semibold">
                                {status.product}
                              </h4>
                              <p className="text-sm">
                                Position: #{status.position} /{" "}
                                {status.totalBidders}
                              </p>
                              <p className="text-sm">
                                {renderStatusBadge(status.isWinning)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAuctionStatus.map((status) => (
                        <motion.div
                          key={status.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg shadow-md ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          } flex items-center gap-4`}
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
                              Position: #{status.position} /{" "}
                              {status.totalBidders}
                            </p>
                            <p className="text-sm">
                              {renderStatusBadge(status.isWinning)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate("/dashboard/auction-status")}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold flex items-center justify-center mx-auto"
                      >
                        View All Status <FaArrowRight className="ml-2" />
                      </motion.button>
                    </div>
                  </>
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
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {biddingTips.map((tip) => (
            <motion.div
              key={tip.id}
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-xl shadow-md ${
                isDarkMode
                  ? "bg-gradient-to-r from-gray-700 to-gray-600"
                  : "bg-gradient-to-r from-gray-100 to-gray-200"
              } flex flex-col items-center text-center`}
            >
              <div className="text-3xl text-purple-500 mb-4">{tip.icon}</div>
              <h3 className="text-lg font-semibold">{tip.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{tip.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/bidding-strategies")}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-md"
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
          transition={{ duration: 0.5, delay: 0.7 }}
          className="space-y-6"
        >
          <div className={`${boxStyle}`}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Balance</h3>
              {balanceLoading ? (
                <p className="text-gray-500">Loading balance...</p>
              ) : balanceError ? (
                <p className="text-red-500">{balanceError}</p>
              ) : (
                <>
                  <p className="text-3xl font-bold">
                    $<CountUp end={accountBalance} decimals={2} duration={2} />
                  </p>
                  <p className={labelStyle}>Available for bidding</p>
                </>
              )}
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
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <p className={labelStyle}>No recent activity available.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="space-y-6"
        >
          <div className={`${boxStyle}`}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Watching Now</h3>
              <p className={labelStyle}>No items currently watched.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyerProfile;
