import { useContext, useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Search,
  Calendar,
  RefreshCw,
  FileText,
  X,
  Eye,
  MessageSquare,
  HelpCircle,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../LoadingSpinner";
import ThemeContext from "../../../Context/ThemeContext";
import { AuthContexts } from "../../../../providers/AuthProvider";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";

// Inline keyframes for animations
const animationStyles = `
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { transform: scale(0.95); }
    to { transform: scale(1); }
  }
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }
`;

// Inject keyframes into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center max-w-sm p-3 text-white rounded-xl shadow-2xl animate-slide-in bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700/50`}
    >
      <div className={`${bgColor} p-2 rounded-l-xl flex items-center`}>
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : type === "error" ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 px-4">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-gray-300 hover:text-white transition-colors duration-200"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  const { isDarkMode } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl transform transition-all duration-300 animate-scale-in overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50"
            : "bg-white border border-gray-200"
        } max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between p-4 sticky top-0 z-10 ${
            isDarkMode
              ? "bg-gray-900/80 backdrop-blur-md"
              : "bg-white/80 backdrop-blur-md"
          } border-b border-gray-200 dark:border-gray-700`}
        >
          <h3
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100"
            } transition-colors duration-200`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Stats Component
const PaymentStats = ({ payments }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const completedCount = payments.filter((p) => p.status === "completed").length;
  const deliveredCount = payments.filter((p) => p.deliveryStatus === "delivered").length;

  return (
    <div
      className={`mb-8 p-6 rounded-2xl shadow-lg ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50"
          : "bg-white border border-gray-200"
      } animate-fade-in`}
    >
      <h3
        className={`text-xl font-semibold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Payment Overview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Spent",
            value: `৳${totalAmount.toLocaleString()}`,
            color: "blue",
            bg: isDarkMode ? "bg-blue-900/30" : "bg-blue-50",
            text: isDarkMode ? "text-blue-300" : "text-blue-600",
          },
          {
            label: "Pending",
            value: pendingCount,
            color: "yellow",
            bg: isDarkMode ? "bg-yellow-900/30" : "bg-yellow-50",
            text: isDarkMode ? "text-yellow-300" : "text-yellow-600",
          },
          {
            label: "Completed",
            value: completedCount,
            color: "green",
            bg: isDarkMode ? "bg-green-900/30" : "bg-green-50",
            text: isDarkMode ? "text-green-300" : "text-green-600",
          },
          {
            label: "Delivered",
            value: deliveredCount,
            color: "purple",
            bg: isDarkMode ? "bg-purple-900/30" : "bg-purple-50",
            text: isDarkMode ? "text-purple-300" : "text-purple-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl ${stat.bg} transition-transform duration-300 hover:scale-105`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BuyerPayment() {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [notifiedAuctions, setNotifiedAuctions] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { user, dbUser } = useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Fetch user-specific payment data
  useEffect(() => {
    const fetchPayments = async () => {
      if (!user || !user.uid || !dbUser || !dbUser._id) {
        setToast({
          message: "User not authenticated. Please log in.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const buyerId = dbUser._id || user.uid;
        const response = await axiosPublic.get(`/payments?buyerId=${buyerId}`);
        const paymentData = response.data;

        const transformedPayments = paymentData.map((payment) => ({
          id: payment._id || "",
          buyer: payment.buyerInfo?.name || "Unknown",
          seller: payment.sellerInfo?.name || "Unknown",
          amount: payment.price || 0,
          item: payment.itemInfo?.name || "Unknown Item",
          date: payment.paymentDate
            ? new Date(payment.paymentDate).toISOString().split("T")[0]
            : "N/A",
          status: payment.PaymentStatus === "success" ? "completed" : "pending",
          auctionId: payment.auctionId || "",
          paymentMethod: payment.PaymentMethod || "N/A",
          deliveryStatus: "in transit",
          description: payment.Description || "No description available",
          estimatedDelivery: payment.paymentDate
            ? new Date(
                new Date(payment.paymentDate).getTime() + 5 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0]
            : "N/A",
          image:
            payment.itemInfo?.images?.length > 0
              ? payment.itemInfo.images[0]
              : "https://via.placeholder.com/150",
          transactionId: payment.transactionId || "N/A",
          serviceFee: payment.serviceFee || 0,
          bidAmount: payment.bidAmount || 0,
        }));

        setPayments(transformedPayments);
        setToast({
          message: "Your payment data loaded successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error fetching payments:", error);
        setToast({
          message: "Failed to load your payment data",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [dbUser, user, axiosPublic]);

  // Refresh data
  const refreshData = async () => {
    if (!user || !user.uid || !dbUser || !dbUser._id) {
      setToast({
        message: "User not authenticated. Please log in.",
        type: "error",
      });
      return;
    }

    setIsRefreshing(true);
    try {
      const buyerId = dbUser._id || user.uid;
      const response = await axiosPublic.get(`/payments?buyerId=${buyerId}`);
      const paymentData = response.data;

      const transformedPayments = paymentData.map((payment) => ({
        id: payment._id || "",
        buyer: payment.buyerInfo?.name || "Unknown",
        seller: payment.sellerInfo?.name || "Unknown",
        amount: payment.price || 0,
        item: payment.itemInfo?.name || "Unknown Item",
        date: payment.paymentDate
          ? new Date(payment.paymentDate).toISOString().split("T")[0]
          : "N/A",
        status: payment.PaymentStatus === "success" ? "completed" : "pending",
        auctionId: payment.auctionId || "",
        paymentMethod: payment.PaymentMethod || "N/A",
        deliveryStatus: "in transit",
        description: payment.Description || "No description available",
        estimatedDelivery: payment.paymentDate
          ? new Date(
              new Date(payment.paymentDate).getTime() + 5 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0]
          : "N/A",
        image:
          payment.itemInfo?.images?.length > 0
            ? payment.itemInfo.images[0]
            : "https://via.placeholder.com/150",
        transactionId: payment.transactionId || "N/A",
        serviceFee: payment.serviceFee || 0,
        bidAmount: payment.bidAmount || 0,
      }));

      setPayments(transformedPayments);
      setToast({
        message: "Your payment data refreshed successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error refreshing payments:", error);
      setToast({
        message: "Failed to refresh your payment data",
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter and sort payments with memoization
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (activeTab !== "all") {
      result = result.filter((payment) => payment.status === activeTab);
    }

    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.seller?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.auctionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter.from && dateFilter.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      if (fromDate > toDate) {
        setToast({
          message: "Invalid date range: 'From' date cannot be after 'To' date",
          type: "error",
        });
        return [];
      }
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= fromDate && paymentDate <= toDate;
      });
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [payments, activeTab, searchTerm, dateFilter]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleContactSupport = (paymentId) => {
    setToast({
      message: `Support request for payment #${paymentId} submitted.`,
      type: "info",
    });
    setIsModalOpen(false);
  };

  const handleDownloadReceipt = (paymentId) => {
    setToast({
      message: `Receipt for payment #${paymentId} is being prepared.`,
      type: "info",
    });
  };

  const handlePayNow = (auction) => {
    navigate(`/dashboard/payments/${auction.id}`, {
      state: {
        auctionData: {
          _id: auction.id,
          name: auction.name,
          images: [auction.image],
          currentBid: auction.currentBid,
          sellerDisplayName: auction.seller,
        },
      },
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({ from: null, to: null });
    setActiveTab("all");
    setToast({ message: "Filters reset", type: "info" });
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/150";
  };

  return (
    <div
      className={`w-full p-4 sm:p-6 lg:p-8 min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"
      } transition-colors duration-500`}
    >
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            <ShoppingBag className="mr-2 w-8 h-8" /> My Auction Payments
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Track your auction payments and pending actions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search payments..."
              className={`w-full sm:w-64 pl-10 pr-4 py-2 rounded-full border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
              className={`p-2 rounded-full border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  : "bg-white border-gray-200 hover:bg-gray-100"
              } transition-colors duration-300 flex items-center shadow-sm`}
              title="Date filter"
              aria-label="Toggle date filter"
            >
              <Calendar className="w-5 h-5" />
              {(dateFilter.from || dateFilter.to) && (
                <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
            {isDateFilterOpen && (
              <div
                className={`absolute right-0 mt-2 p-4 rounded-xl shadow-lg z-10 border animate-fade-in w-64 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              >
                <h4 className="font-semibold mb-3">Date Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-900 border-gray-700 text-white"
                          : "bg-white border-gray-200 text-gray-800"
                      }`}
                      value={dateFilter.from || ""}
                      onChange={(e) =>
                        setDateFilter({ ...dateFilter, from: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">To</label>
                    <input
                      type="date"
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-900 border-gray-700 text-white"
                          : "bg-white border-gray-200 text-gray-800"
                      }`}
                      value={dateFilter.to || ""}
                      onChange={(e) =>
                        setDateFilter({ ...dateFilter, to: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => {
                        setDateFilter({ from: null, to: null });
                        setIsDateFilterOpen(false);
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setIsDateFilterOpen(false)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={refreshData}
            className={`p-2 rounded-full border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-white border-gray-200 hover:bg-gray-100"
              } transition-colors duration-300 shadow-sm ${
              isRefreshing ? "animate-spin" : ""
            }`}
            title="Refresh data"
            disabled={isRefreshing}
            aria-label="Refresh payment data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-full border ${
              showStats
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                : isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-white border-gray-200 hover:bg-gray-100"
            } transition-colors duration-300 shadow-sm`}
            title="Toggle statistics"
            aria-label="Toggle payment statistics"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {(searchTerm || dateFilter.from || dateFilter.to || activeTab !== "all") && (
        <div
          className={`flex flex-wrap items-center gap-2 mb-6 p-4 rounded-xl border ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200"
          } backdrop-blur-sm`}
        >
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-blue-300" : "text-blue-700"
            }`}
          >
            Active Filters:
          </span>
          {searchTerm && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                isDarkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                aria-label="Clear search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {dateFilter.from && dateFilter.to && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                isDarkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Date: {dateFilter.from} to {dateFilter.to}
              <button
                onClick={() => setDateFilter({ from: null, to: null })}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                aria-label="Clear date filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeTab !== "all" && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                isDarkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Status: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              <button
                onClick={() => setActiveTab("all")}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                aria-label="Clear status filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className={`ml-auto text-sm ${
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}
            aria-label="Reset all filters"
          >
            Reset All
          </button>
        </div>
      )}

      {showStats && <PaymentStats payments={payments} />}

      {/* Notified Auctions Section */}
      {notifiedAuctions.length > 0 && (
        <div className="mb-12">
          <div
            className={`flex items-center justify-between p-4 rounded-xl ${
              isDarkMode
                ? "bg-gradient-to-r from-red-900/30 to-gray-800 border border-red-700/50"
                : "bg-gradient-to-r from-red-50 to-gray-100 border border-red-200"
            } mb-6`}
          >
            <h3 className="text-xl font-semibold flex items-center">
              <AlertCircle className="w-6 h-6 mr-2 text-red-500" />
              Action Required: Pending Payments
            </h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Complete these payments to secure your auction wins
            </p>
          </div>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full rounded-xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50"
                  : "bg-white border border-gray-200"
              } shadow-lg`}
            >
              <thead>
                <tr
                  className={`${
                    isDarkMode ? "bg-gray-900/80" : "bg-gray-50"
                  } text-left text-sm font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <th className="p-4">Product</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Bid Amount</th>
                  <th className="p-4">Total Due</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {notifiedAuctions.map((auction) => (
                  <tr
                    key={auction.id}
                    className={`border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    } hover:bg-opacity-50 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    } transition-colors duration-200`}
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={auction.image}
                          alt={auction.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    </td>
                    <td className="p-4">{auction.name}</td>
                    <td className="p-4">{auction.seller}</td>
                    <td className="p-4 text-green-500">
                      ৳{auction.currentBid.toLocaleString()}
                    </td>
                    <td className="p-4 text-red-500">
                      ৳{(auction.currentBid + Math.round(auction.currentBid * 0.01)).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                          isDarkMode
                            ? "bg-red-900/50 text-red-300"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Payment Pending
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handlePayNow(auction)}
                        className="py-1 px-3 rounded-full bg-gradient-to-r from-red-500 to-purple-500 text-white font-medium hover:from-red-600 hover:to-purple-600 transition-all duration-300 shadow-md flex items-center"
                        aria-label={`Pay for auction ${auction.name}`}
                      >
                        <Eye className="w-4 h-4 mr-2" /> Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b dark:border-gray-700 pb-2">
          {["all", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab)}
              aria-label={`Filter by ${tab} payments`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table
            className={`min-w-full rounded-xl ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50"
                : "bg-white border border-gray-200"
            } shadow-lg`}
          >
            <thead>
              <tr
                className={`${
                  isDarkMode ? "bg-gray-900/80" : "bg-gray-50"
                } text-left text-sm font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <th className="p-4">Product</th>
                <th className="p-4">Item</th>
                <th className="p-4">Seller</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Delivery</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`border-t ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    } hover:bg-opacity-50 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    } transition-colors duration-200`}
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img
                          src={payment.image}
                          alt={payment.item}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    </td>
                    <td className="p-4">{payment.item}</td>
                    <td className="p-4">{payment.seller}</td>
                    <td className="p-4 text-green-500">
                      ৳{payment.amount.toLocaleString()}
                    </td>
                    <td className="p-4">{payment.date}</td>
                    <td className="p-4">{payment.paymentMethod}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                          payment.status === "pending"
                            ? isDarkMode
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-yellow-200 text-yellow-800"
                            : isDarkMode
                            ? "bg-green-900/50 text-green-300"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {payment.status === "pending" ? (
                          <Clock className="w-4 h-4 mr-1" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      {payment.deliveryStatus && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                            payment.deliveryStatus === "delivered"
                              ? isDarkMode
                                ? "bg-green-900/50 text-green-300"
                                : "bg-green-200 text-green-800"
                              : isDarkMode
                              ? "bg-blue-900/50 text-blue-300"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          <Truck className="w-4 h-4 mr-1" />
                          {payment.deliveryStatus.charAt(0).toUpperCase() +
                            payment.deliveryStatus.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="py-1 px-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md flex items-center"
                        aria-label={`View details for payment ${payment.id}`}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className={`p-12 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                      <h3
                        className={`text-xl font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        } mb-2`}
                      >
                        No payments found
                      </h3>
                      <p className="text-sm text-center max-w-md">
                        {searchTerm || dateFilter.from || dateFilter.to
                          ? "Try adjusting your search or filters to find your payments."
                          : "You haven't made any payments yet. Start bidding to see your transactions here!"}
                      </p>
                      {(searchTerm || dateFilter.from || dateFilter.to) && (
                        <button
                          onClick={resetFilters}
                          className="mt-4 py-2 px-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md"
                          aria-label="Reset all filters"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Payment Details">
        {selectedPayment ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center ${
                  selectedPayment.status === "pending"
                    ? isDarkMode
                      ? "bg-yellow-900/50 text-yellow-300"
                      : "bg-yellow-100 text-yellow-800"
                    : isDarkMode
                    ? "bg-green-900/50 text-green-300"
                    : "bg-green-100 text-green-800"
                } shadow-sm`}
              >
                {selectedPayment.status === "pending" ? (
                  <Clock className="w-5 h-5 mr-2" />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {selectedPayment.status.charAt(0).toUpperCase() +
                  selectedPayment.status.slice(1)}
              </span>
              <span
                className={`font-bold text-lg ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                ৳{selectedPayment.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 shadow-md">
                <img
                  src={selectedPayment.image}
                  alt={selectedPayment.item}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-bold text-lg sm:text-xl line-clamp-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {selectedPayment.item}
                </h3>
                <p
                  className={`text-sm line-clamp-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mt-1`}
                >
                  {selectedPayment.description}
                </p>
              </div>
            </div>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl ${
                isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              {[
                { label: "Payment Method", value: selectedPayment.paymentMethod || "N/A" },
                { label: "Seller", value: selectedPayment.seller || "Unknown" },
                { label: "Date", value: selectedPayment.date || "N/A" },
                {
                  label: "Transaction ID",
                  value: selectedPayment.transactionId || "N/A",
                },
                {
                  label: "Service Fee",
                  value: selectedPayment.serviceFee
                    ? `৳${selectedPayment.serviceFee.toLocaleString()}`
                    : "N/A",
                },
              ].map((item, index) => (
                <div key={index}>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            {selectedPayment.deliveryStatus && (
              <div
                className={`p-4 rounded-xl ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mb-2`}
                >
                  Delivery Status
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center ${
                      selectedPayment.deliveryStatus === "delivered"
                        ? isDarkMode
                          ? "bg-green-900/50 text-green-300"
                          : "bg-green-100 text-green-800"
                        : isDarkMode
                        ? "bg-blue-900/50 text-blue-300"
                        : "bg-blue-100 text-blue-800"
                    } shadow-sm`}
                  >
                    <Truck className="w-5 h-5 mr-2" />
                    {selectedPayment.deliveryStatus.charAt(0).toUpperCase() +
                      selectedPayment.deliveryStatus.slice(1)}
                  </span>
                  {selectedPayment.estimatedDelivery && (
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Est. Delivery: {selectedPayment.estimatedDelivery}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="pt-4 border-t dark:border-gray-700 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleContactSupport(selectedPayment.id)}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 shadow-md flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  }`}
                  aria-label="Contact support for payment"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Contact Support
                </button>
                {selectedPayment.status === "completed" && (
                  <button
                    onClick={() => handleDownloadReceipt(selectedPayment.id)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 shadow-md flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 hover:from-gray-800 hover:to-gray-900"
                        : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400"
                    }`}
                    aria-label="Download receipt for payment"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Download Receipt
                  </button>
                )}
              </div>
              <div
                className={`flex items-center text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Need help? Our support team is available 24/7.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No payment details available.
            </p>
          </div>
          )}
      </Modal>
    </div>
  );
}