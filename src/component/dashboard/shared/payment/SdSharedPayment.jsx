"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Truck,
  ShoppingBag,
  User,
  Filter,
  Search,
  ChevronDown,
  Moon,
  Sun,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CreditCard,
} from "lucide-react";
import useAuth from "../../../../hooks/useAuth";

// Mock data for demonstration
const mockPayments = [
  {
    id: 1,
    auctionId: "A001",
    amount: 1250,
    status: "pending",
    buyer: "John Doe",
    buyer_img: "https://randomuser.me/api/portraits/men/1.jpg",
    seller: "Jane Smith",
    seller_img: "https://randomuser.me/api/portraits/women/2.jpg",
    date: "2023-04-15",
    item: "Vintage Watch",
  },
  {
    id: 2,
    auctionId: "A002",
    amount: 850,
    status: "completed",
    buyer: "Mike Johnson",
    buyer_img: "https://randomuser.me/api/portraits/men/3.jpg",
    seller: "Sarah Williams",
    seller_img: "https://randomuser.me/api/portraits/women/4.jpg",
    date: "2023-04-10",
    item: "Antique Vase",
    deliveryStatus: "delivered",
  },
  {
    id: 3,
    auctionId: "A003",
    amount: 3200,
    status: "pending",
    buyer: "Emily Brown",
    buyer_img: "https://randomuser.me/api/portraits/women/5.jpg",
    seller: "David Wilson",
    seller_img: "https://randomuser.me/api/portraits/men/6.jpg",
    date: "2023-04-18",
    item: "Rare Coin Collection",
  },
  {
    id: 4,
    auctionId: "A004",
    amount: 750,
    status: "completed",
    buyer: "Alex Turner",
    buyer_img: "https://randomuser.me/api/portraits/men/7.jpg",
    seller: "Jane Smith",
    seller_img: "https://randomuser.me/api/portraits/women/2.jpg",
    date: "2023-04-05",
    item: "Art Print",
    deliveryStatus: "in transit",
  },
  {
    id: 5,
    auctionId: "A005",
    amount: 1800,
    status: "pending",
    buyer: "John Doe",
    buyer_img: "https://randomuser.me/api/portraits/men/1.jpg",
    seller: "David Wilson",
    seller_img: "https://randomuser.me/api/portraits/men/6.jpg",
    date: "2023-04-20",
    item: "Vintage Camera",
  },
  {
    id: 6,
    auctionId: "A006",
    amount: 920,
    status: "completed",
    buyer: "Emily Brown",
    buyer_img: "https://randomuser.me/api/portraits/women/5.jpg",
    seller: "Sarah Williams",
    seller_img: "https://randomuser.me/api/portraits/women/4.jpg",
    date: "2023-04-08",
    item: "Collectible Figurine",
    deliveryStatus: "pending",
  },
];

const mockAuctions = [
  {
    id: "A001",
    item: "Vintage Watch",
    startPrice: 1000,
    finalPrice: 1250,
    status: "closed",
    date: "2023-04-14",
    bids: 8,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "A003",
    item: "Rare Coin Collection",
    startPrice: 2500,
    finalPrice: 3200,
    status: "closed",
    date: "2023-04-17",
    bids: 12,
    image:
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "A005",
    item: "Vintage Camera",
    startPrice: 1500,
    finalPrice: 1800,
    status: "closed",
    date: "2023-04-19",
    bids: 6,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "A007",
    item: "Antique Furniture",
    startPrice: 2000,
    finalPrice: null,
    status: "active",
    date: "2023-04-21",
    bids: 3,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
  },
];

// Stats data
const statsData = [
  {
    label: "Total Revenue",
    value: "$8,750",
    icon: <DollarSign className="w-5 h-5" />,
    change: "+12.3%",
  },
  {
    label: "Active Auctions",
    value: "24",
    icon: <BarChart3 className="w-5 h-5" />,
    change: "+4.6%",
  },
  {
    label: "Completed Sales",
    value: "156",
    icon: <CheckCircle className="w-5 h-5" />,
    change: "+18.2%",
  },
  {
    label: "Pending Payments",
    value: "12",
    icon: <Clock className="w-5 h-5" />,
    change: "-2.4%",
  },
];

const SdSharedPayment = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { dbUser, user, loading, setLoading } = useAuth();
  const [deliveryDetails, setDeliveryDetails] = useState({
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      // Check user's system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filter payments based on role, tab, and search term
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.auctionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.seller.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && payment.status === "pending") ||
      (activeTab === "completed" && payment.status === "completed");

    const matchesRole =
      dbUser?.role === "admin" ||
      (dbUser?.role === "seller" && payment.seller === user?.displayName) ||
      (dbUser?.role === "buyer" && payment.buyer === user?.displayName);

    return matchesSearch && matchesTab && matchesRole;
  });

  // Filter auctions based on role and search term
  const filteredAuctions = mockAuctions.filter((auction) => {
    const matchesSearch =
      auction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.item.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      dbUser?.role === "admin" ||
      (dbUser?.role === "seller" &&
        mockPayments.some(
          (p) => p.auctionId === auction.id && p.seller === user?.displayName
        ));

    return matchesSearch && matchesRole && activeTab === "auctions";
  });

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    // In a real app, you would update the payment with delivery details here
    console.log("Delivery details submitted:", {
      paymentId: selectedPayment.id,
      ...deliveryDetails,
    });
    setShowDeliveryModal(false);
  };

  const openDeliveryModal = (payment) => {
    setSelectedPayment(payment);
    setShowDeliveryModal(true);
  };

  const getStatusBadge = (status, deliveryStatus) => {
    if (status === "pending") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 transition-colors duration-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    } else if (status === "completed") {
      if (deliveryStatus === "delivered") {
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 transition-colors duration-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      } else if (deliveryStatus === "in transit") {
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 transition-colors duration-200">
            <Truck className="w-3 h-3 mr-1" />
            In Transit
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-800 dark:text-fuchsia-200 transition-colors duration-200">
            <DollarSign className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      }
    }
  };

  const renderTabs = () => {
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`${
              activeTab === "pending"
                ? "border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
          >
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Pending Payments
            </div>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`${
              activeTab === "completed"
                ? "border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
          >
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed Payments
            </div>
          </button>
          {(dbUser?.role === "admin" || dbUser?.role === "seller") && (
            <button
              onClick={() => setActiveTab("auctions")}
              className={`${
                activeTab === "auctions"
                  ? "border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
            >
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Auctions
              </div>
            </button>
          )}
          <button
            onClick={() => setActiveTab("all")}
            className={`${
              activeTab === "all"
                ? "border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
          >
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              All Payments
            </div>
          </button>
        </nav>
      </div>
    );
  };

  const renderRoleBadge = () => {
    let color, icon, bgColor, textColor;

    switch (dbUser?.role) {
      case "admin":
        bgColor = "bg-fuchsia-100 dark:bg-fuchsia-900";
        textColor = "text-fuchsia-800 dark:text-fuchsia-200";
        icon = <User className="w-4 h-4 mr-1" />;
        break;
      case "seller":
        bgColor = "bg-sky-100 dark:bg-sky-900";
        textColor = "text-sky-800 dark:text-sky-200";
        icon = <ShoppingBag className="w-4 h-4 mr-1" />;
        break;
      case "buyer":
        bgColor = "bg-emerald-100 dark:bg-emerald-900";
        textColor = "text-emerald-800 dark:text-emerald-200";
        icon = <DollarSign className="w-4 h-4 mr-1" />;
        break;
      default:
        bgColor = "bg-gray-100 dark:bg-gray-800";
        textColor = "text-gray-800 dark:text-gray-200";
        icon = <User className="w-4 h-4 mr-1" />;
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} transition-colors duration-200`}
      >
        {icon}
        {dbUser?.role?.charAt(0).toUpperCase() + dbUser?.role?.slice(1)} View
      </span>
    );
  };

  const renderStats = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div
                  className={`rounded-full p-3 ${
                    index === 0
                      ? "bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-600 dark:text-fuchsia-300"
                      : index === 1
                      ? "bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300"
                      : index === 2
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300"
                      : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
                  } transition-colors duration-200`}
                >
                  {stat.icon}
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      {stat.value}
                    </p>
                    <p
                      className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith("+")
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      } transition-colors duration-200`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAuctionsGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <div
              key={auction.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-100 dark:border-gray-700 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.item}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      auction.status === "active"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    } transition-colors duration-200`}
                  >
                    {auction?.status?.charAt(0).toUpperCase() +
                      auction.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      {auction.item}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      ID: {auction.id}
                    </p>
                  </div>
                  <div className="bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-800 dark:text-fuchsia-200 px-2 py-1 rounded text-sm font-medium transition-colors duration-200">
                    {auction.bids} bids
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Start Price
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                      ${auction.startPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Final Price
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                      {auction.finalPrice
                        ? `$${auction.finalPrice.toFixed(2)}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Date
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                      {auction.date}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600 transition-colors duration-200">
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 transition-colors duration-200">
              <ShoppingBag className="h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">
              No auctions found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderPaymentsTable = () => {
    if (activeTab === "auctions") {
      return renderAuctionsGrid();
    }

    return (
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6 transition-colors duration-200"
                    >
                      Payment ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      Buyer
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      Seller
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      Status
                    </th>
                    {dbUser?.role === "admin" && (
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6 transition-colors duration-200">
                          #{payment.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">
                          <div className="flex items-center">
                            <span className="font-medium">{payment.item}</span>
                            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 transition-colors duration-200">
                              {payment.auctionId}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">
                          <div className="flex items-center">
                            <img
                              src={payment.buyer_img || "/placeholder.svg"}
                              alt={payment.buyer}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            {payment.buyer}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">
                          <div className="flex items-center">
                            <img
                              src={payment.seller_img || "/placeholder.svg"}
                              alt={payment.seller}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            {payment.seller}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                            {payment.date}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">
                          {getStatusBadge(
                            payment.status,
                            payment.deliveryStatus
                          )}
                        </td>
                        {dbUser?.role === "admin" && (
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {payment.status === "pending" ? (
                              <button
                                onClick={() => openDeliveryModal(payment)}
                                className="text-fuchsia-600 hover:text-fuchsia-900 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 flex items-center transition-colors duration-200"
                              >
                                <Truck className="w-4 h-4 mr-1" />
                                Place Delivery
                              </button>
                            ) : (
                              <button
                                className="text-gray-400 dark:text-gray-500 cursor-not-allowed flex items-center transition-colors duration-200"
                                disabled
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Completed
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={dbUser?.role === "admin" ? 8 : 7}
                        className="px-3 py-12 text-sm text-gray-500 dark:text-gray-400 text-center transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 transition-colors duration-200">
                            <CreditCard className="h-8 w-8 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                            No payments found
                          </p>
                          <p className="mt-1 text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      } transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600 dark:from-fuchsia-400 dark:to-pink-400">
                Rex Auction
              </span>{" "}
              Payment Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Manage all payments and deliveries in one place
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Stats section */}
        {dbUser?.role === "admin" && renderStats()}

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors duration-200 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">
                Payment Management
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                View and manage all transaction details
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {renderRoleBadge()}
              <div className="relative">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 dark:focus:ring-offset-gray-900 transition-colors duration-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-64 mb-4 sm:mb-0">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-fuchsia-500 focus:border-fuchsia-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {activeTab === "auctions"
                    ? filteredAuctions.length
                    : filteredPayments.length}{" "}
                  {activeTab === "auctions" ? "auctions" : "payments"} found
                </span>
              </div>
            </div>

            {renderTabs()}
            {renderPaymentsTable()}
          </div>
        </div>
      </div>

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 transition-colors duration-200">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900 transition-colors duration-200">
                  <Truck className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-300 transition-colors duration-200" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white transition-colors duration-200">
                    Place Delivery
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Enter the delivery details for payment #
                      {selectedPayment?.id} - {selectedPayment?.item}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleDeliverySubmit} className="mt-5 sm:mt-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="tracking-number"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Tracking Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="tracking-number"
                        id="tracking-number"
                        className="shadow-sm focus:ring-fuchsia-500 focus:border-fuchsia-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                        value={deliveryDetails.trackingNumber}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            trackingNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="carrier"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Carrier
                    </label>
                    <div className="mt-1">
                      <select
                        id="carrier"
                        name="carrier"
                        className="shadow-sm focus:ring-fuchsia-500 focus:border-fuchsia-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                        value={deliveryDetails.carrier}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            carrier: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select a carrier</option>
                        <option value="fedex">FedEx</option>
                        <option value="ups">UPS</option>
                        <option value="usps">USPS</option>
                        <option value="dhl">DHL</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="estimated-delivery"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                    >
                      Estimated Delivery Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="estimated-delivery"
                        id="estimated-delivery"
                        className="shadow-sm focus:ring-fuchsia-500 focus:border-fuchsia-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                        value={deliveryDetails.estimatedDelivery}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            estimatedDelivery: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-fuchsia-600 text-base font-medium text-white hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600 dark:focus:ring-offset-gray-900 sm:col-start-2 sm:text-sm transition-colors duration-200"
                  >
                    Place Delivery
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 dark:focus:ring-offset-gray-900 sm:mt-0 sm:col-start-1 sm:text-sm transition-colors duration-200"
                    onClick={() => setShowDeliveryModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SdSharedPayment;
