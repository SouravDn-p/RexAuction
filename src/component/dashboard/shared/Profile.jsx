"use client"; // Add this directive for client-side rendering

import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SdProfile from "./SdProfile";
import ThemeContext from "../../Context/ThemeContext";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import useAuth from "../../../hooks/useAuth";
import coverPhoto from "../../../assets/bg/hammer.webp";
import LoadingSpinner from "../../LoadingSpinner";
import axios from "axios";
// import UserManagement from "../."; // Import UserManagement
import ManageCard from "./ManageCard"; // Import ManageCard
import UserManagement from "../admin/UserManagement";

// Demo admin data (unchanged)
const adminActivity = [
  // ... (existing admin activity data)
];

// Seller demo (unchanged)
const sellerActivity = [
  // ... (existing seller activity data)
];

// Hardcoded profile data (unchanged)
const profileData = {
  // ... (existing profile data)
};

const Profile = () => {
  const { user, loading: authLoading, dbUser } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const { isDarkMode } = useContext(ThemeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverOptions, setCoverOptions] = useState([]);
  const [currentCover, setCurrentCover] = useState(coverPhoto);
  const [selectedCover, setSelectedCover] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [auctions, setAuctions] = useState([]); // State for admin auctions
  const [sellerRequests, setSellerRequests] = useState([]); // State for seller requests
  const navigate = useNavigate();

  const isBuyer = dbUser?.role === "buyer";
  const isSeller = dbUser?.role === "seller";
  const isAdmin = dbUser?.role === "admin";

  // Fetch auctions for admin
  useEffect(() => {
    if (isAdmin) {
      axios
        .get("http://localhost:5000/auctions")
        .then((res) => setAuctions(res.data.slice(0, 3))) // Limit to 3 auctions
        .catch((err) => console.error("Error fetching auctions:", err));
    }
  }, [isAdmin]);

  // Fetch seller requests for admin
  useEffect(() => {
    if (isAdmin) {
      axios
        .get("http://localhost:5000/sellerRequest")
        .then((res) =>
          setSellerRequests(
            res.data.filter((req) => req.becomeSellerStatus === "pending").slice(0, 3)
          )
        ) // Limit to 3 pending requests
        .catch((err) => console.error("Error fetching seller requests:", err));
    }
  }, [isAdmin]);

  // Existing useEffect hooks (unchanged)
  useEffect(() => {
    if (dbUser?.role === "admin") {
      axios
        .get("http://localhost:5000/upcoming-auctions")
        .then((res) => setUpcomingAuctions(res.data))
        .catch((err) => console.error(err));
    }
  }, [dbUser]);

  useEffect(() => {
    if (dbUser?.role === "admin") {
      axios
        .get("http://localhost:5000/reviews")
        .then((res) => setUserReviews(res.data))
        .catch((err) => console.error(err));
    }
  }, [dbUser]);

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
      {/* Profile Banner (unchanged) */}
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

      {/* Cover Image Modal (unchanged) */}
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

      {/* Profile Info (unchanged) */}
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
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button
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
                    <button className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-2 rounded">
                      Manage Users
                    </button>
                    <button className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 px-2 rounded">
                      Review Complaints
                    </button>
                    <button className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 px-2 rounded">
                      Approve Auctions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Existing Stats and Achievements (unchanged) */}
        {dbUser?.role === "buyer" && (
          <div className="grid mt-5 grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* ... (existing buyer stats) */}
          </div>
        )}

        {dbUser?.role === "seller" && (
          <div className={boxStyle}>
            {/* ... (existing seller dashboard) */}
          </div>
        )}

        {dbUser?.role === "buyer" && (
          <div className={boxStyle}>
            {/* ... (existing buyer achievements) */}
          </div>
        )}

        {dbUser?.role === "seller" && (
          <div className={boxStyle}>
            {/* ... (existing seller achievements) */}
          </div>
        )}

        {/* Auction Management Summary (Existing for Admin) */}
        {isAdmin && auctions.length > 0 && (
          <div className={`${boxStyle} mb-6`}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className={titleStyle}>Manage Auctions</h2>
              <button
                onClick={() => navigate("/dashboard/manage-auctions")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                View All
              </button>
            </div>
            <div className="p-4 space-y-3">
              {auctions.map((auction) => (
                <div
                  key={auction._id}
                  className="flex items-center gap-3 text-sm"
                >
                  <div
                    className={`w-12 h-12 rounded-md overflow-hidden border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <img
                      src={auction.images?.[0] || "/placeholder.svg?height=48&width=48"}
                      alt={auction.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{auction.name}</p>
                    <p className="text-gray-500">
                      Status: {auction.status || "Pending"} • Seller: {auction.sellerEmail}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md ${
                      auction.status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {auction.status || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seller Requests Summary (Existing for Admin) */}
        {isAdmin && sellerRequests.length > 0 && (
          <div className={`${boxStyle} mb-6`}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className={titleStyle}>Seller Requests</h2>
              <button
                onClick={() => navigate("/dashboard/seller-request")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                View All
              </button>
            </div>
            <div className="p-4 space-y-3">
              {sellerRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center gap-3 text-sm"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      isDarkMode ? "bg-purple-900" : "bg-purple-100"
                    }`}
                  >
                    <span
                      className={
                        isDarkMode ? "text-purple-300" : "text-purple-700"
                      }
                    >
                      {request.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{request.name}</p>
                    <p className="text-gray-500">
                      {request.email} • {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard/seller-request")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management (New for Admin) */}
        {isAdmin && (
          <div className={`${boxStyle} mb-6`}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className={titleStyle}>User Management</h2>
              <button
                onClick={() => navigate("/dashboard/user-management")} // Optional: Add a dedicated route
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                View All
              </button>
            </div>
            <div className="p-4">
              <UserManagement />
            </div>
          </div>
        )}

        {/* Seller Auction Management (New for Sellers) */}
        {isSeller && (
          <div className={`${boxStyle} mb-6`}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className={titleStyle}>Your Auctions</h2>
              <button
                onClick={() => navigate("/dashboard/manage-auctions")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                View All
              </button>
            </div>
            <div className="p-4">
              <ManageCard />
            </div>
          </div>
        )}

        {/* Existing Feedback and Main Content (unchanged) */}
        {dbUser?.role === "admin" && userReviews?.length > 0 && (
          <div className={`${boxStyle} mb-6`}>
            {/* ... (existing feedback section) */}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Left Column (unchanged) */}
          <div className="space-y-6">
            <div
              ref={ref}
              className={`border rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* ... (existing account balance) */}
            </div>
          </div>

          {/* Middle Column (unchanged) */}
          {dbUser?.role !== "admin" && (
            <div className="space-y-6">
              {/* ... (existing recent activity) */}
            </div>
          )}

          {/* Right Column (unchanged) */}
          <div className="space-y-6">
            <div
              className={`border rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* ... (existing watching now) */}
            </div>
          </div>
        </div>

        {/* Existing Bidding Tips and History (unchanged) */}
        {dbUser?.role === "buyer" && (
          <div className={boxStyle}>
            {/* ... (existing bidding tips) */}
          </div>
        )}

        <div
          className={`border rounded-lg shadow-sm mb-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* ... (existing bidding history) */}
        </div>

        {/* Existing Upcoming Auctions (unchanged) */}
        {dbUser?.role === "admin" && upcomingAuctions?.length > 0 && (
          <div className={`${boxStyle} mb-6`}>
            {/* ... (existing upcoming auctions) */}
          </div>
        )}
      </div>
      <SdProfile />
    </div>
  );
};

export default Profile;