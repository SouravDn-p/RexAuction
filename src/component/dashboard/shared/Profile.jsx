import { useContext, useState, useEffect } from "react";
import SdProfile from "./SdProfile";
import ThemeContext from "../../Context/ThemeContext";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import useAuth from "../../../hooks/useAuth";
import coverPhoto from "../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../LoadingSpinner";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2"; // Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Demo admin data
const adminActivity = [
  {
    id: "admin-1",
    type: "Auction",
    title: "Vintage Camera",
    date: "2 hours ago",
    image: "https://i.ibb.co/sWZ5Hp7/camera.jpg",
  },
  {
    id: "admin-2",
    type: "Seller",
    title: "Seller: JohnDoe32",
    date: "5 hours ago",
    image: "https://i.ibb.co/qFZdnRB/seller.jpg",
  },
  {
    id: "admin-3",
    type: "Buyer",
    title: "Buyer: artCollector77",
    date: "1 day ago",
    image: "https://i.ibb.co/qRRj7Ws/buyer.jpg",
  },
];

// Seller demo data
const sellerActivity = [
  {
    id: "sell-1",
    item: "Antique Clock",
    status: "listed",
    price: "$120",
    time: "3 hours ago",
    image: "https://i.ibb.co/fMCxzMs/clock.jpg",
  },
  {
    id: "sell-2",
    item: "Gaming Console",
    status: "bidded",
    price: "$260",
    time: "7 hours ago",
    image: "https://i.ibb.co/0pFJZpg/console.jpg",
  },
];

// Hardcoded profile data for demo UI elements
const profileData = {
  user: {
    location: "Dhaka, BD",
    memberSince: "2024",
    coverImage: coverPhoto,
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
      image: "https://i.ibb.co/gZ2qhXjs/images-1.jpg",
    },
    {
      id: 2,
      item: "Nike Air Jordan 1 Retro",
      price: "$2,800",
      time: "3 hours ago",
      status: "Active",
      image: "https://i.ibb.co/V0Yxw7Mg/download.jpg",
    },
    {
      id: 3,
      item: "Leica M6 Classic",
      price: "$4,200",
      time: "6 hours ago",
      status: "Outbid",
      image: "https://i.ibb.co/N6rH502K/download-1.jpg",
    },
  ],
  watchingNow: [
    {
      id: 1,
      item: "Antique Pocket Watch",
      timeLeft: "3h 25m",
      image: "https://i.ibb.co/KSCtW5n/download-2.jpg",
    },
    {
      id: 2,
      item: "Art Deco Vase",
      timeLeft: "2d 4h",
      image: "https://i.ibb.co/60Q0GGYP/download-3.jpg",
    },
    {
      id: 3,
      item: "Vintage Camera",
      timeLeft: "5d 12h",
      image: "https://i.ibb.co/RGwFXk1S/download-4.jpg",
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

// Demo chart data with purple theme
const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      type: "bar",
      label: "Bids Placed",
      data: [10, 15, 8, 20, 12, 18],
      backgroundColor: "rgba(139, 92, 246, 0.7)", // Purple shade
      borderColor: "rgba(139, 92, 246, 1)",
      borderWidth: 1,
    },
    {
      type: "line",
      label: "Auctions Won",
      data: [2, 5, 3, 7, 4, 6],
      fill: false,
      borderColor: "rgba(167, 139, 250, 1)", // Lighter purple
      backgroundColor: "rgba(167, 139, 250, 1)",
      tension: 0.4,
      pointBackgroundColor: "rgba(167, 139, 250, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(167, 139, 250, 1)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#fff",
        font: { size: 14 },
      },
    },
    title: {
      display: true,
      text: "User Activity Trends",
      color: "#fff",
      font: { size: 18 },
    },
    tooltip: {
      backgroundColor: "rgba(139, 92, 246, 0.9)",
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
    },
  },
  scales: {
    x: {
      ticks: { color: "#fff" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
    y: {
      ticks: { color: "#fff" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
  },
  animation: {
    duration: 1500,
    easing: "easeInOutQuart",
  },
};

// Demo admin metrics
const adminMetrics = [
  { label: "Total Users", value: 1250, icon: "👥" },
  { label: "Active Auctions", value: 89, icon: "🔨" },
  { label: "Pending Complaints", value: 12, icon: "⚠️" },
  { label: "Total Revenue", value: 45000, prefix: "$", icon: "💰" },
];

const Profile = () => {
  const { user, loading: authLoading, dbUser, setDbUser } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const { isDarkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [currentCover, setCurrentCover] = useState(coverPhoto);
  const [selectedCover, setSelectedCover] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);

  const isBuyer = dbUser?.role === "buyer";
  const isSeller = dbUser?.role === "seller";
  const isAdmin = dbUser?.role === "admin";

  // Fetch upcoming auctions for admin
  useEffect(() => {
    if (dbUser?.role === "admin") {
      axios
        .get("http://localhost:5000/upcoming-auctions")
        .then((res) => setUpcomingAuctions(res.data))
        .catch((err) => console.error(err));
    }
  }, [dbUser]);

  // Fetch user reviews for admin
  useEffect(() => {
    if (dbUser?.role === "admin") {
      axios
        .get("http://localhost:5000/reviews")
        .then((res) => setUserReviews(res.data))
        .catch((err) => console.error(err));
    }
  }, [dbUser]);

  // Fetch cover options and user-specific cover image
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

  // Save selected cover image to backend
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

  const renderStatusBadge = (status) => {
    const statusStyles = {
      Won: "bg-green-500 text-white",
      Active: "bg-blue-500 text-white",
      Outbid: "border border-gray-300 text-black bg-white",
      listed: "bg-yellow-500 text-white",
      bidded: "bg-purple-500 text-white",
    };
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-md ${
          statusStyles[status] || "border border-gray-300 text-black bg-white"
        }`}
      >
        {status}
      </span>
    );
  };

  const { ref, inView } = useInView({ triggerOnce: true });

  if (authLoading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } transition-all duration-300 p-4 md:p-6`}
    >
      {/* Profile Banner */}
      <div
        className="relative h-[300px] bg-cover bg-center rounded-xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${
            currentCover || coverPhoto
          })`,
        }}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute right-4 top-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-purple-900 transition-all flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
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
          Edit Cover
        </button>
      </div>

      {/* Cover Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-95`}
          >
            <h2
              className={`text-xl font-bold text-center mb-6 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Choose Your Cover Image
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coverOptions.map((cover) => (
                <div
                  key={cover.id}
                  className={`cursor-pointer border-2 rounded-lg transition-all hover:shadow-lg ${
                    selectedCover === cover.image
                      ? "border-purple-500 shadow-purple-500/50"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedCover(cover.image)}
                >
                  <img
                    src={cover.image}
                    alt={`Cover ${cover.id}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = coverPhoto;
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition-all`}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={saveCoverImage}
                className={`px-4 py-2 rounded-lg ${
                  isSaving
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                } transition-all`}
                disabled={isSaving || !selectedCover}
              >
                {isSaving ? "Saving..." : "Save Cover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info */}
      <div className="px-6 -mt-16 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <div
              className={`w-32 h-32 rounded-full border-4 ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-white bg-gray-200"
              } overflow-hidden shadow-lg transform hover:scale-105 transition-all`}
            >
              <img
                src={
                  user?.photoURL ||
                  "https://img.freepik.com/premium-vector/flat-businessman-character_33040-132.jpg"
                }
                alt="Profile picture"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://img.freepik.com/premium-vector/flat-businessman-character_33040-132.jpg";
                }}
              />
            </div>
          </div>
          <div className="text-center md:text-left w-full">
            <h1
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {user?.displayName || "Anonymous User"}
            </h1>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Email: {user?.email || "No email provided"}
              {dbUser?.location && <span> • Location: {dbUser?.location}</span>}
              {dbUser?.memberSince && (
                <span> • Member Since: {dbUser?.memberSince}</span>
              )}
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  className={`px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition-all`}
                >
                  Edit Profile
                </button>
                {dbUser?.role && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      dbUser.role === "admin"
                        ? "bg-purple-600 text-white"
                        : dbUser.role === "seller"
                        ? "bg-blue-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {dbUser.role}
                  </span>
                )}
              </div>
              {dbUser?.role === "seller" && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs text-gray-400">4.8 Seller Rating</span>
                </div>
              )}
              {dbUser?.role === "seller" && (
                <div className="flex flex-wrap gap-2">
                  <button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-4 py-2 rounded-lg transition-all">
                    Add New Auction
                  </button>
                  <button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-4 py-2 rounded-lg transition-all">
                    View My Listings
                  </button>
                </div>
              )}
              {dbUser?.role === "admin" && (
                <div
                  className={`rounded-lg shadow-lg p-4 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Admin Controls
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="flex-1 min-w-[120px] bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-xs py-2 px-3 rounded-lg transition-all">
                      Manage Users
                    </button>
                    <button className="flex-1 min-w-[120px] bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-xs py-2 px-3 rounded-lg transition-all">
                      Review Complaints
                    </button>
                    <button className="flex-1 min-w-[120px] bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-xs py-2 px-3 rounded-lg transition-all">
                      Approve Auctions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Dashboard */}
      {dbUser?.role === "admin" && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Admin Dashboard
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {adminMetrics.map((metric, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 text-center transform hover:scale-105 transition-all border border-purple-500/20 ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
              >
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <CountUp
                    end={metric.value}
                    duration={2}
                    prefix={metric.prefix}
                    enableScrollSpy
                  />
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats for Buyers */}
      {dbUser?.role === "buyer" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-6">
          {[
            { label: "Auctions Won", value: dbUser?.AuctionsWon || 0 },
            { label: "Active Bids", value: dbUser?.ActiveBids || 0 },
            { label: "Success Rate", value: 0, suffix: "%" },
            { label: "Total Spent", value: dbUser?.totalSpent || 0, prefix: "$" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <CountUp
                    end={stat.value}
                    duration={3.5}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    enableScrollSpy
                  />
                </div>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seller Dashboard */}
      {dbUser?.role === "seller" && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Seller Dashboard
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Items Listed", value: dbUser?.listedItems || 0 },
              { label: "Items Sold", value: dbUser?.soldItems || 0 },
              {
                label: "Total Earnings",
                value: dbUser?.totalEarnings || 0,
                prefix: "$",
              },
              { label: "Buyer Reviews", value: dbUser?.reviews || 0 },
            ].map((stat, index) => (
              <div key={index}>
                <p
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {stat.prefix}
                  {stat.value}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Chart */}
      {(isBuyer || isSeller) && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Activity Trends
            </h2>
          </div>
          <div className="p-6">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Achievements for Buyer */}
      {dbUser?.role === "buyer" && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Your Achievements
            </h2>
          </div>
          <div className="p-6 flex flex-wrap gap-3 text-xs">
            {[
              { label: "🎯 First Win", color: "bg-purple-500" },
              { label: "💰 Spent $5k+", color: "bg-green-500" },
              { label: "🔥 Bid Warrior", color: "bg-yellow-500" },
              { label: "🏆 Auction Master", color: "bg-blue-600" },
              { label: "⏰ Last-Second Bidder", color: "bg-indigo-600" },
              { label: "💎 Big Spender", color: "bg-pink-500" },
            ].map((badge, index) => (
              <span
                key={index}
                className={`${badge.color} text-white px-3 py-1 rounded-full transform hover:scale-110 transition-all`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements for Seller */}
      {dbUser?.role === "seller" && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Seller Achievements
            </h2>
          </div>
          <div className="p-6 flex flex-wrap gap-3 text-xs">
            {[
              { label: "🛍️ First Listing", color: "bg-blue-500" },
              { label: "🎉 First Sale", color: "bg-green-500" },
              ...(dbUser?.listedItems > 20
                ? [{ label: "🧱 Pro Lister", color: "bg-indigo-600" }]
                : []),
              ...(dbUser?.soldItems > 15
                ? [{ label: "💼 Power Seller", color: "bg-purple-600" }]
                : []),
              ...(dbUser?.totalEarnings > 10000
                ? [{ label: "💸 10k+ Earner", color: "bg-pink-600" }]
                : []),
              ...(dbUser?.reviews >= 10
                ? [{ label: "🌟 Top Rated Seller", color: "bg-yellow-500" }]
                : []),
            ].map((badge, index) => (
              <span
                key={index}
                className={`${badge.color} text-white px-3 py-1 rounded-full transform hover:scale-110 transition-all`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Latest Feedback for Admin */}
      {dbUser?.role === "admin" && userReviews?.length > 0 && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Latest User Feedback
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {userReviews.map((review) => (
              <div
                key={review._id}
                className={`p-4 rounded-lg border border-purple-500/20 transform hover:scale-105 transition-all ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
              >
                <p
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {review.userName} ({review.role})
                </p>
                <p
                  className={`italic ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {review.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div
            ref={ref}
            className={`rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } transform hover:scale-105 transition-all`}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Account Balance
              </h2>
            </div>
            <div className="p-6">
              <div
                className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {inView ? (
                  <CountUp
                    end={dbUser?.accountBalance || 0}
                    duration={1.5}
                    prefix="$ "
                  />
                ) : (
                  "$ 0"
                )}
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all">
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
        </div>

        {/* Middle Column */}
        {dbUser?.role !== "admin" && (
          <div className="space-y-6">
            <div
              className={`rounded-lg shadow-lg ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {isBuyer && "Recent Activity"}
                  {isSeller && "Selling Activity"}
                  {isAdmin && "Platform Activity"}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {["All", "Bids", "Wins", "Watching"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 text-sm rounded-lg transition-all ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                          : `${
                              isDarkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  {isBuyer &&
                    profileData?.recentActivity?.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                          <img
                            src={activity.image}
                            alt={activity.item}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {activity.item}
                          </div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {activity.price} • {activity.time}
                          </div>
                        </div>
                        {renderStatusBadge(activity.status)}
                      </div>
                    ))}
                  {isSeller &&
                    sellerActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                          <img
                            src={activity.image}
                            alt={activity.item}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {activity.item}
                          </div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {activity.price} • {activity.time}
                          </div>
                        </div>
                        {renderStatusBadge(activity.status)}
                      </div>
                    ))}
                  {isAdmin &&
                    adminActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {activity.title}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {activity.type} • {activity.date}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column */}
        <div className="space-y-6">
          <div
            className={`rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Watching Now
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {profileData.watchingNow.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img
                      src={item.image}
                      alt={item.item}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.item}
                    </div>
                    <div
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
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

      {/* Bidding Tips for Buyers */}
      {dbUser?.role === "buyer" && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Bidding Tips
            </h2>
          </div>
          <div className="p-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <ul className="list-disc list-inside space-y-1">
              <li>Set a budget before entering an auction.</li>
              <li>Use the "Watch" feature to stay updated.</li>
              <li>Bid late for less competition.</li>
              <li>Check seller credibility before bidding.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Bidding History */}
      <div
        className={`rounded-lg shadow-lg mb-8 px-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Bidding History
          </h2>
          <button
            className={`px-3 py-1 text-sm flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition-all`}
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
        <div className="p-6">
          <div className="overflow-x-auto">
            <table
              className={`w-full text-sm ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium">Auction</th>
                  <th className="pb-3 font-medium">Bid Amount</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {profileData.biddingHistory.map((bid) => (
                  <tr
                    key={bid.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
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
              className={`flex items-center justify-between text-sm mt-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <div>
                Showing 1-{profileData.biddingHistory.length} of 127 items
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition-all`}
                >
                  <svg
                    className="w-4 h-4"
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
                  className={`h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition-all`}
                >
                  <svg
                    className="w-4 h-4"
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

      {/* Upcoming Auctions for Admin */}
      {dbUser?.role === "admin" && upcomingAuctions?.length > 0 && (
        <div
          className={`rounded-lg shadow-lg mb-8 px-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Upcoming Seller Auctions
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingAuctions.map((auction) => (
              <div
                key={auction._id}
                className={`p-4 rounded-lg border border-purple-500/20 transform hover:scale-105 transition-all ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
              >
                <p
                  className={`font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {auction.title}
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  By: {auction.sellerName} • {auction.date}
                </p>
                <button className="mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-3 py-1 rounded-lg text-sm transition-all">
                  Review Auction
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <SdProfile />
    </div>
  );
};

export default Profile;