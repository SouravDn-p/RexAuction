import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import CountUp from "react-countup";
import useAuth from "../../../../hooks/useAuth";
import coverPhoto from "../../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../../LoadingSpinner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaGavel, FaStar, FaWallet, FaMoneyCheckAlt, FaEdit } from "react-icons/fa";
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
import {
  useGetAuctionByEmailQuery,
} from "../../../../redux/features/api/auctionApi";

const profileData = {
  totalAuctions: 10,
  totalSold: 8,
};

const demoChartData = [
  { date: "2025-04-23", count: 2 },
  { date: "2025-04-24", count: 3 },
  { date: "2025-04-25", count: 1 },
  { date: "2025-04-26", count: 4 },
  { date: "2025-04-27", count: 2 },
];

const SellerProfile = () => {
  const { user, loading: authLoading, dbUser } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [currentCover, setCurrentCover] = useState(coverPhoto);
  const [selectedCover, setSelectedCover] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const navigate = useNavigate();

  const email = dbUser?.email;
  const {
    data: auctions = [],
    isLoading: auctionsLoading,
    error: auctionsError,
  } = useGetAuctionByEmailQuery(email, {
    skip: !email,
  });

  const displayedAuctions = auctions.slice(0, 5);

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

  useEffect(() => {
    if (user?.email) {
      setPaymentsLoading(true);
      axios
        .get(`http://localhost:5000/payments?sellerEmail=${user.email}`)
        .then((res) => {
          setPayments(res.data.slice(0, 5));
          setPaymentsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching payments:", err);
          setPaymentsError("Failed to load payments. Please try again later.");
          setPaymentsLoading(false);
        });
    }
  }, [user]);

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
  const formatNumber = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  const totalEarnings = payments
    .filter((payment) => payment.PaymentStatus === "success")
    .reduce((sum, payment) => sum + (payment.price || 0), 0);

  const chartData = auctions.length
    ? auctions
        .reduce((acc, auction) => {
          const date = new Date(
            auction.createdAt || Date.now()
          ).toLocaleDateString();
          const existing = acc.find((item) => item.date === date);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({
              date,
              count: 1,
            });
          }
          return acc;
        }, [])
        .slice(-5)
    : demoChartData;

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

  const boxStyle = `rounded-2xl shadow-lg ${
    isDarkMode
      ? "bg-gray-800/80 border-gray-700 hover:bg-gray-700"
      : "bg-white border-gray-200 hover:bg-gray-50"
  } transition-all duration-300`;

  if (authLoading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } p-4 md:p-8 font-sans`}
    >
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
              alt={user?.displayName || "Seller"}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Welcome Back, {user?.displayName?.split(" ")[0] || "Seller"}!
            </h1>
            <p className="text-purple-100 max-w-2xl mx-auto text-sm md:text-base">
              Manage your auctions and earnings with ease.
            </p>
          </div>
        </div>
       
      </motion.div>
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
              <div className="flex  items-center gap-4 flex-wrap justify-center lg:justify-start">
                
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
                <span className="text-sm">4.7 Seller Rating</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
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
          } flex flex-col h-48 justify-between border-l-4 border-purple-500`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 tracking-wide">
                Total Auctions
              </p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={profileData.totalAuctions} duration={2} />
              </h3>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Manage your listings
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
          } flex flex-col h-48 justify-between border-t-4 border-purple-500`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 tracking-wide">
                Items Sold
              </p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={profileData.totalSold} duration={2} />
              </h3>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Successful sales
              </p>
            </div>
            <motion.div
              className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/50"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaStar className="text-2xl text-purple-500" />
            </motion.div>
          </div>
          <div className="h-1 bg-purple-500"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/10 rounded-tr-full"></div>
        </motion.div>
        <motion.div
          whileHover={{ y: -5, rotate: 1 }}
          className={`relative rounded-2xl shadow-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-48 justify-between border-r-4 border-purple-500`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 tracking-wide">
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
                Available earnings
              </p>
            </div>
            <motion.div
              className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/50"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaWallet className="text-2xl text-purple-500" />
            </motion.div>
          </div>
          <div className="h-1 bg-purple-500"></div>
          <div className="absolute top-0 left-0 w-16 h-16 bg-purple-500/10 rounded-br-full"></div>
        </motion.div>
      </motion.div>
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
            {["overview", "auctions", "payments"].map((tab) => (
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
                  : tab === "auctions"
                  ? "Your Auctions"
                  : "Payments"}
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
                <h3 className="text-xl font-semibold mb-4">Auction Trends</h3>
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
                        name="Auctions Created"
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
                                ? "#8B5CF6"
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
                              ? "bg-purple-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "auctions" && (
              <motion.div
                key="auctions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                    <FaGavel className="text-purple-500" />
                    Your Auctions
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/dashboard/manageAuctions")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    View All
                  </motion.button>
                </div>
                {auctionsLoading ? (
                  <p className="text-center text-gray-500">
                    Loading auctions...
                  </p>
                ) : auctionsError ? (
                  <p className="text-center text-red-500">
                    Failed to load auctions.
                  </p>
                ) : auctions.length === 0 ? (
                  <div className="text-center py-8">
                    <FaGavel className="mx-auto text-4xl text-purple-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      No auctions found
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start by creating a new auction
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate("/dashboard/create-auction")}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm"
                    >
                      Create Auction
                    </motion.button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-purple-500 ">
                          <th className="pb-3 text-purple-500 font-medium">Item</th>
                          <th className="pb-3 font-medium">Starting Bid</th>
                          <th className="pb-3 font-medium">End Date</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {displayedAuctions.map((auction) => (
                          <motion.tr
                            key={auction._id}
                            whileHover={{
                              backgroundColor: isDarkMode
                                ? "rgba(139, 92, 246, 0.1)"
                                : "rgba(221, 214, 254, 0.3)",
                            }}
                            className="text-purple-700 "
                          >
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    auction.images?.[0] ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={auction.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium ">
                                    {auction.name || "N/A"}
                                  </p>
                                  <p className="text-xs opacity-70">
                                    {auction.category || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              ৳{auction.startingPrice?.toLocaleString() || "0"}
                            </td>
                            <td className="py-3">
                              {auction.endTime
                                ? new Date(auction.endTime).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  new Date(auction.endTime) > new Date()
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {new Date(auction.endTime) > new Date()
                                  ? "Active"
                                  : "Ended"}
                              </span>
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
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                    <FaMoneyCheckAlt className="text-purple-500" />
                    Payment History
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/dashboard/sharedPayment")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    View All
                  </motion.button>
                </div>
                {paymentsLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : paymentsError ? (
                  <p className="text-center text-red-500">{paymentsError}</p>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <FaMoneyCheckAlt className="mx-auto text-4xl text-purple-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      No payments found
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Start selling to earn payments
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate("/dashboard/createAuction")}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm"
                    >
                      Start Selling
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ y: -5, rotate: -1 }}
                      className={`relative rounded-2xl shadow-lg overflow-hidden ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } flex flex-col h-48 justify-between border-t-4 border-purple-500`}
                    >
                      <div className="p-6 flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600 dark:text-purple-400 tracking-wide">
                            Total Earnings
                          </p>
                          <h3 className="text-3xl font-bold mt-2">
                            ৳
                            <CountUp
                              end={totalEarnings}
                              decimals={2}
                              duration={2}
                            />
                          </h3>
                          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            From completed payments
                          </p>
                        </div>
                        <motion.div
                          className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/50"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <FaMoneyCheckAlt className="text-2xl text-purple-500" />
                        </motion.div>
                      </div>
                      <div className="h-1 bg-purple-500"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/10 rounded-tr-full"></div>
                    </motion.div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-purple-600 ">
                            <th className="pb-3 font-medium">Item</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Method</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {payments.map((payment) => (
                            <motion.tr
                              key={payment._id}
                              whileHover={{
                                backgroundColor: isDarkMode
                                  ? "rgba(139, 92, 246, 0.1) text-gray-600"
                                  : "rgba(221, 214, 254, 0.3)",
                              }}
                              
                            >
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      payment.itemInfo?.images ||
                                      "https://via.placeholder.com/40"
                                    }
                                    alt={payment.itemInfo?.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {payment.itemInfo?.name || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3">
                                ৳
                                {typeof payment.price === "number"
                                  ? payment.price.toLocaleString()
                                  : "0"}
                              </td>
                              <td className="py-3">
                                {payment.paymentDate
                                  ? new Date(
                                      payment.paymentDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="py-3">
                                {payment.PaymentMethod || "N/A"}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    payment.PaymentStatus === "success"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  }`}
                                >
                                  {payment.PaymentStatus || "Pending"}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`${boxStyle}`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 tracking-tight">
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
                  Available earnings
                </p>
              </>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`${boxStyle}`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 tracking-tight">
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
          transition={{ duration: 0.5, delay: 0.7 }}
          className={`${boxStyle}`}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 tracking-tight">
              Pending Auctions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No pending auctions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerProfile;