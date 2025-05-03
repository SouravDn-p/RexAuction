import { useContext, useState, useEffect } from "react";
import SdProfile from "./SdProfile";
import ThemeContext from "../../Context/ThemeContext";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import useAuth from "../../../hooks/useAuth";
import coverPhoto from "../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../LoadingSpinner";
import coverImg from "../../../assets/bg/hammer.webp";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

// Seller demo
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

// Hardcoded profile data for the UI elements
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
  sellerActivity: [
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
  ],
};
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

  const navigate = useNavigate();
  const isBuyer = dbUser?.role === "buyer";
  const isSeller = dbUser?.role === "seller";
  const isAdmin = dbUser?.role === "admin";

  // upcoming auction fetch
  useEffect(() => {
    if (dbUser?.role === "admin") {
      axios
        .get(
          "https://rex-auction-server-side-jzyx.onrender.com/upcoming-auctions"
        )
        .then((res) => setUpcomingAuctions(res.data))
        .catch((err) => console.error(err));
    }
  }, [dbUser]);
  // user review
  useEffect(() => {
    if (dbUser?.role === "admin") {
      axios
        .get("https://rex-auction-server-side-jzyx.onrender.com/reviews")
        .then((res) => setUserReviews(res.data))
        .catch((err) => console.error(err));
    }
  }, [dbUser]);

  // Fetch cover options and user-specific cover image
  useEffect(() => {
    // Fetch cover options
    const fetchCoverOptions = async () => {
      try {
        const response = await axios.get(
          "https://rex-auction-server-side-jzyx.onrender.com/cover-options"
        );
        setCoverOptions(response.data);
      } catch (error) {
        console.error("Error fetching cover options:", error);
        setCoverOptions([
          { id: 1, image: coverImg },
          { id: 2, image: "https://i.ibb.co/KSCtW5n/download-2.jpg" },
          { id: 3, image: "https://i.ibb.co/60Q0GGYP/download-3.jpg" },
          { id: 4, image: "https://i.ibb.co/RGwFXk1S/download-4.jpg" },
        ]); // Fallback options
      }
    };

    // Fetch user-specific cover image
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
          setCurrentCover(coverPhoto); // Fallback to default
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
      await axios.patch(
        "https://rex-auction-server-side-jzyx.onrender.com/cover",
        {
          userId: user.uid,
          image: selectedCover, // This will be saved as `cover` in DB
        }
      );
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

  const boxStyle = `border mb-6 rounded-lg shadow-sm ${
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
        className="relative h-[300px] bg-cover bg-center rounded-lg overflow-hidden"
        style={{
          backgroundImage: `url(${currentCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute right-4 top-4 bg-white text-black hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium flex items-center"
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
        </button>
      </div>

      {/* Cover Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg w-full max-w-4xl shadow-xl`}
          >
            <h2
              className={`text-lg font-bold text-center mb-4 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Choose Your Cover Image
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {coverOptions.map((cover) => (
                <div
                  key={cover.id}
                  className={`cursor-pointer border-2 rounded-lg transition-all ${
                    selectedCover === cover.image
                      ? "border-blue-500"
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
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={saveCoverImage}
                className={`px-4 py-2 rounded ${
                  isSaving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                disabled={isSaving || !selectedCover}
              >
                {isSaving ? "Saving..." : "Save Cover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info */}
      <div className="px-6">
        <div
          className={`flex flex-col md:flex-row items-center gap-6 -mt-16 mb-6 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
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
                  "https://img.freepik.com/premium-vector/flat-businessman-character_33040-132.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid&w=740"
                }
                alt="Profile picture"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://img.freepik.com/premium-vector/flat-businessman-character_33040-132.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid&w=740";
                }}
              />
            </div>
          </div>
          <div className="lg:text-left text-center w-full">
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
              )}
              {dbUser?.memberSince ? (
                <span> • Member Since: {dbUser?.memberSince}</span>
              ) : (
                ""
              )}
            </p>
            {/* admin control */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/dashboard/settings")}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                      : "border-gray-300 bg-white text-black hover:bg-gray-50"
                  }`}
                >
                  Edit Profile
                </button>
                {dbUser?.role && (
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      dbUser.role === "admin"
                        ? "bg-red-600 text-white"
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
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">
                    4.8 Seller Rating
                  </span>
                </div>
              )}

              {dbUser?.role === "seller" && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                    Add New Auction
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    View My Listings
                  </button>
                </div>
              )}

              {/* Admin Controls Inline Card */}
              {dbUser?.role === "admin" && (
                <div
                  className={`rounded-lg shadow-sm p-4 border mt-3 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Admin Controls
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate("/dashboard/userManagement")}
                      className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-2 rounded"
                    >
                      Manage Users
                    </button>

                    <button
                      onClick={() => navigate("/dashboard/feedback")}
                      className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 px-2 rounded"
                    >
                      Review Feedbacks
                    </button>
                    <button
                      onClick={() => navigate("/dashboard/manageAuctions")}
                      className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 px-2 rounded"
                    >
                      Approve Auctions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats for buyers */}
        {dbUser?.role === "buyer" && (
          <div className="grid mt-5 grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={boxStyle}>
              <div className="p-4 text-center">
                <div className={titleStyle}>
                  <CountUp
                    end={dbUser?.AuctionsWon || 0}
                    duration={3.5}
                    enableScrollSpy
                  />
                </div>
                <div className={labelStyle}>Auctions Won</div>
              </div>
            </div>

            <div className={boxStyle}>
              <div className="p-4 text-center">
                <div className={titleStyle}>
                  <CountUp
                    end={dbUser?.ActiveBids || 0}
                    duration={3.5}
                    enableScrollSpy
                  />
                </div>
                <div className={labelStyle}>Active Bids</div>
              </div>
            </div>

            <div className={boxStyle}>
              <div className="p-4 text-center">
                <div className={titleStyle}>
                  <CountUp end={0} duration={3.5} suffix=" %" enableScrollSpy />
                </div>
                <div className={labelStyle}>Success Rate</div>
              </div>
            </div>

            <div className={boxStyle}>
              <div className="p-4 text-center">
                <div className={titleStyle}>
                  <CountUp
                    end={dbUser?.totalSpent || 0}
                    duration={1.5}
                    prefix="$ "
                    enableScrollSpy
                  />
                </div>
                <div className={labelStyle}>Total Spent</div>
              </div>
            </div>
          </div>
        )}

        {/* stats for seller */}
        {dbUser?.role === "seller" && (
          <div className={boxStyle}>
            <div className="p-4 border-b">
              <h2 className={titleStyle}>Seller Dashboard</h2>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-bold">{dbUser?.listedItems || 0}</p>
                <p className={labelStyle}>Items Listed</p>
              </div>
              <div>
                <p className="text-xl font-bold">{dbUser?.soldItems || 0}</p>
                <p className={labelStyle}>Items Sold</p>
              </div>
              <div>
                <p className="text-xl font-bold">
                  ${dbUser?.totalEarnings || 0}
                </p>
                <p className={labelStyle}>Total Earnings</p>
              </div>
              <div>
                <p className="text-xl font-bold">{dbUser?.reviews || 0}</p>
                <p className={labelStyle}>Buyer Reviews</p>
              </div>
            </div>
          </div>
        )}

        {/* achievements for buyer */}
        {dbUser?.role === "buyer" && (
          <div className={boxStyle}>
            <div className="p-4 border-b ">
              <h2 className={titleStyle}>Your Achievements</h2>
            </div>

            <div className="p-4 flex flex-wrap gap-2 text-xs">
              {/* Existing badges */}
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full">
                🎯 First Win
              </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                💰 Spent $5k+
              </span>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">
                🔥 Bid Warrior
              </span>

              {/* Demo achievement badges */}
              {true && ( // Simulate condition with `true` for demo
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full">
                  🏆 Auction Master
                </span>
              )}
              {true && (
                <span className="bg-indigo-600 text-white px-2 py-1 rounded-full">
                  ⏰ Last-Second Bidder
                </span>
              )}
              {true && (
                <span className="bg-pink-500 text-white px-2 py-1 rounded-full">
                  💎 Big Spender
                </span>
              )}
            </div>
          </div>
        )}
        {/* achievements for seller */}
        {dbUser?.role === "seller" && (
          <div className={boxStyle}>
            <div className="p-4 border-b">
              <h2 className={titleStyle}>Seller Achievements</h2>
            </div>
            <div className="p-4 flex flex-wrap gap-2 text-xs">
              {/* Static badges */}
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full">
                🛍️ First Listing
              </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                🎉 First Sale
              </span>

              {/* Dynamic achievements */}
              {dbUser?.listedItems > 20 && (
                <span className="bg-indigo-600 text-white px-2 py-1 rounded-full">
                  🧱 Pro Lister
                </span>
              )}
              {dbUser?.soldItems > 15 && (
                <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                  💼 Power Seller
                </span>
              )}
              {dbUser?.totalEarnings > 10000 && (
                <span className="bg-pink-600 text-white px-2 py-1 rounded-full">
                  💸 10k+ Earner
                </span>
              )}
              {dbUser?.reviews >= 10 && (
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">
                  🌟 Top Rated Seller
                </span>
              )}
            </div>
          </div>
        )}

        {/* latest feedback for admin */}
        {dbUser?.role === "admin" && userReviews?.length > 0 && (
          <div className={`${boxStyle} mb-6`}>
            <div className="p-4 border-b">
              <h2 className={titleStyle}>Latest User Feedback</h2>
            </div>
            <div className="p-4 space-y-3">
              {userReviews.map((review) => (
                <div key={review._id} className="text-sm">
                  <p className="font-semibold">
                    {review.userName} ({review.role})
                  </p>
                  <p className="italic text-gray-400">{review.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
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
                      end={dbUser?.accountBalance || 0}
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
          </div>

          {/* Middle Column */}
          {dbUser?.role !== "admin" && (
            <div className="space-y-6">
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
                    {isBuyer && "Recent Activity"}
                    {isSeller && "Selling Activity"}
                    {isAdmin && "Platform Activity"}
                  </h2>
                </div>

                <div className="p-4">
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
                  {/* recent activity */}
                  <div className="space-y-3">
                    {/* For Buyer */}
                    {isBuyer &&
                      profileData?.recentActivity?.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3"
                        >
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

                    {/* For Seller */}

                    {isSeller && sellerActivity.length > 0 ? (
                      sellerActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={`w-12 h-12 rounded-md overflow-hidden border ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <img
                              src={activity.image}
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
                      ))
                    ) : (
                      <div>No seller activity available</div>
                    )}

                    {/* For Admin */}
                    {isAdmin && adminActivity.length > 0 ? (
                      adminActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={`w-12 h-12 rounded-md overflow-hidden border ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <img
                              src={activity.image}
                              alt={activity.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <div
                              className={`text-sm font-medium ${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                            >
                              {activity.title}
                            </div>
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {activity.type} • {activity.date}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>No admin activity available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column */}
          <div className="space-y-6">
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
        {/* bidding tips for buyers */}
        {dbUser?.role === "buyer" && (
          <div className={boxStyle}>
            <div className="p-4 border-b">
              <h2 className={titleStyle}>Bidding Tips</h2>
            </div>
            <div className="p-4 space-y-2 text-sm text-gray-500">
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
        {/* upcoming auctions for admin */}
        {dbUser?.role === "admin" && upcomingAuctions?.length > 0 && (
          <div className={`${boxStyle} mb-6`}>
            <div className="p-4 border-b">
              <h2 className={titleStyle}>Upcoming Seller Auctions</h2>
            </div>
            <div className="p-4 space-y-3">
              {upcomingAuctions.map((auction) => (
                <div key={auction._id} className="text-sm">
                  <p className="font-bold">{auction.title}</p>
                  <p className="text-gray-500">
                    By: {auction.sellerName} • {auction.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <SdProfile />
    </div>
  );
};

export default Profile;
