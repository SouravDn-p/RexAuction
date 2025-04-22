import { useContext, useState, useEffect } from "react";
import { AuthContexts } from "../../../../providers/AuthProvider";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Search,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";

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
    <div className="fixed top-4 right-4 z-50 flex items-center max-w-sm p-4 text-white rounded-lg shadow-lg animate-slideIn transition-all duration-300 ease-in-out transform hover:scale-105">
      <div className={`${bgColor} p-2 rounded-l-lg h-full flex items-center`}>
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : type === "error" ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 p-4 bg-white dark:bg-gray-800 rounded-r-lg">
        <p className="text-gray-800 dark:text-gray-200">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function BuyerPayment() {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });
  const { isDarkMode, toggleDarkMode } = useContext(AuthContexts);

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto transform transition-all duration-300 ease-in-out animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  };

  // Stats Component
  const PaymentStats = ({ payments }) => {
    const totalAmount = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const pendingCount = payments.filter((p) => p.status === "pending").length;
    const completedCount = payments.filter(
      (p) => p.status === "completed"
    ).length;
    const deliveredCount = payments.filter(
      (p) => p.deliveryStatus === "delivered"
    ).length;
    const inTransitCount = payments.filter(
      (p) => p.deliveryStatus === "in transit"
    ).length;

    return (
      <div
        className={`mb-6 p-4 rounded-lg shadow-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } animate-fadeIn`}
      >
        <h3 className="text-lg font-medium mb-4">Payment Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Spent
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${totalAmount.toLocaleString()}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-yellow-50"
            }`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Pending
            </p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingCount}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-green-50"
            }`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Completed
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedCount}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-purple-50"
            }`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Delivered
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {deliveredCount}
            </p>
          </div>
        </div>

        {/* Simple chart */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Payment Status</h4>
          <div className="h-8 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {pendingCount > 0 && (
              <div
                className="h-full bg-yellow-500 float-left"
                style={{ width: `${(pendingCount / payments.length) * 100}%` }}
                title={`Pending: ${pendingCount}`}
              ></div>
            )}
            {completedCount > 0 && (
              <div
                className="h-full bg-green-500 float-left"
                style={{
                  width: `${(completedCount / payments.length) * 100}%`,
                }}
                title={`Completed: ${completedCount}`}
              ></div>
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span>Pending ({pendingCount})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Completed ({completedCount})</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Delivery Status</h4>
          <div className="h-8 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {inTransitCount > 0 && (
              <div
                className="h-full bg-blue-500 float-left"
                style={{ width: `${(inTransitCount / completedCount) * 100}%` }}
                title={`In Transit: ${inTransitCount}`}
              ></div>
            )}
            {deliveredCount > 0 && (
              <div
                className="h-full bg-purple-500 float-left"
                style={{ width: `${(deliveredCount / completedCount) * 100}%` }}
                title={`Delivered: ${deliveredCount}`}
              ></div>
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>In Transit ({inTransitCount})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
              <span>Delivered ({deliveredCount})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mock data for buyer payments
  const mockPayments = [
    {
      id: 1,
      buyer: "John Doe",
      seller: "Jane Smith",
      amount: 1250,
      item: "Vintage Watch",
      date: "2023-04-15",
      status: "pending",
      auctionId: "A1001",
      paymentMethod: "Credit Card",
      description: "Rare 1960s chronograph in excellent condition",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      buyer: "John Doe",
      seller: "Sarah Williams",
      amount: 850,
      item: "Antique Vase",
      date: "2023-04-12",
      status: "completed",
      deliveryStatus: "delivered",
      auctionId: "A1002",
      paymentMethod: "PayPal",
      description: "Ming dynasty inspired ceramic vase with blue patterns",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      buyer: "John Doe",
      seller: "Robert Brown",
      amount: 3200,
      item: "Art Painting",
      date: "2023-04-10",
      status: "completed",
      deliveryStatus: "in transit",
      auctionId: "A1003",
      paymentMethod: "Bank Transfer",
      description: "Original oil painting by contemporary artist",
      estimatedDelivery: "2023-04-20",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      buyer: "John Doe",
      seller: "Lisa Taylor",
      amount: 750,
      item: "Collectible Coins",
      date: "2023-04-08",
      status: "pending",
      auctionId: "A1004",
      paymentMethod: "Credit Card",
      description: "Set of 5 rare silver coins from the 19th century",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      buyer: "John Doe",
      seller: "Jennifer Clark",
      amount: 1800,
      item: "Rare Book",
      date: "2023-04-05",
      status: "pending",
      auctionId: "A1005",
      paymentMethod: "PayPal",
      description: "First edition of a classic novel in pristine condition",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      buyer: "John Doe",
      seller: "William Johnson",
      amount: 920,
      item: "Vintage Camera",
      date: "2023-04-03",
      status: "completed",
      deliveryStatus: "delivered",
      auctionId: "A1006",
      paymentMethod: "Credit Card",
      description: "Classic film camera from the 1970s, fully functional",
      image: "https://via.placeholder.com/150",
    },
  ];

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPayments(mockPayments);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    setToast({
      message: "Payment data refreshed successfully",
      type: "success",
    });
  };

  // Sort function
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get filtered and sorted data
  const getFilteredAndSortedPayments = () => {
    let result = [...payments];

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((payment) => payment.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.auctionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFilter.from && dateFilter.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" day

      result = result.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= fromDate && paymentDate <= toDate;
      });
    }

    // Sort data
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  };

  const filteredPayments = getFilteredAndSortedPayments();

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleContactSupport = (paymentId) => {
    setToast({
      message: `Support request for payment #${paymentId} submitted. We'll contact you shortly.`,
      type: "info",
    });
    setIsModalOpen(false);
  };

  const handleDownloadReceipt = (paymentId) => {
    // In a real app, this would generate a PDF receipt
    setToast({
      message: `Receipt for payment #${paymentId} is being prepared for download.`,
      type: "info",
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({ from: null, to: null });
    setActiveTab("all");
    setSortConfig({ key: "date", direction: "descending" });

    setToast({
      message: "All filters have been reset",
      type: "info",
    });
  };

  return (
    <div
      className={`w-full p-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } min-h-screen transition-colors duration-300`}
    >
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <ShoppingBag className="mr-2" /> My Auction Payments
          </h2>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Track all your auction payments and delivery status
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search payments..."
              className={`pl-10 pr-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full md:w-auto`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              } border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center`}
              title="Date filter"
            >
              <Calendar className="w-5 h-5" />
              {(dateFilter.from || dateFilter.to) && (
                <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>

            {isDateFilterOpen && (
              <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <h4 className="font-medium mb-2">Date Range</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm mb-1">From</label>
                    <input
                      type="date"
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                      value={dateFilter.from || ""}
                      onChange={(e) =>
                        setDateFilter({ ...dateFilter, from: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">To</label>
                    <input
                      type="date"
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
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
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setIsDateFilterOpen(false)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
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
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
            } border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            title="Refresh data"
            disabled={isRefreshing}
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg border transition-colors duration-300 ${
              showStats
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                : isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
            title="Toggle statistics"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm ||
        dateFilter.from ||
        dateFilter.to ||
        activeTab !== "all") && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Active Filters:
          </span>

          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {dateFilter.from && dateFilter.to && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              Date: {dateFilter.from} to {dateFilter.to}
              <button
                onClick={() => setDateFilter({ from: null, to: null })}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeTab !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              Status: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              <button
                onClick={() => setActiveTab("all")}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Stats Section */}
      {showStats && <PaymentStats payments={payments} />}

      <div className="mb-6">
        <div className="flex space-x-2 border-b dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-500"
                : isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "pending"
                ? "border-b-2 border-blue-500 text-blue-500"
                : isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "completed"
                ? "border-b-2 border-blue-500 text-blue-500"
                : isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className={`rounded-lg shadow-md overflow-hidden ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
              >
                <div
                  className={`p-4 ${
                    payment.status === "pending"
                      ? isDarkMode
                        ? "bg-yellow-900/50"
                        : "bg-yellow-50"
                      : isDarkMode
                      ? "bg-green-900/50"
                      : "bg-green-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{payment.auctionId}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                        payment.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {payment.status === "pending" ? (
                        <Clock className="w-3 h-3 mr-1" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex p-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={payment.image || "/placeholder.svg"}
                      alt={payment.item}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">
                      {payment.item}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } line-clamp-2`}
                    >
                      {payment.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Seller:
                    </span>
                    <span className="font-medium">{payment.seller}</span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Amount:
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ${payment.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Date:
                    </span>
                    <span>{payment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Payment:
                    </span>
                    <span>{payment.paymentMethod}</span>
                  </div>
                  {payment.deliveryStatus && (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t dark:border-gray-700">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        Delivery:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                          payment.deliveryStatus === "delivered"
                            ? "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                        }`}
                      >
                        <Truck className="w-3 h-3 mr-1" />
                        {payment.deliveryStatus.charAt(0).toUpperCase() +
                          payment.deliveryStatus.slice(1)}
                      </span>
                    </div>
                  )}
                  {payment.estimatedDelivery && (
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        Est. Delivery:
                      </span>
                      <span className="text-sm">
                        {payment.estimatedDelivery}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={`p-4 border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => handleViewDetails(payment)}
                    className="w-full py-2 text-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-300 flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`col-span-full flex flex-col items-center justify-center py-12 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-md`}
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No payments found</h3>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {searchTerm || dateFilter.from || dateFilter.to
                  ? "Try adjusting your search or filters"
                  : "You haven't made any payments in this category yet."}
              </p>
              {(searchTerm || dateFilter.from || dateFilter.to) && (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Payment Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                  selectedPayment.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                }`}
              >
                {selectedPayment.status === "pending" ? (
                  <Clock className="w-4 h-4 mr-1" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-1" />
                )}
                {selectedPayment.status.charAt(0).toUpperCase() +
                  selectedPayment.status.slice(1)}
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">
                ${selectedPayment.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center">
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                <img
                  src={selectedPayment.image || "/placeholder.svg"}
                  alt={selectedPayment.item}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">{selectedPayment.item}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPayment.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Auction ID
                </p>
                <p className="font-medium">{selectedPayment.auctionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment Method
                </p>
                <p className="font-medium">{selectedPayment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Seller
                </p>
                <p className="font-medium">{selectedPayment.seller}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium">{selectedPayment.date}</p>
              </div>
            </div>

            {selectedPayment.deliveryStatus && (
              <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Delivery Status
                </p>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                      selectedPayment.deliveryStatus === "delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                    }`}
                  >
                    <Truck className="w-4 h-4 mr-1" />
                    {selectedPayment.deliveryStatus.charAt(0).toUpperCase() +
                      selectedPayment.deliveryStatus.slice(1)}
                  </span>

                  {selectedPayment.estimatedDelivery && (
                    <span className="ml-4 text-sm">
                      Est. Delivery: {selectedPayment.estimatedDelivery}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleContactSupport(selectedPayment.id)}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Contact Support
                </button>

                {selectedPayment.status === "completed" && (
                  <button
                    onClick={() => handleDownloadReceipt(selectedPayment.id)}
                    className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Download Receipt
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>
                  Need help with this payment? Our support team is available
                  24/7.
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add CSS for animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
