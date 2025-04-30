import { useState, useEffect, useRef, useContext } from "react";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  DollarSign,
  X,
  Search,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  Eye,
  MessageSquare,
  BarChart3,
  ArrowUpDown,
  Tag,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  HelpCircle,
  Share2,
} from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import useAuth from "../../../../hooks/useAuth";
import ThemeContext from "../../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";

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

export default function SellerPayment() {
  const [activeTab, setActiveTab] = useState("received");
  const [isLoading, setIsLoading] = useState(true);
  const [receivedPayments, setReceivedPayments] = useState([]);
  const [auctions, setAuctions] = useState([]); // Empty since auctions not provided
  const [selectedItem, setSelectedItem] = useState(null);
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    minAmount: "",
    maxAmount: "",
    status: "all",
  });
  const [expandedAuction, setExpandedAuction] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth(); // Assuming useAuth provides user with sellerId
  const navigate = useNavigate();
  const dateFilterRef = useRef(null);
  const filterRef = useRef(null);

  // Fetch payment data from backend
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://rex-auction-server-side-jzyx.onrender.com/payments"
      );
      const data = await response.json();
      // Filter payments for the logged-in seller
      const sellerPayments = data.filter(
        (payment) => payment.sellerInfo.email === user.email // Match by email
      );
      const formattedPayments = sellerPayments.map((payment) => ({
        id: payment._id,
        buyer: payment.buyerInfo.name,
        amount: payment.price,
        item: payment.itemInfo.name,
        date: new Date(payment.paymentDate).toISOString().split("T")[0],
        status:
          payment.PaymentStatus === "success"
            ? "completed"
            : payment.PaymentStatus,
        paymentMethod: payment.PaymentMethod,
        description: `${
          payment.itemInfo.name
        } in ${payment.itemInfo.condition.toLowerCase()} condition`,
        image: payment.itemInfo.images[0] || "/placeholder.svg",
      }));
      setReceivedPayments(formattedPayments);
      setIsLoading(false);
    } catch (error) {
      setToast({ message: "Failed to fetch payments", type: "error" });
      setIsLoading(false);
    }
  };

  // Fetch payments on mount
  useEffect(() => {
    if (user?.email) {
      fetchPayments();
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(event.target)
      ) {
        setIsDateFilterOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchPayments();
    setIsRefreshing(false);
    setToast({
      message: "Data refreshed successfully",
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
  const getFilteredAndSortedData = (data, type) => {
    let result = [...data];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.buyer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFilter.from && dateFilter.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999);

      result = result.filter((item) => {
        const itemDate = new Date(item.date || item.endDate);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Apply amount filters
    if (filterOptions.minAmount) {
      result = result.filter(
        (item) =>
          (type === "payments" ? item.amount : item.currentBid) >=
          parseFloat(filterOptions.minAmount)
      );
    }

    if (filterOptions.maxAmount) {
      result = result.filter(
        (item) =>
          (type === "payments" ? item.amount : item.currentBid) <=
          parseFloat(filterOptions.maxAmount)
      );
    }

    // Filter by status
    if (filterOptions.status !== "all") {
      result = result.filter((item) => item.status === filterOptions.status);
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

  const filteredPayments = getFilteredAndSortedData(
    receivedPayments,
    "payments"
  );
  const filteredAuctions = getFilteredAndSortedData(auctions, "auctions");

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setIsModalOpen(true);
  };

  const handleContactBuyer = (buyerId) => {
    setToast({
      message: `Message sent to buyer.`,
      type: "success",
    });
    setIsModalOpen(false);
  };

  const handleEditAuction = (auctionId) => {
    setToast({
      message: "Auction details updated.",
      type: "success",
    });
    setIsModalOpen(false);
  };

  const handleCreateAuction = () => {
    navigate("/dashboard/createAuction");
  };

  const handleShareAuction = (auctionId) => {
    setToast({
      message: "Auction link copied to clipboard.",
      type: "success",
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({ from: null, to: null });
    setFilterOptions({
      minAmount: "",
      maxAmount: "",
      status: "all",
    });
    setToast({
      message: "All filters have been reset",
      type: "info",
    });
  };

  const toggleAuctionExpand = (id) => {
    if (expandedAuction === id) {
      setExpandedAuction(null);
    } else {
      setExpandedAuction(id);
    }
  };

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

  // Stats Card Component
  const StatsCard = ({
    title,
    value,
    icon,
    color,
    isDarkMode,
    trend = null,
  }) => {
    const Icon = icon;
    return (
      <div
        className={`rounded-lg shadow-md p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${color} mr-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {title}
              </p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center ${
                trend.positive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.positive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm font-medium">{trend.value}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Stats Component
  const SellerStats = ({ payments, auctions }) => {
    const totalEarnings = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const pendingPayments = payments.filter(
      (p) => p.status === "pending"
    ).length;
    const completedPayments = payments.filter(
      (p) => p.status === "completed"
    ).length;
    const activeAuctions = auctions.filter((a) => a.status === "active").length;
    const endedAuctions = auctions.filter((a) => a.status === "ended").length;

    return (
      <div
        className={`mb-6 p-4 rounded-lg shadow-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } animate-fadeIn`}
      >
        <h3 className="text-lg font-medium mb-4">Seller Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Earnings Breakdown</h4>
            <div className="h-40 flex items-end space-x-4">
              {payments.map((payment, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-full ${
                      payment.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    } rounded-t-md`}
                    style={{
                      height: `${(payment.amount / totalEarnings) * 100}%`,
                    }}
                  ></div>
                  <p className="mt-2 text-xs truncate w-full text-center">
                    {payment.item}
                  </p>
                  <p className="text-xs font-bold">${payment.amount}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Auction Status</h4>
            <div className="relative h-40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 relative">
                {activeAuctions > 0 && (
                  <div
                    className="absolute inset-0 rounded-full border-8 border-blue-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${
                        50 +
                        50 *
                          Math.cos(
                            (2 * Math.PI * activeAuctions) / auctions.length
                          )
                      }% ${
                        50 -
                        50 *
                          Math.sin(
                            (2 * Math.PI * activeAuctions) / auctions.length
                          )
                      }%, 50% 0%)`,
                      transform: "rotate(90deg)",
                    }}
                  ></div>
                )}
                {endedAuctions > 0 && (
                  <div
                    className="absolute inset-0 rounded-full border-8 border-green-500"
                    style={{
                      clipPath: `polygon(50% 50%, ${
                        50 +
                        50 *
                          Math.cos(
                            (2 * Math.PI * activeAuctions) / auctions.length
                          )
                      }% ${
                        50 -
                        50 *
                          Math.sin(
                            (2 * Math.PI * activeAuctions) / auctions.length
                          )
                      }%, ${
                        50 +
                        50 *
                          Math.cos(
                            (2 * Math.PI * (activeAuctions + endedAuctions)) /
                              auctions.length
                          )
                      }% ${
                        50 -
                        50 *
                          Math.sin(
                            (2 * Math.PI * (activeAuctions + endedAuctions)) /
                              auctions.length
                          )
                      })`,
                      transform: "rotate(90deg)",
                    }}
                  ></div>
                )}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{auctions.length}</span>
                  <span className="text-xs">Total</span>
                </div>
              </div>
            </div>
            <div className="flex justify-around mt-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Active ({activeAuctions})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Ended ({endedAuctions})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Payment Status</h4>
            <div className="h-8 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {pendingPayments > 0 && (
                <div
                  className="h-full bg-yellow-500 float-left"
                  style={{
                    width: `${(pendingPayments / payments.length) * 100}%`,
                  }}
                  title={`Pending: ${pendingPayments}`}
                ></div>
              )}
              {completedPayments > 0 && (
                <div
                  className="h-full bg-green-500 float-left"
                  style={{
                    width: `${(completedPayments / payments.length) * 100}%`,
                  }}
                  title={`Completed: ${completedPayments}`}
                ></div>
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span>Pending ({pendingPayments})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Completed ({completedPayments})</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Monthly Performance</h4>
            <div className="flex items-end h-8 space-x-1">
              {[30, 45, 25, 60, 75, 40, 90].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500 dark:bg-blue-600 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span>Last 7 days</span>
              <span className="text-green-500 font-medium">+12% growth</span>
            </div>
          </div>
        </div>
      </div>
    );
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
            <DollarSign className="mr-2" /> Seller Dashboard
          </h2>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Manage your auctions and track received payments
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
              placeholder="Search..."
              className={`pl-10 pr-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full md:w-auto`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative" ref={dateFilterRef}>
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

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              } border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center`}
              title="More filters"
            >
              <Filter className="w-5 h-5" />
              {(filterOptions.minAmount ||
                filterOptions.maxAmount ||
                filterOptions.status !== "all") && (
                <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700 w-64 animate-fadeIn">
                <h4 className="font-medium mb-2">Filters</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Min Amount ($)</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                      value={filterOptions.minAmount}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          minAmount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Max Amount ($)</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                      value={filterOptions.maxAmount}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          maxAmount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                      value={filterOptions.status}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => {
                        setFilterOptions({
                          minAmount: "",
                          maxAmount: "",
                          status: "all",
                        });
                        setIsFilterOpen(false);
                      }}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
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

          <button
            onClick={handleCreateAuction}
            className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors duration-300 flex items-center"
            title="Create new auction"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {(searchTerm ||
        dateFilter.from ||
        dateFilter.to ||
        filterOptions.minAmount ||
        filterOptions.maxAmount ||
        filterOptions.status !== "all") && (
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

          {filterOptions.minAmount && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              Min Amount: ${filterOptions.minAmount}
              <button
                onClick={() =>
                  setFilterOptions({ ...filterOptions, minAmount: "" })
                }
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterOptions.maxAmount && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              Max Amount: ${filterOptions.maxAmount}
              <button
                onClick={() =>
                  setFilterOptions({ ...filterOptions, maxAmount: "" })
                }
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterOptions.status !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              Status:{" "}
              {filterOptions.status.charAt(0).toUpperCase() +
                filterOptions.status.slice(1)}
              <button
                onClick={() =>
                  setFilterOptions({ ...filterOptions, status: "all" })
                }
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Auctions"
          value={auctions.length}
          icon={ShoppingBag}
          color="bg-blue-500"
          isDarkMode={isDarkMode}
          trend={{ positive: true, value: 12 }}
        />
        <StatsCard
          title="Active Auctions"
          value={auctions.filter((a) => a.status === "active").length}
          icon={Clock}
          color="bg-yellow-500"
          isDarkMode={isDarkMode}
        />
        <StatsCard
          title="Total Earnings"
          value={`$${receivedPayments
            .reduce((sum, p) => sum + p.amount, 0)
            .toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          isDarkMode={isDarkMode}
          trend={{ positive: true, value: 8 }}
        />
        <StatsCard
          title="Avg. Bid Increase"
          value={`${
            auctions.length > 0
              ? Math.round(
                  auctions.reduce(
                    (sum, a) =>
                      sum +
                      ((a.currentBid - a.startingBid) / a.startingBid) * 100,
                    0
                  ) / auctions.length
                )
              : 0
          }%`}
          icon={TrendingUp}
          color="bg-purple-500"
          isDarkMode={isDarkMode}
        />
      </div>

      {showStats && (
        <SellerStats payments={receivedPayments} auctions={auctions} />
      )}

      <div className="mb-6">
        <div className="flex space-x-2 border-b dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "received"
                ? "border-b-2 border-blue-500 text-blue-500"
                : isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received Payments
          </button>
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "auctions"
                ? "border-b-2 border-blue-500 text-blue-500"
                : isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("auctions")}
          >
            My Auctions
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : activeTab === "received" ? (
        <div
          className={`overflow-x-auto rounded-lg border shadow-sm ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <table
            className={`min-w-full divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-200"
            }`}
          >
            <thead className={isDarkMode ? "bg-gray-800" : "bg-gray-50"}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("item")}
                >
                  <div className="flex items-center">
                    Item
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "item" ? "opacity-100" : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("buyer")}
                >
                  <div className="flex items-center">
                    Buyer
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "buyer"
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "amount"
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown
                      className={`ml-1 h-4 w-4 ${
                        sortConfig.key === "date" ? "opacity-100" : "opacity-50"
                      }`}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`transition-colors duration-150 ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 flex-shrink-0 rounded overflow-hidden ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <img
                            src={payment.image || "/placeholder.svg"}
                            alt={payment.item}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{payment.item}</div>
                          <div
                            className={`text-xs truncate max-w-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {payment.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.buyer}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "pending"
                            ? isDarkMode
                              ? "bg-yellow-900/30 text-yellow-200"
                              : "bg-yellow-100 text-yellow-800"
                            : isDarkMode
                            ? "bg-green-900/30 text-green-200"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {payment.status === "pending" ? (
                          <Clock className="w-4 h-4 mr-1" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(payment, "payment")}
                          className={`transition-colors duration-300 flex items-center ${
                            isDarkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </button>
                        <button
                          onClick={() => handleContactBuyer(payment.buyer)}
                          className={`transition-colors duration-300 flex items-center ${
                            isDarkMode
                              ? "text-green-400 hover:text-green-300"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" /> Contact
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    <div className="flex flex-col items-center py-6">
                      <AlertCircle
                        className={`w-12 h-12 mb-2 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <p>No payments received yet</p>
                      {(searchTerm ||
                        dateFilter.from ||
                        dateFilter.to ||
                        filterOptions.minAmount ||
                        filterOptions.maxAmount ||
                        filterOptions.status !== "all") && (
                        <button
                          onClick={resetFilters}
                          className={`mt-2 hover:underline ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={`col-span-full flex flex-col items-center justify-center py-12 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-md`}
        >
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No auctions found</h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            You haven't created any auctions yet.
          </p>
          <button
            onClick={handleCreateAuction}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Auction
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedItem?.type === "payment"
            ? "Payment Details"
            : "Auction Details"
        }
      >
        <>
          {selectedItem && selectedItem.type === "payment" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                    selectedItem.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  }`}
                >
                  {selectedItem.status === "pending" ? (
                    <Clock className="w-4 h-4 mr-1" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  )}
                  {selectedItem.status.charAt(0).toUpperCase() +
                    selectedItem.status.slice(1)}
                </span>

                <span className="font-bold text-green-600 dark:text-green-400">
                  ${selectedItem.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center">
                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.item}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{selectedItem.item}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="font-medium">{selectedItem.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Buyer
                  </p>
                  <p className="font-medium">{selectedItem.buyer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date
                  </p>
                  <p className="font-medium">{selectedItem.date}</p>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleContactBuyer(selectedItem.buyer)}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Contact Buyer
                  </button>

                  <button
                    onClick={() => {
                      setToast({
                        message: "Receipt downloaded successfully.",
                        type: "success",
                      });
                      setIsModalOpen(false);
                    }}
                    className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Download Receipt
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedItem && selectedItem.type === "auction" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                    selectedItem.status === "active"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {selectedItem.status === "active" ? (
                    <Clock className="w-4 h-4 mr-1" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  )}
                  {selectedItem.status.charAt(0).toUpperCase() +
                    selectedItem.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center">
                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.item}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{selectedItem.item}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Starting Bid
                  </p>
                  <p className="font-medium">
                    ${selectedItem.startingBid?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current Bid
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    ${selectedItem.currentBid?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedItem.status === "active" ? "Bids" : "Buyer"}
                  </p>
                  <p className="font-medium">
                    {selectedItem.status === "active"
                      ? selectedItem.bids
                      : selectedItem.bidder}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedItem.status === "active" ? "Ends on" : "Ended on"}
                  </p>
                  <p className="font-medium">{selectedItem.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Views
                  </p>
                  <p className="font-medium">{selectedItem.views}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Bid Increase
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {selectedItem.startingBid &&
                      selectedItem.currentBid &&
                      Math.round(
                        ((selectedItem.currentBid - selectedItem.startingBid) /
                          selectedItem.startingBid) *
                          100
                      )}
                    %
                  </p>
                </div>
              </div>

              {selectedItem.paymentStatus && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Payment Status
                  </p>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        selectedItem.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                      }`}
                    >
                      {selectedItem.paymentStatus === "completed" ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <Clock className="w-4 h-4 mr-1" />
                      )}
                      {selectedItem.paymentStatus.charAt(0).toUpperCase() +
                        selectedItem.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t dark:border-gray-700">
                {selectedItem.status === "active" ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleEditAuction(selectedItem.id)}
                      className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit Auction
                    </button>

                    <button
                      onClick={() => handleShareAuction(selectedItem.id)}
                      className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleContactBuyer(selectedItem.bidder)}
                      className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" /> Contact Buyer
                    </button>

                    <button
                      onClick={() => {
                        setToast({
                          message: "Auction relisted successfully.",
                          type: "success",
                        });
                        setIsModalOpen(false);
                      }}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors duration-300 flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Relist Similar
                    </button>
                  </div>
                )}

                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>
                    Need help with this auction? Our support team is available
                    24/7 hours.
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      </Modal>

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
