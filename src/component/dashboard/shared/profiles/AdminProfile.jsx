import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import CountUp from "react-countup";
import useAuth from "../../../../hooks/useAuth";
import coverPhoto from "../../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../../LoadingSpinner";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaGavel,
  FaDollarSign,
  FaChartLine,
  FaTicketAlt,
  FaShieldAlt,
  FaCog,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { RiUserStarFill } from "react-icons/ri";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [currentCover, setCurrentCover] = useState(coverPhoto);
  const [selectedCover, setSelectedCover] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    totalAuctions: 0,
    totalRevenue: 0,
    pendingRequests: 0,
    activeAuctions: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    performance: "Loading...",
    supportTickets: 0,
    pendingTasks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Quick actions configuration
  const quickActions = [
    {
      id: 1,
      icon: <FaUsers className="text-2xl text-purple-500 mb-2" />,
      label: "Manage Users",
      path: "/dashboard/users",
      bgColor: "bg-gradient-to-br from-purple-100 to-blue-50",
    },
    {
      id: 2,
      icon: <FaGavel className="text-2xl text-purple-500 mb-2" />,
      label: "Manage Auctions",
      path: "/dashboard/auctions",
      bgColor: "bg-gradient-to-br from-blue-100 to-cyan-50",
    },
    {
      id: 3,
      icon: <RiUserStarFill className="text-2xl text-purple-500 mb-2" />,
      label: "Seller Requests",
      path: "/dashboard/seller-requests",
      bgColor: "bg-gradient-to-br from-cyan-100 to-teal-50",
    },
    {
      id: 4,
      icon: <FaShieldAlt className="text-2xl text-purple-500 mb-2" />,
      label: "Security Settings",
      path: "/dashboard/security",
      bgColor: "bg-gradient-to-br from-teal-100 to-emerald-50",
    },
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch users data
        const usersResponse = await axios.get("http://localhost:5001/users");
        const users = usersResponse.data || [];

        // Fetch auctions data
        const auctionsResponse = await axios.get("http://localhost:5001/auctions");
        const auctions = auctionsResponse.data || [];

        // Fetch seller requests
        const requestsResponse = await axios.get("http://localhost:5001/sellerRequest");
        const requests = requestsResponse.data || [];

        // Fetch revenue data (if you have an endpoint)
        let totalRevenue = 0;
        try {
          const revenueResponse = await axios.get("http://localhost:5001/revenue");
          totalRevenue = revenueResponse.data.total || 0;
        } catch (error) {
          console.log("Revenue endpoint not available");
        }

        // Calculate statistics
        const totalSellers = users.filter(
          (u) => u.role?.toLowerCase() === "seller"
        ).length;

        const totalBuyers = users.filter(
          (u) => u.role?.toLowerCase() === "buyer"
        ).length;

        const activeAuctions = auctions.filter(
          (a) => a.status === "active" || new Date(a.endTime) > new Date()
        ).length;

        const pendingRequests = requests.filter(
          (r) => r.becomeSellerStatus?.toLowerCase() === "pending"
        ).length;

        // Calculate support tickets (if you have an endpoint)
        let supportTickets = 0;
        try {
          const ticketsResponse = await axios.get("http://localhost:5001/support/tickets");
          supportTickets = ticketsResponse.data.openTickets || 0;
        } catch (error) {
          supportTickets = pendingRequests; // Fallback
        }

        setAdminData({
          totalUsers: users.length,
          totalSellers,
          totalBuyers,
          totalAuctions: auctions.length,
          activeAuctions,
          totalRevenue,
          pendingRequests,
        });

        setRecentUsers(users.slice(0, 5));

        setSellerRequests(
          requests
            .filter((r) => r.becomeSellerStatus?.toLowerCase() === "pending")
            .slice(0, 5)
        );

        setSystemStatus({
          performance: "Excellent (99.9% uptime)",
          supportTickets: supportTickets,
          pendingTasks: pendingRequests,
        });

        // Fetch cover options from your backend or use defaults
        try {
          const coverResponse = await axios.get("http://localhost:5001/cover-images");
          setCoverOptions(coverResponse.data);
        } catch (error) {
          // Fallback to default cover options
          setCoverOptions([
            { id: 1, image: coverPhoto },
            { id: 2, image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800" },
            { id: 3, image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800" },
            { id: 4, image: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800" },
          ]);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        
        // Set empty data on error
        setAdminData({
          totalUsers: 0,
          totalSellers: 0,
          totalBuyers: 0,
          totalAuctions: 0,
          activeAuctions: 0,
          totalRevenue: 0,
          pendingRequests: 0,
        });
        
        setSystemStatus({
          performance: "Unable to fetch",
          supportTickets: 0,
          pendingTasks: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const saveCoverImage = async () => {
    if (!selectedCover) {
      toast.error("Please select a cover image");
      return;
    }
    
    setIsSaving(true);
    try {
      // Save cover image to backend
      await axios.post("http://localhost:5001/user/cover", {
        userId: user?.uid,
        coverImage: selectedCover
      });
      
      setCurrentCover(selectedCover);
      setIsModalOpen(false);
      setSelectedCover(null);
      toast.success("Cover image updated successfully");
    } catch (error) {
      console.error("Error saving cover image:", error);
      toast.error("Failed to save cover image");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveRequest = async (requestId, userEmail) => {
    try {
      await axios.patch(`http://localhost:5001/sellerRequest/${requestId}`, {
        status: "approved"
      });
      
      // Update user role to seller
      await axios.patch(`http://localhost:5001/user/${userEmail}`, {
        role: "seller"
      });
      
      // Remove from local state
      setSellerRequests(prev => prev.filter(req => req._id !== requestId));
      setAdminData(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1,
        totalSellers: prev.totalSellers + 1,
        totalBuyers: prev.totalBuyers - 1
      }));
      
      toast.success("Seller request approved successfully");
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.patch(`http://localhost:5001/sellerRequest/${requestId}`, {
        status: "rejected"
      });
      
      setSellerRequests(prev => prev.filter(req => req._id !== requestId));
      setAdminData(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1
      }));
      
      toast.success("Seller request rejected");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  const boxStyle = `rounded-xl shadow-lg ${
    isDarkMode
      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
      : "bg-white border-gray-200 hover:bg-gray-50"
  } transition-all duration-300`;

  if (authLoading || isLoading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-800"
      } transition-all duration-300 p-4 md:p-8`}
    >
      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-[300px] md:h-[350px] bg-cover bg-center rounded-2xl overflow-hidden shadow-xl"
        style={{
          backgroundImage: `linear-gradient(rgba(109, 40, 217, 0.7), rgba(76, 29, 149, 0.7)), url(${currentCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 flex flex-col items-center gap-4">
            <motion.img
              src={user?.photoURL || "https://ui-avatars.com/api/?name=Admin&background=6d28d9&color=fff"}
              alt={user?.displayName || "Admin"}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=6d28d9&color=fff`;
              }}
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome Back, {user?.displayName?.split(" ")[0] || "Admin"}!
            </h1>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Here's what's happening with your marketplace today.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute right-4 top-4 bg-white/90 text-purple-800 hover:bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          <FaEdit className="text-purple-600" />
          <span className="font-medium">Edit Cover</span>
        </button>
      </motion.div>

      {/* Cover Image Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-2xl w-full max-w-4xl shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Choose Cover Image
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {coverOptions.map((cover) => (
                <motion.div
                  key={cover.id}
                  whileHover={{ scale: 1.03 }}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedCover === cover.image
                      ? "ring-4 ring-purple-500"
                      : "ring-1 ring-gray-300"
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
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
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
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Quick Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 max-w-7xl mx-auto"
      >
        {/* Total Users */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`rounded-xl shadow-md overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-40 justify-between`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                Total Users
              </p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={adminData.totalUsers} duration={2} />
              </h3>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {adminData.totalSellers} Sellers · {adminData.totalBuyers} Buyers
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              }`}
            >
              <FaUsers className="text-2xl text-purple-500" />
            </div>
          </div>
          <div
            className={`h-1 bg-gradient-to-r from-purple-500 to-blue-500 ${
              isDarkMode ? "opacity-70" : "opacity-90"
            }`}
          ></div>
        </motion.div>

        {/* Total Revenue */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`rounded-xl shadow-md overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-40 justify-between`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                Total Revenue
              </p>
              <h3 className="text-3xl font-bold mt-2">
                ${<CountUp end={adminData.totalRevenue} duration={2} separator="," />}
              </h3>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Lifetime earnings
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              }`}
            >
              <FaDollarSign className="text-2xl text-purple-500" />
            </div>
          </div>
          <div
            className={`h-1 bg-gradient-to-r from-green-500 to-teal-500 ${
              isDarkMode ? "opacity-70" : "opacity-90"
            }`}
          ></div>
        </motion.div>

        {/* Active Auctions */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`rounded-xl shadow-md overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-40 justify-between`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                Active Auctions
              </p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={adminData.activeAuctions} duration={2} />
              </h3>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Out of {adminData.totalAuctions} total
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              }`}
            >
              <FaGavel className="text-2xl text-purple-500" />
            </div>
          </div>
          <div
            className={`h-1 bg-gradient-to-r from-yellow-500 to-orange-500 ${
              isDarkMode ? "opacity-70" : "opacity-90"
            }`}
          ></div>
        </motion.div>

        {/* Pending Requests */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`rounded-xl shadow-md overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col h-40 justify-between`}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                Pending Requests
              </p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={adminData.pendingRequests} duration={2} />
              </h3>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Requires attention
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              }`}
            >
              <RiUserStarFill className="text-2xl text-purple-500" />
            </div>
          </div>
          <div
            className={`h-1 bg-gradient-to-r from-red-500 to-pink-500 ${
              isDarkMode ? "opacity-70" : "opacity-90"
            }`}
          ></div>
        </motion.div>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={boxStyle}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaCog className="text-purple-500" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(action.path)}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center ${action.bgColor} transition-colors dark:bg-opacity-20`}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={boxStyle}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaShieldAlt className="text-purple-500" />
                System Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
                  }`}
                >
                  <FaChartLine className="text-purple-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-medium">Performance</h4>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {systemStatus.performance}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
                  }`}
                >
                  <FaTicketAlt className="text-purple-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-medium">Support Tickets</h4>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {systemStatus.supportTickets} open tickets
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
                  }`}
                >
                  <FaHourglassHalf className="text-purple-500 text-xl" />
                </div>
                <div>
                  <h4 className="font-medium">Pending Tasks</h4>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {systemStatus.pendingTasks} tasks to review
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pending Seller Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={boxStyle}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <RiUserStarFill className="text-purple-500" />
                Pending Seller Requests
                {adminData.pendingRequests > 0 && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                    {adminData.pendingRequests} New
                  </span>
                )}
              </h2>
              <button
                onClick={() => navigate("/dashboard/seller-requests")}
                className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              {sellerRequests.length === 0 ? (
                <div className="text-center py-8">
                  <RiUserStarFill className="mx-auto text-4xl text-purple-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">
                    No pending seller requests
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    All requests have been processed
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sellerRequests.map((request) => (
                    <motion.div
                      key={request._id}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-lg flex items-center justify-between ${
                        isDarkMode ? "bg-gray-700" : "bg-purple-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={request.photo || `https://ui-avatars.com/api/?name=${request.name}&background=6d28d9&color=fff`}
                          alt={request.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${request.name}&background=6d28d9&color=fff`;
                          }}
                        />
                        <div>
                          <h4 className="font-medium">{request.name}</h4>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {request.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleApproveRequest(request._id, request.email)}
                          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          title="Approve"
                        >
                          <FaCheckCircle />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRejectRequest(request._id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Reject"
                        >
                          <FaTimesCircle />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={boxStyle}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaUsers className="text-purple-500" />
                Recent Users
              </h2>
              <button
                onClick={() => navigate("/dashboard/users")}
                className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              {recentUsers.length === 0 ? (
                <div className="text-center py-8">
                  <FaUsers className="mx-auto text-4xl text-purple-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">
                    No users found
                  </h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`text-left ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <th className="pb-3 font-medium">User</th>
                        <th className="pb-3 font-medium">Role</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentUsers.map((user) => (
                        <motion.tr
                          key={user._id}
                          whileHover={{
                            backgroundColor: isDarkMode
                              ? "rgba(76, 29, 149, 0.1)"
                              : "rgba(216, 180, 254, 0.2)",
                          }}
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=6d28d9&color=fff`}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=6d28d9&color=fff`;
                                }}
                              />
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs opacity-70">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 capitalize">{user.role || "user"}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "active" || !user.status
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {user.status || "active"}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;