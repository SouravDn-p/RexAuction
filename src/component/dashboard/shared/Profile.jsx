import { useContext, useState } from "react";
import SdProfile from "./SdProfile";
import ThemeContext from "../../Context/ThemeContext";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import useAuth from "../../../hooks/useAuth";
import coverPhoto from "../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../LoadingSpinner";

// Hardcoded profile data for the UI elements
const profileData = {
  user: {
    location: "Dhaka, BD",
    memberSince: "2024",
    coverImage: { coverPhoto },
  },
  paymentMethods: [
    { id: 1, cardNumber: "•••• 4385", provider: "Visa" },
    { id: 2, cardNumber: "•••• 1234", provider: "Mastercard" },
  ],
  recentActivity: [
    {
      id: 1,
      item: "Vintage Rolex Submariner",
      price: "$8,500",
      time: "1 hour ago",
      status: "Won",
      image: "https://i.ibb.co.com/gZ2qhXjs/images-1.jpg",
    },
    {
      id: 2,
      item: "Nike Air Jordan 1 Retro",
      price: "$2,800",
      time: "3 hours ago",
      status: "Active",
      image: "https://i.ibb.co.com/V0Yxw7Mg/download.jpg",
    },
    {
      id: 3,
      item: "Leica M6 Classic",
      price: "$4,200",
      time: "6 hours ago",
      status: "Outbid",
      image: "https://i.ibb.co.com/N6rH502K/download-1.jpg",
    },
  ],
  watchingNow: [
    {
      id: 1,
      item: "Antique Pocket Watch",
      timeLeft: "3h 25m",
      image: "https://i.ibb.co.com/KSCtW5n/download-2.jpg",
    },
    {
      id: 2,
      item: "Art Deco Vase",
      timeLeft: "2d 4h",
      image: "https://i.ibb.co.com/60Q0GGYP/download-3.jpg",
    },
    {
      id: 3,
      item: "Vintage Camera",
      timeLeft: "5d 12h",
      image: "https://i.ibb.co.com/RGwFXk1S/download-4.jpg",
    },
  ],
  biddingHistory: [
    {
      id: 1,
      item: "Vintage Rolex Submariner",
      auction: "Luxury Watches",
      bidAmount: "$8,500",
      date: "Jan 15, 2024",
      status: "Won",
    },
    {
      id: 2,
      item: "Nike Air Jordan 1 Retro",
      auction: "Rare Sneakers",
      bidAmount: "$2,800",
      date: "Jan 14, 2024",
      status: "Active",
    },
    {
      id: 3,
      item: "Leica M6 Classic",
      auction: "Vintage Cameras",
      bidAmount: "$4,200",
      date: "Jan 13, 2024",
      status: "Outbid",
    },
    {
      id: 4,
      item: "Art Deco Vase",
      auction: "Antique Collection",
      bidAmount: "$1,900",
      date: "Jan 12, 2024",
      status: "Won",
    },
  ],
};

const Profile = () => {
  // Get real user data from auth context
  const { user, loading: authLoading, dbUser, setDbUser } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const { isDarkMode } = useContext(ThemeContext);

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Won":
        return (
          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-md">
            Won
          </span>
        );
      case "Active":
        return (
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-md">
            Active
          </span>
        );
      case "Outbid":
        return (
          <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-md text-black bg-white">
            Outbid
          </span>
        );
      default:
        return (
          <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-md text-black bg-white">
            {status}
          </span>
        );
    }
  };

  const boxStyle = `border rounded-lg shadow-sm ${
    isDarkMode
      ? "bg-gray-800 hover:bg-gray-600 border-gray-700"
      : "bg-white border"
  }`;

  const titleStyle = `text-2xl font-bold ${
    isDarkMode ? "text-white" : "text-black"
  }`;

  const { ref, inView } = useInView({ triggerOnce: true });
  const labelStyle = `text-sm ${isDarkMode ? "text-gray-300" : "text-black"}`;

  if (authLoading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      } transition-all duration-300 p-4 md:p-6`}
    >
      {/* Profile Banner */}
      <div
        className="relative h-[200px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${coverPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <button className="absolute right-4 top-4 bg-white text-black hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium flex items-center">
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
      </div>

      {/* Profile Info */}
      <div className="px-6">
        <div
          className={`flex flex-col md:flex-row items-center gap-6 -mt-16 mb-6 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {/* Profile Picture - Using real user photo */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-28 h-28 rounded-full border-4 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-white bg-gray-200"
              } overflow-hidden`}
            >
              <img
                src={
                  user?.photoURL ||
                  "https://i.ibb.co/BmxHqZm/Screenshot-2025-03-23-164850.png"
                }
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:text-left text-center w-full">
          {/* Profile Information - Using real user name */}
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {user?.displayName || "No name"}
          </h1>
          <p
            className={`text-gray-500 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Email: {user?.email || "No email"}
            {dbUser?.location ? (
              <span> • Location: {dbUser?.location}</span>
            ) : (
              ""
            )}{" "}
            {dbUser?.memberSince ? (
              <span> • Member Since : {dbUser?.memberSince}</span>
            ) : (
              ""
            )}{" "}
          </p>

          <div className="mt-4">
            <button
              className={`px-3 py-1 text-sm border rounded-md ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                  : "border-gray-300 bg-white text-black hover:bg-gray-50"
              }`}
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Stats */}
        <div className="grid mt-5 grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Auctions Won */}
          <div className={boxStyle}>
            <div className="p-4 text-center">
              <div className={titleStyle}>
                <CountUp
                  end={dbUser?.AuctionsWon}
                  duration={3.5}
                  enableScrollSpy
                />
              </div>
              <div className={labelStyle}>Auctions Won</div>
            </div>
          </div>

          {/* Active Bids */}
          <div className={boxStyle}>
            <div className="p-4 text-center">
              <div className={titleStyle}>
                <CountUp
                  end={dbUser?.ActiveBids}
                  duration={3.5}
                  enableScrollSpy
                />
              </div>
              <div className={labelStyle}>Active Bids</div>
            </div>
          </div>

          {/* Success Rate */}
          <div className={boxStyle}>
            <div className="p-4 text-center">
              <div className={titleStyle}>
                <CountUp end={0} duration={3.5} suffix=" %" enableScrollSpy />
              </div>
              <div className={labelStyle}>Success Rate</div>
            </div>
          </div>

          {/* Total Spent */}
          <div className={boxStyle}>
            <div className="p-4 text-center">
              <div className={titleStyle}>
                <CountUp
                  end={dbUser?.totalSpent}
                  duration={1.5}
                  prefix="$ "
                  enableScrollSpy
                />
              </div>
              <div className={labelStyle}>Total Spent</div>
            </div>
          </div>
        </div>

        {/* Main Content here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div
              ref={ref}
              className={`border rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Account Balance
                </h2>
              </div>
              <div className="p-4">
                <div
                  className={`text-2xl font-bold mb-3 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  {inView ? (
                    <CountUp
                      end={dbUser?.accountBalance}
                      duration={1.5}
                      prefix="$ "
                    />
                  ) : (
                    "$ 0"
                  )}
                </div>
                <button className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5v14m-7-7h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add Funds
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className={`border rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Payment Methods
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {profileData.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between p-2 border rounded-md ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        className={`w-4 h-4 mr-2 ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2"
                          y="5"
                          width="20"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M2 10h20"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {method.cardNumber}
                      </span>
                    </div>
                    <span
                      className={`text-xs border px-2 py-0.5 rounded-md ${
                        isDarkMode
                          ? "text-white border-gray-400"
                          : "text-black border-gray-300"
                      }`}
                    >
                      {method.provider}
                    </span>
                  </div>
                ))}

                <button
                  className={`w-full text-sm border rounded-md py-1.5 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                      : "border-gray-300 bg-white text-black hover:bg-gray-50"
                  }`}
                >
                  Add New Card
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div
              className={`border rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Recent Activity
                </h2>
              </div>

              <div className="p-4">
                {/* Tabs */}
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {["All", "Bids", "Wins", "Watching"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`h-8 text-xs rounded-md ${
                        activeTab === tab
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : `${
                              isDarkMode
                                ? "border border-gray-600 hover:bg-gray-700 bg-gray-800 text-white"
                                : "border border-gray-300 hover:bg-gray-50 bg-white text-black"
                            }`
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Activities */}
                <div className="space-y-3">
                  {profileData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-md overflow-hidden border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <img
                          src={
                            activity.image ||
                            "/placeholder.svg?height=48&width=48"
                          }
                          alt={activity.item}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {activity.item}
                        </div>
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-black"
                          }`}
                        >
                          {activity.price} • {activity.time}
                        </div>
                      </div>
                      {renderStatusBadge(activity.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Watching Now */}
            <div
              className={`border rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Watching Now
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {profileData.watchingNow.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    } p-2 rounded-md`}
                  >
                    <div
                      className={`w-12 h-12 rounded-md overflow-hidden border ${
                        isDarkMode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={
                          item.image || "/placeholder.svg?height=48&width=48"
                        }
                        alt={item.item}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {item.item}
                      </div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-black"
                        }`}
                      >
                        {item.timeLeft}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bidding History */}
        <div
          className={`border rounded-lg shadow-sm mb-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-base font-medium ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Bidding History
            </h2>
            <button
              className={`h-8 px-2 text-sm flex items-center ${
                isDarkMode ? "text-white bg-gray-700" : "text-black bg-white"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6h18M6 12h12M9 18h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Filter
            </button>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table
                className={`w-full text-sm ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium">Item</th>
                    <th className="pb-2 font-medium">Auction</th>
                    <th className="pb-2 font-medium">Bid Amount</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.biddingHistory.map((bid) => (
                    <tr key={bid.id} className="border-b">
                      <td className="py-3">{bid.item}</td>
                      <td className="py-3">{bid.auction}</td>
                      <td className="py-3">{bid.bidAmount}</td>
                      <td className="py-3">{bid.date}</td>
                      <td className="py-3">{renderStatusBadge(bid.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                className={`flex items-center justify-between text-sm mt-3 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                <div>
                  Showing 1-{profileData.biddingHistory.length} of 127 items
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`h-8 w-8 flex items-center justify-center border rounded-md ${
                      isDarkMode
                        ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-white"
                        : "border-gray-300 hover:bg-gray-50 bg-white text-black"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className={`h-8 w-8 flex items-center justify-center border rounded-md ${
                      isDarkMode
                        ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-white"
                        : "border-gray-300 hover:bg-gray-50 bg-white text-black"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SdProfile />
    </div>
  );
};

export default Profile;
