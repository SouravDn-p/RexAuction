"use client";

import { useState } from "react";
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
} from "lucide-react";

// Mock data for demonstration
const mockPayments = [
  {
    id: 1,
    auctionId: "A001",
    amount: 1250,
    status: "pending",
    buyer: "John Doe",
    seller: "Jane Smith",
    date: "2023-04-15",
    item: "Vintage Watch",
  },
  {
    id: 2,
    auctionId: "A002",
    amount: 850,
    status: "completed",
    buyer: "Mike Johnson",
    seller: "Sarah Williams",
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
    seller: "David Wilson",
    date: "2023-04-18",
    item: "Rare Coin Collection",
  },
  {
    id: 4,
    auctionId: "A004",
    amount: 750,
    status: "completed",
    buyer: "Alex Turner",
    seller: "Jane Smith",
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
    seller: "David Wilson",
    date: "2023-04-20",
    item: "Vintage Camera",
  },
  {
    id: 6,
    auctionId: "A006",
    amount: 920,
    status: "completed",
    buyer: "Emily Brown",
    seller: "Sarah Williams",
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
  },
  {
    id: "A003",
    item: "Rare Coin Collection",
    startPrice: 2500,
    finalPrice: 3200,
    status: "closed",
    date: "2023-04-17",
    bids: 12,
  },
  {
    id: "A005",
    item: "Vintage Camera",
    startPrice: 1500,
    finalPrice: 1800,
    status: "closed",
    date: "2023-04-19",
    bids: 6,
  },
  {
    id: "A007",
    item: "Antique Furniture",
    startPrice: 2000,
    finalPrice: null,
    status: "active",
    date: "2023-04-21",
    bids: 3,
  },
];

const SharedPayment = ({ userRole = "admin", userName = "Jane Smith" }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState({
    trackingNumber: "",
    carrier: "",
    estimatedDelivery: "",
  });

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
      userRole === "admin" ||
      (userRole === "seller" && payment.seller === userName) ||
      (userRole === "buyer" && payment.buyer === userName);

    return matchesSearch && matchesTab && matchesRole;
  });

  // Filter auctions based on role and search term
  const filteredAuctions = mockAuctions.filter((auction) => {
    const matchesSearch =
      auction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.item.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      userRole === "admin" ||
      (userRole === "seller" &&
        mockPayments.some(
          (p) => p.auctionId === auction.id && p.seller === userName
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    } else if (status === "completed") {
      if (deliveryStatus === "delivered") {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      } else if (deliveryStatus === "in transit") {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3 mr-1" />
            In Transit
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <DollarSign className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      }
    }
  };

  const renderTabs = () => {
    return (
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`${
              activeTab === "pending"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending Payments
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`${
              activeTab === "completed"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Completed Payments
          </button>
          {(userRole === "admin" || userRole === "seller") && (
            <button
              onClick={() => setActiveTab("auctions")}
              className={`${
                activeTab === "auctions"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Auctions
            </button>
          )}
          <button
            onClick={() => setActiveTab("all")}
            className={`${
              activeTab === "all"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Payments
          </button>
        </nav>
      </div>
    );
  };

  const renderRoleBadge = () => {
    let color, icon;

    switch (userRole) {
      case "admin":
        color = "bg-purple-100 text-purple-800";
        icon = <User className="w-4 h-4 mr-1" />;
        break;
      case "seller":
        color = "bg-blue-100 text-blue-800";
        icon = <ShoppingBag className="w-4 h-4 mr-1" />;
        break;
      case "buyer":
        color = "bg-green-100 text-green-800";
        icon = <DollarSign className="w-4 h-4 mr-1" />;
        break;
      default:
        color = "bg-gray-100 text-gray-800";
        icon = <User className="w-4 h-4 mr-1" />;
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}
      >
        {icon}
        {userRole.charAt(0).toUpperCase() + userRole.slice(1)} View
      </span>
    );
  };

  const renderPaymentsTable = () => {
    if (activeTab === "auctions") {
      return (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Auction ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Start Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Final Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Bids
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredAuctions.length > 0 ? (
                      filteredAuctions.map((auction) => (
                        <tr key={auction.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {auction.id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {auction.item}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${auction.startPrice.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {auction.finalPrice
                              ? `$${auction.finalPrice.toFixed(2)}`
                              : "-"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                auction.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {auction.status.charAt(0).toUpperCase() +
                                auction.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {auction.date}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {auction.bids}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-3 py-4 text-sm text-gray-500 text-center"
                        >
                          No auctions found
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
    }

    return (
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Payment ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Auction
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Buyer
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Seller
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    {userRole === "admin" && (
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          #{payment.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.auctionId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.item}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.buyer}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.seller}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.date}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getStatusBadge(
                            payment.status,
                            payment.deliveryStatus
                          )}
                        </td>
                        {userRole === "admin" && (
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {payment.status === "pending" ? (
                              <button
                                onClick={() => openDeliveryModal(payment)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              >
                                <Truck className="w-4 h-4 mr-1" />
                                Place Delivery
                              </button>
                            ) : (
                              <button
                                className="text-gray-400 cursor-not-allowed flex items-center"
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
                        colSpan={userRole === "admin" ? 9 : 8}
                        className="px-3 py-4 text-sm text-gray-500 text-center"
                      >
                        No payments found
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
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Payment Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all payments and deliveries in one place
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {renderRoleBadge()}
              <div className="relative">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredPayments.length}{" "}
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
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <Truck className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Place Delivery
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
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
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tracking Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="tracking-number"
                        id="tracking-number"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                      className="block text-sm font-medium text-gray-700"
                    >
                      Carrier
                    </label>
                    <div className="mt-1">
                      <select
                        id="carrier"
                        name="carrier"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estimated Delivery Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="estimated-delivery"
                        id="estimated-delivery"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Place Delivery
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
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

export default SharedPayment;
