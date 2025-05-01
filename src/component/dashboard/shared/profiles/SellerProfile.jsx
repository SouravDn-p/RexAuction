import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import CountUp from "react-countup";
import useAuth from "../../../../hooks/useAuth";
import coverPhoto from "../../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../../LoadingSpinner";
import axios from "axios";
import ManageCard from "../ManageCard";
import { motion, AnimatePresence } from "framer-motion";
import { FaGavel, FaStar, FaWallet, FaMoneyCheckAlt, FaRocket, FaChartLine } from "react-icons/fa";
// import { IoIosHammer  } from "react-icons/gi";
import { IoIosHammer, IoMdNotifications } from "react-icons/io";
import { toast, Toaster } from "react-hot-toast";
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
  AreaChart,
  Area,
} from "recharts";

// Mock profile data for metrics
const profileData = {
  totalAuctions: 10,
  totalSold: 8,
};

// Mock auction data for chart fallback
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
  const [auctions, setAuctions] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionsError, setAuctionsError] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
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

  // Fetch payments for seller
  useEffect(() => {
    if (user?.email) {
      setPaymentsLoading(true);
      axios
        .get(
          `https://rex-auction-server-side-jzyx.onrender.com/payments?sellerEmail=${user.email}`
        )
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

  // Fetch auctions for seller
  useEffect(() => {
    if (user?.email) {
      setAuctionsLoading(true);
      axios
        .get(
          `https://rex-auction-server-side-jzyx.onrender.com/auctions?sellerEmail=${user.email}`
        )
        .then((res) => {
          setAuctions(res.data.slice(0, 5));
          setAuctionsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching auctions:", err);
          setAuctionsError("Failed to load auctions.");
          setAuctionsLoading(false);
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

  // Calculate total earnings from completed payments
  const totalEarnings = payments
    .filter((payment) => payment.PaymentStatus === "success")
    .reduce((sum, payment) => sum + (payment.price || 0), 0);

  // Prepare chart data for auction activity
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
      await axios.patch(
        "https://rex-auction-server-side-jzyx.onrender.com/cover",
        {
          userId: user.uid,
          image: selectedCover,
        }
      );
      setCurrentCover(selectedCover);
      setIsModalOpen(false);
      setShowSuccess(true);
      toast.success("Cover image updated successfully!", {
        position: "top-center",
        style: {
          background: isDarkMode ? "#1F2937" : "#FFFFFF",
          color: isDarkMode ? "#FFFFFF" : "#1F2937",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "14px",
        },
        iconTheme: {
          primary: "#8B5CF6",
          secondary: "#FFFFFF",
        },
      });
    } catch (error) {
      console.error("Error saving cover image:", error);
      toast.error("Failed to save cover image. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSaving(false);
    }
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

  if (authLoading) return <LoadingSpinner />;
  const formatNumber = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-b from-purple-50 to-indigo-50 text-gray-800"
      } transition-all duration-300 p-4 md:p-8`}
    >
      <Toaster />
      
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
                <h1
                  className={`text-3xl md:text-4xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.displayName || "No name"}
                </h1>
                <p
                  className={`mt-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
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
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-500" />
                  <span className="text-sm font-semibold">4.7</span>
                </div>
                {dbUser?.role && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      dbUser.role === "seller"
                        ? "bg-purple-100 text-purple-800"
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
                  onClick={() => navigate("/dashboard/createAuction")}
                  className={`px-6 py-2 text-sm rounded-full font-semibold ${
                    isDarkMode
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  } shadow-md flex items-center gap-2`}
                >
                  <IoIosHammer className="text-lg" />
                  Create Auction
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seller Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`${boxStyle} mb-8 overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={titleStyle}>Seller Dashboard</h2>
          <p className={`mt-1 ${labelStyle}`}>
            Overview of your auction performance and earnings
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
              <h3 className="text-lg font-semibold">Total Auctions</h3>
              <p className="text-2xl font-bold">
                <CountUp end={profileData.totalAuctions} duration={2} />
              </p>
              <p className={`text-xs mt-1 ${
                isDarkMode ? "text-blue-300" : "text-blue-600"
              }`}>
                +2 from last month
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
              <h3 className="text-lg font-semibold">Items Sold</h3>
              <p className="text-2xl font-bold">
                <CountUp end={profileData.totalSold} duration={2} />
              </p>
              <p className={`text-xs mt-1 ${
                isDarkMode ? "text-green-300" : "text-green-600"
              }`}>
                80% success rate
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
                  <p className="text-sm text-purple-100 font-medium">
                  Current Balance
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
                  <p className={`text-xs mt-1 ${
                    isDarkMode ? "text-purple-300" : "text-purple-600"
                  }`}>
                    Available for withdrawal
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Seller Tools */}
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
                Track your auctions, payments, and performance
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["overview", "auctions", "payments"].map((tab) => (
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
                    : tab === "auctions"
                    ? "Your Auctions"
                    : "Payments"}
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
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    className={`${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } p-6 rounded-xl shadow-md`}
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaChartLine className="text-purple-500" />
                      Auction Trends
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorArea"
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
                                stopColor="#8B5CF6"
                                stopOpacity={0}
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
                              backgroundColor: isDarkMode
                                ? "#1F2937"
                                : "#FFFFFF",
                              border: `1px solid ${
                                isDarkMode ? "#374151" : "#E5E7EB"
                              }`,
                              borderRadius: "0.5rem",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{
                              color: isDarkMode ? "#E5E7EB" : "#111827",
                            }}
                            labelStyle={{
                              fontWeight: "bold",
                              color: isDarkMode ? "#E5E7EB" : "#111827",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#8B5CF6"
                            fillOpacity={1}
                            fill="url(#colorArea)"
                            animationDuration={2000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div
                    className={`${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } p-6 rounded-xl shadow-md`}
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaMoneyCheckAlt className="text-green-500" />
                      Earnings Overview
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                                stopColor="#10B981"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10B981"
                                stopOpacity={0.2}
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
                              backgroundColor: isDarkMode
                                ? "#1F2937"
                                : "#FFFFFF",
                              border: `1px solid ${
                                isDarkMode ? "#374151" : "#E5E7EB"
                              }`,
                              borderRadius: "0.5rem",
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            itemStyle={{
                              color: isDarkMode ? "#E5E7EB" : "#111827",
                            }}
                            labelStyle={{
                              fontWeight: "bold",
                              color: isDarkMode ? "#E5E7EB" : "#111827",
                            }}
                          />
                          <Bar
                            dataKey="count"
                            name="Estimated Earnings"
                            fill="url(#colorBar)"
                            radius={[4, 4, 0, 0]}
                            animationDuration={2000}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {chartData.slice(0, 3).map((entry, index) => (
                    <motion.div
                      key={entry.date}
                      whileHover={{ y: -5 }}
                      className={`p-4 rounded-xl shadow-md ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      } border ${
                        isDarkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{entry.date}</p>
                          <p className="text-2xl font-bold mt-1">
                            {entry.count}
                          </p>
                          <p className="text-xs mt-1">
                            {index % 3 === 0
                              ? "Auctions created"
                              : index % 3 === 1
                              ? "Successful bids"
                              : "Total views"}
                          </p>
                        </div>
                        <div
                          className={`p-3 rounded-full ${
                            index % 3 === 0
                              ? "bg-purple-100 text-purple-600"
                              : index % 3 === 1
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {index % 3 === 0 ? (
                            <IoIosHammer  className="text-xl" />
                          ) : index % 3 === 1 ? (
                            <FaStar className="text-xl" />
                          ) : (
                            <IoMdNotifications className="text-xl" />
                          )}
                        </div>
                      </div>
                      <div
                        className={`h-1 mt-4 rounded-full ${
                          index % 3 === 0
                            ? "bg-gradient-to-r from-purple-400 to-purple-600"
                            : index % 3 === 1
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-blue-400 to-blue-600"
                        }`}
                      ></div>
                    </motion.div>
                  ))}
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
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <IoIosHammer  className="text-purple-500" />
                    Your Auctions
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard/manageAuctions")}
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
                {auctionsLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : auctionsError ? (
                  <div className="text-center py-12">
                    <p className="text-red-500">{auctionsError}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold"
                    >
                      Try Again
                    </motion.button>
                  </div>
                ) : auctions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <IoIosHammer  className="text-4xl text-purple-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">
                      No Auctions Found
                    </h4>
                    <p className="text-gray-500 mb-6">
                      You haven't created any auctions yet
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/dashboard/create-auction")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 mx-auto"
                    >
                      <IoIosHammer  className="text-lg" />
                      Create Your First Auction
                    </motion.button>
                  </div>
                ) : (
                  <ManageCard />
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
                      You haven't received any payments yet
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/dashboard/createAuction")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 mx-auto"
                    >
                      <IoIosHammer  className="text-lg" />
                      Start Selling Items
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Total Earnings Summary */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl shadow-lg ${
                        isDarkMode
                          ? "bg-gradient-to-r from-green-900/80 to-green-800/80"
                          : "bg-gradient-to-r from-green-100 to-green-200"
                      } flex items-center gap-4 border ${
                        isDarkMode ? "border-green-700" : "border-green-200"
                      }`}
                    >
                      <div className="bg-green-500/20 p-3 rounded-full">
                        <FaMoneyCheckAlt className="text-2xl text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Total Earnings</h3>
                       
                        <p className={labelStyle}>From completed payments</p>
                      </div>
                    </motion.div>

                    {/* Payment Cards */}
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
                              {payment.itemInfo?.name || "N/A"}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-md capitalize ${
                                payment.PaymentStatus === "success"
                                  ? "bg-green-500 text-white"
                                  : payment.PaymentStatus === "pending"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {payment.PaymentStatus || "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <FaWallet className="text-purple-500" />
                            <p className="text-sm">
                              Amount: ৳
                              {typeof payment.price === "number"
                                ? payment.price.toLocaleString()
                                : "0"}
                            </p>
                          </div>
                          <p className={labelStyle}>
                            Date:{" "}
                            {payment.paymentDate
                              ? new Date(
                                  payment.paymentDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <p className={labelStyle}>
                            Method: {payment.PaymentMethod || "N/A"}
                          </p>
                          {payment.PaymentStatus === "success" && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <button
                                className={`text-xs px-3 py-1 rounded-full ${
                                  isDarkMode
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "bg-purple-100 hover:bg-purple-200 text-purple-800"
                                } transition-colors`}
                              >
                                Withdraw Funds
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`${boxStyle} mb-8`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={titleStyle}>Quick Actions</h2>
          <p className={labelStyle}>Manage your seller account quickly</p>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/createAuction")}
            className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-purple-50 hover:bg-purple-100"
            } transition-colors`}
          >
            <div className="bg-purple-100 p-3 rounded-full">
              <IoIosHammer  className="text-2xl text-purple-600" />
            </div>
            <span className="font-medium">Create Auction</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/manage-auctions")}
            className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-blue-50 hover:bg-blue-100"
            } transition-colors`}
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <FaGavel className="text-2xl text-blue-600" />
            </div>
            <span className="font-medium">Manage Auctions</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/payments")}
            className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-green-50 hover:bg-green-100"
            } transition-colors`}
          >
            <div className="bg-green-100 p-3 rounded-full">
              <FaMoneyCheckAlt className="text-2xl text-green-600" />
            </div>
            <span className="font-medium">View Payments</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/settings")}
            className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-pink-50 hover:bg-pink-100"
            } transition-colors`}
          >
            <div className="bg-pink-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="font-medium">Settings</span>
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
            <p className="text-3xl font-bold text-white">
                  {formatNumber(dbUser?.accountBalance)}{" "}
                  <span className="text-lg">Taka</span>
                </p>
              {balanceLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">Loading balance...</p>
                </div>
              ) : balanceError ? (
                <p className="text-red-500">{balanceError}</p>
              ) : (
                <>
                  
                  <p className={labelStyle}>Available earnings</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-4 w-full py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    } font-semibold transition-colors`}
                  >
                    Withdraw Funds
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
                <IoMdNotifications className="text-yellow-500" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <IoIosHammer  className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">New bid received</p>
                    <p className={`text-xs ${labelStyle}`}>
                      2 hours ago on "Vintage Camera"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaStar className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Auction completed</p>
                    <p className={`text-xs ${labelStyle}`}>
                      Yesterday on "Antique Chair"
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
                <FaRocket className="text-pink-500" />
                Seller Tips
              </h3>
              <div className="space-y-3">
                <div
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-purple-50"
                  }`}
                >
                  <p className="font-medium">High-quality photos</p>
                  <p className={`text-xs ${labelStyle}`}>
                    Increase bids with better images
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-blue-50"
                  }`}
                >
                  <p className="font-medium">Detailed descriptions</p>
                  <p className={`text-xs ${labelStyle}`}>
                    Help buyers understand your items
                  </p>
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
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerProfile;