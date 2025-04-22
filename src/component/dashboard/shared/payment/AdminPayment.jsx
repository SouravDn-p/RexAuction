import { useState, useEffect, useRef, useContext } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Search,
  Truck,
  AlertCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  X,
  Filter,
  Calendar,
  Printer,
  BarChart3,
  RefreshCw,
  FileText,
  Eye,
  Trash2,
  Settings,
  Bell,
} from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import useAuth from "../../../../hooks/useAuth";
import ThemeContext from "../../../Context/ThemeContext";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center max-w-sm p-4 text-white rounded-lg shadow-lg animate-slideIn transition-all duration-300 ease-in-out transform hover:scale-105">
      <div className={`${bgColor} p-2 rounded-l-lg h-full flex items-center`}>
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : type === "error" ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
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

export default function AdminPayment() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    minAmount: "",
    maxAmount: "",
    status: "all",
  });
  const { isDarkMode } = useContext(ThemeContext);

  const chartRef = useRef(null);
  const dateFilterRef = useRef(null);
  const filterRef = useRef(null);

  const [stats, setStats] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    completedPayments: 0,
    totalAmount: 0,
  });

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

  const StatsCard = ({ title, value, icon, color, isDarkMode }) => {
    const Icon = icon;

    return (
      <div
        className={`rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border-l-4 ${color} ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full bg-opacity-20 ${color.replace(
              "border-",
              "bg-"
            )} mr-4`}
          >
            <Icon className={`w-6 h-6 ${color.replace("border-", "text-")}`} />
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
      </div>
    );
  };

  // Mock data for admin payments
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
      notes: "Customer requested express shipping",
    },
    {
      id: 2,
      buyer: "Mike Johnson",
      seller: "Sarah Williams",
      amount: 850,
      item: "Antique Vase",
      date: "2023-04-12",
      status: "completed",
      deliveryStatus: "delivered",
      auctionId: "A1002",
      paymentMethod: "PayPal",
      notes: "Fragile item, handle with care",
    },
    {
      id: 3,
      buyer: "Emily Davis",
      seller: "Robert Brown",
      amount: 3200,
      item: "Art Painting",
      date: "2023-04-10",
      status: "completed",
      deliveryStatus: "in transit",
      auctionId: "A1003",
      paymentMethod: "Bank Transfer",
      notes: "Insurance included",
    },
    {
      id: 4,
      buyer: "Alex Wilson",
      seller: "Lisa Taylor",
      amount: 750,
      item: "Collectible Coins",
      date: "2023-04-08",
      status: "pending",
      auctionId: "A1004",
      paymentMethod: "Credit Card",
      notes: "",
    },
    {
      id: 5,
      buyer: "David Miller",
      seller: "Jennifer Clark",
      amount: 1800,
      item: "Rare Book",
      date: "2023-04-05",
      status: "pending",
      auctionId: "A1005",
      paymentMethod: "PayPal",
      notes: "First edition",
    },
    {
      id: 6,
      buyer: "Sophia Lee",
      seller: "William Johnson",
      amount: 920,
      item: "Vintage Camera",
      date: "2023-04-03",
      status: "completed",
      deliveryStatus: "delivered",
      auctionId: "A1006",
      paymentMethod: "Credit Card",
      notes: "Includes original case",
    },
    {
      id: 7,
      buyer: "Oliver Brown",
      seller: "Emma Wilson",
      amount: 1450,
      item: "Antique Clock",
      date: "2023-04-01",
      status: "pending",
      auctionId: "A1007",
      paymentMethod: "Bank Transfer",
      notes: "Requires restoration",
    },
    {
      id: 8,
      buyer: "Isabella Martinez",
      seller: "James Taylor",
      amount: 2100,
      item: "Vintage Typewriter",
      date: "2023-03-28",
      status: "completed",
      deliveryStatus: "in transit",
      auctionId: "A1008",
      paymentMethod: "PayPal",
      notes: "Working condition",
    },
    {
      id: 9,
      buyer: "Lucas Garcia",
      seller: "Olivia Moore",
      amount: 1750,
      item: "Antique Furniture",
      date: "2023-03-25",
      status: "pending",
      auctionId: "A1009",
      paymentMethod: "Credit Card",
      notes: "Pickup only",
    },
    {
      id: 10,
      buyer: "Mia Robinson",
      seller: "Noah Anderson",
      amount: 3500,
      item: "Luxury Watch",
      date: "2023-03-22",
      status: "completed",
      deliveryStatus: "delivered",
      auctionId: "A1010",
      paymentMethod: "Bank Transfer",
      notes: "Includes certificate of authenticity",
    },
  ];

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPayments(mockPayments);

      // Calculate stats
      const total = mockPayments.length;
      const pending = mockPayments.filter((p) => p.status === "pending").length;
      const completed = mockPayments.filter(
        (p) => p.status === "completed"
      ).length;
      const totalAmount = mockPayments.reduce((sum, p) => sum + p.amount, 0);

      setStats({
        totalPayments: total,
        pendingPayments: pending,
        completedPayments: completed,
        totalAmount: totalAmount,
      });

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

  // Get sorted and filtered data
  const getSortedData = () => {
    let filteredData = [...payments];

    // Filter by tab
    if (activeTab !== "all") {
      filteredData = filteredData.filter(
        (payment) => payment.status === activeTab
      );
    }

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter(
        (payment) =>
          payment.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.auctionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateFilter.from && dateFilter.to) {
      const fromDate = new Date(dateFilter.from);
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" day

      filteredData = filteredData.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= fromDate && paymentDate <= toDate;
      });
    }

    // Apply amount filters
    if (filterOptions.minAmount) {
      filteredData = filteredData.filter(
        (payment) => payment.amount >= parseFloat(filterOptions.minAmount)
      );
    }

    if (filterOptions.maxAmount) {
      filteredData = filteredData.filter(
        (payment) => payment.amount <= parseFloat(filterOptions.maxAmount)
      );
    }

    // Sort data
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const sortedData = getSortedData();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleDeliveryAction = (paymentId, action) => {
    // In a real app, this would be an API call
    const updatedPayments = payments.map((payment) => {
      if (payment.id === paymentId) {
        if (action === "approve") {
          return { ...payment, status: "completed" };
        } else if (action === "place-delivery") {
          return { ...payment, deliveryStatus: "in transit" };
        } else if (action === "mark-delivered") {
          return { ...payment, deliveryStatus: "delivered" };
        }
      }
      return payment;
    });

    setPayments(updatedPayments);
    setToast({
      message: `Payment ${paymentId} ${
        action === "approve"
          ? "approved"
          : action === "place-delivery"
          ? "delivery placed"
          : "marked as delivered"
      } successfully`,
      type: "success",
    });
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const exportData = () => {
    // In a real app, this would generate a CSV or PDF
    setToast({
      message: "Export started. File will download shortly.",
      type: "info",
    });
  };

  const printData = () => {
    setToast({
      message: "Preparing print view...",
      type: "info",
    });
    // In a real app, this would open a print dialog
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const selectAllRows = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map((item) => item.id));
    }
  };

  const bulkAction = (action) => {
    if (selectedRows.length === 0) {
      setToast({
        message: "Please select at least one payment",
        type: "error",
      });
      return;
    }

    if (action === "approve") {
      const updatedPayments = payments.map((payment) =>
        selectedRows.includes(payment.id) && payment.status === "pending"
          ? { ...payment, status: "completed" }
          : payment
      );
      setPayments(updatedPayments);
      setToast({
        message: `${selectedRows.length} payments approved successfully`,
        type: "success",
      });
    } else if (action === "delete") {
      // In a real app, this would be an API call with confirmation
      setToast({
        message: `${selectedRows.length} payments marked for deletion`,
        type: "info",
      });
    }

    setSelectedRows([]);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter({ from: null, to: null });
    setFilterOptions({
      minAmount: "",
      maxAmount: "",
      status: "all",
    });
    setActiveTab("pending");
    setCurrentPage(1);
    setSortConfig({ key: null, direction: null });

    setToast({
      message: "All filters have been reset",
      type: "info",
    });
  };

  // Simple chart component
  const SimpleChart = () => {
    // In a real app, you would use a proper chart library like Chart.js or Recharts
    const pendingHeight = (stats.pendingPayments / stats.totalPayments) * 100;
    const completedHeight =
      (stats.completedPayments / stats.totalPayments) * 100;

    return (
      <div
        className={`p-4 ${
          isDarkMode ? "bg-white" : "bg-gray-800"
        }   rounded-lg shadow-md`}
      >
        <h3 className="text-lg font-medium mb-4">Payment Status Overview</h3>
        <div className="flex items-end h-40 space-x-8">
          <div className="flex flex-col items-center">
            <div
              className="w-16 bg-yellow-500 rounded-t-md"
              style={{ height: `${pendingHeight}%` }}
            ></div>
            <p className="mt-2 text-sm">Pending</p>
            <p className="font-bold">{stats.pendingPayments}</p>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-16 bg-green-500 rounded-t-md"
              style={{ height: `${completedHeight}%` }}
            ></div>
            <p className="mt-2 text-sm">Completed</p>
            <p className="font-bold">{stats.completedPayments}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full p-4 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <CreditCard className="mr-2" /> Payment Management
        </h2>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search payments..."
              className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 w-full md:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative" ref={dateFilterRef}>
            <button
              onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center"
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
                      className={`w-full p-2 rounded border 
  ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}
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
                      className={`w-full p-2 rounded border 
  ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}
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
                      className={`text-sm hover:text-gray-800 dark:hover:text-gray-200 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
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
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center"
              title="More filters"
            >
              <Filter className="w-5 h-5" />
              {(filterOptions.minAmount || filterOptions.maxAmount) && (
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
                      className={`w-full p-2 rounded border 
  ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}
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
                      className={`w-full p-2 rounded border 
  ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}
                      value={filterOptions.maxAmount}
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          maxAmount: e.target.value,
                        })
                      }
                    />
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
                      className={`text-sm hover:text-gray-800 dark:hover:text-gray-200 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
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
            onClick={exportData}
            className={`p-2 rounded-lg border transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
            }`}
            title="Export data"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={printData}
            className={`p-2 rounded-lg border transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
            }`}
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowChart(!showChart)}
            className={`p-2 rounded-lg border transition-colors duration-300 ${
              showChart
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                : isDarkMode
                ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
            }`}
            title="Toggle chart view"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <button
            onClick={refreshData}
            className={`p-2 rounded-lg border transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                : "bg-white border-gray-300 hover:bg-gray-100 text-gray-900"
            } ${isRefreshing ? "animate-spin" : ""}`}
            title="Refresh data"
            disabled={isRefreshing}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={CreditCard}
          color="border-blue-500"
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={Clock}
          color="border-yellow-500"
        />
        <StatsCard
          title="Completed Payments"
          value={stats.completedPayments}
          icon={CheckCircle}
          color="border-green-500"
        />
        <StatsCard
          title="Total Amount"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={DollarSign}
          color="border-purple-500"
        />
      </div>

      {/* Chart View */}
      {showChart && (
        <div className="mb-6 animate-fadeIn" ref={chartRef}>
          <SimpleChart />
        </div>
      )}

      <div className="mb-6">
        <div className="flex space-x-2 border-b dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "pending"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "completed"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Payments
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm ||
        dateFilter.from ||
        dateFilter.to ||
        filterOptions.minAmount ||
        filterOptions.maxAmount) && (
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

          <button
            onClick={resetFilters}
            className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedRows.length}{" "}
              {selectedRows.length === 1 ? "payment" : "payments"} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => bulkAction("approve")}
                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors duration-300 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Approve All
              </button>
              <button
                onClick={() => bulkAction("delete")}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors duration-300 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
              <button
                onClick={() => setSelectedRows([])}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            className={`overflow-x-auto rounded-lg border shadow-sm 
            ${
              isDarkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <table
              className={`min-w-full divide-y ${
                isDarkMode ? "divide-gray-200" : "divide-gray-700"
              } `}
            >
              <thead
                className={`${
                  isDarkMode
                    ? "bg-gray-50 text-black"
                    : "bg-gray-800  text-white"
                }  `}
              >
                <tr>
                  <th scope="col" className="px-3 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                        checked={
                          selectedRows.length === currentItems.length &&
                          currentItems.length > 0
                        }
                        onChange={selectAllRows}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("auctionId")}
                  >
                    <div className="flex items-center">
                      Auction ID
                      <ArrowUpDown
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.key === "auctionId"
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("item")}
                  >
                    <div className="flex items-center">
                      Item
                      <ArrowUpDown
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.key === "item"
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Buyer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Seller
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
                          sortConfig.key === "date"
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.key === "status"
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((payment) => (
                    <tr
                      key={payment.id}
                      className={`transition-colors duration-150 ${
                        isDarkMode ? "hover:bg-gray-50" : "hover:bg-gray-700"
                      }  dark: ${
                        selectedRows.includes(payment.id)
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                          checked={selectedRows.includes(payment.id)}
                          onChange={() => toggleRowSelection(payment.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payment.auctionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.buyer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.seller}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
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
                        {payment.deliveryStatus && (
                          <span
                            className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.deliveryStatus === "delivered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                            }`}
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            {payment.deliveryStatus.charAt(0).toUpperCase() +
                              payment.deliveryStatus.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {payment.status === "pending" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleDeliveryAction(payment.id, "approve")
                              }
                              className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm flex items-center transition-colors duration-300"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Approve
                            </button>
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-2 py-1 transition-colors duration-300"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            {payment.deliveryStatus !== "delivered" && (
                              <button
                                onClick={() =>
                                  handleDeliveryAction(
                                    payment.id,
                                    "mark-delivered"
                                  )
                                }
                                className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm flex items-center transition-colors duration-300"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                Delivered
                              </button>
                            )}
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-2 py-1 transition-colors duration-300"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-4 text-center text-sm font-medium"
                    >
                      <div className="flex flex-col items-center py-6">
                        <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                        <p>No payments found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedData.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-0">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, sortedData.length)} of{" "}
                {sortedData.length} entries
              </div>
              <div className="flex items-center">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="mr-4 p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } transition-colors duration-300`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageToShow}
                        onClick={() => setCurrentPage(pageToShow)}
                        className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                          currentPage === pageToShow
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } transition-colors duration-300`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Auction ID
                </p>
                <p className="font-medium">{selectedPayment.auctionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Item</p>
                <p className="font-medium">{selectedPayment.item}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Buyer
                </p>
                <p className="font-medium">{selectedPayment.buyer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Seller
                </p>
                <p className="font-medium">{selectedPayment.seller}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Amount
                </p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  ${selectedPayment.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium">{selectedPayment.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment Method
                </p>
                <p className="font-medium">{selectedPayment.paymentMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <div className="flex items-center mt-1">
                <span
                  className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
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
                {selectedPayment.deliveryStatus && (
                  <span
                    className={`ml-2 px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                      selectedPayment.deliveryStatus === "delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                    }`}
                  >
                    <Truck className="w-4 h-4 mr-1" />
                    {selectedPayment.deliveryStatus.charAt(0).toUpperCase() +
                      selectedPayment.deliveryStatus.slice(1)}
                  </span>
                )}
              </div>
            </div>
            {selectedPayment.notes && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Notes
                </p>
                <p className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                  {selectedPayment.notes || "No notes available"}
                </p>
              </div>
            )}
            <div className="pt-4 border-t dark:border-gray-700">
              <h4 className="font-medium mb-2">Actions</h4>
              <div className="flex space-x-2">
                {selectedPayment.status === "pending" ? (
                  <>
                    <button
                      onClick={() => {
                        handleDeliveryAction(selectedPayment.id, "approve");
                        setIsModalOpen(false);
                      }}
                      className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm flex items-center transition-colors duration-300"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => {
                        handleDeliveryAction(
                          selectedPayment.id,
                          "place-delivery"
                        );
                        setIsModalOpen(false);
                      }}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm flex items-center transition-colors duration-300"
                    >
                      <Truck className="w-4 h-4 mr-1" /> Place Delivery
                    </button>
                  </>
                ) : selectedPayment.deliveryStatus !== "delivered" ? (
                  <button
                    onClick={() => {
                      handleDeliveryAction(
                        selectedPayment.id,
                        "mark-delivered"
                      );
                      setIsModalOpen(false);
                    }}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm flex items-center transition-colors duration-300"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Delivered
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No actions available
                  </p>
                )}
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

        @media print {
          body * {
            visibility: hidden;
          }

          table,
          table * {
            visibility: visible;
          }

          table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
