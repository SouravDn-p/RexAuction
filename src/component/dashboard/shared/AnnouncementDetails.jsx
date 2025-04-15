// import { useParams } from "react-router-dom";
// import useAnnouncement from "../../../hooks/useAnnouncement";
// import LoadingSpinner from "../../LoadingSpinner";
// import { useContext } from "react";
// import ThemeContext from "../../Context/ThemeContext";

// const AnnouncementDetails = () => {
//   const { id } = useParams();
//   const [announcements, refetch, isLoading] = useAnnouncement();
//   const { isDarkMode } = useContext(ThemeContext);

//   if (isLoading) return <LoadingSpinner />;

//   const announcement = announcements.find((item) => item._id === id);
//   if (!announcement) {
//     return (
//       <div className="h-screen flex items-center justify-center px-4">
//         <h1 className="text-2xl font-bold text-red-600 text-center">
//           Announcement Not Found!
//         </h1>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`w-full h-full min-h-screen flex items-center justify-center px-4 py-10 ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-800"
//       }`}
//     >
//       <div className="w-full mt-[100px] max-w-xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 border border-purple-100 dark:border-gray-700">

//         {/* Flash Image Container */}
//         <div className="relative group overflow-hidden rounded-t-2xl">
//           <img
//             src={announcement.image}
//             alt={announcement.title}
//             className="w-full h-[300px] object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
//           />

//           {/* Flash Overlay on Hover */}
//           <div className="absolute top-0 left-[-75%] w-[33%] h-full bg-white opacity-20 transform rotate-[12deg] pointer-events-none group-hover:left-[125%] transition-all duration-1000"></div>

//           {/* Floating Status Badge */}
//           <span
//             className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full shadow-md ${
//               announcement.status === "published"
//                 ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
//                 : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
//             }`}
//           >
//             {announcement.status === "published" ? "Published" : "Draft"}
//           </span>
//         </div>

//         {/* Announcement Content */}
//         <div className="px-6 py-5 space-y-3">
//           <p className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</p>
//           <h2 className="text-xl border-b font-bold text-purple-800 dark:text-purple-300 leading-snug">
//             {announcement.title}
//           </h2>
//           <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
//             {announcement.content.length > 200
//               ? `${announcement.content.slice(0, 200)}...`
//               : announcement.content}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnnouncementDetails;

"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiCalendar, FiShare2 } from "react-icons/fi";
import ThemeContext from "../../Context/ThemeContext";
import LoadingSpinner from "../../LoadingSpinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    // Check if notification data was passed via location state
    if (location.state?.notificationDetails) {
      setNotificationData(location.state.notificationDetails);

      // If the notification contains announcement data, use it directly
      if (location.state.notificationDetails.announcementData) {
        setAnnouncement(location.state.notificationDetails.announcementData);
        setLoading(false);
        return;
      }
    }

    const fetchAnnouncementDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://un-aux.onrender.com/announcement/${id}`
        );
        setAnnouncement(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching announcement details:", err);
        setError(
          "Failed to load announcement details. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [id, location.state]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-800"
        } p-6`}
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-100"
            } transition-colors`}
          >
            <FiArrowLeft /> Back
          </button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-800"
        } p-6`}
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-100"
            } transition-colors`}
          >
            <FiArrowLeft /> Back
          </button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Announcement Not Found</h2>
            <p>
              The announcement you're looking for doesn't exist or has been
              removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-800"
      } p-6`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-100"
          } transition-colors`}
        >
          <FiArrowLeft /> Back to Announcements
        </button>

        {/* Notification Info (if from notification) */}
        {notificationData && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <h3 className="text-lg font-semibold mb-2 text-purple-500">
              Notification Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">
                  <span className="font-medium">From:</span>{" "}
                  {notificationData.sender}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Sent:</span>{" "}
                  {new Date(notificationData.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Title:</span>{" "}
                  {notificationData.title}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Message:</span>{" "}
                  {notificationData.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Announcement Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500"
                : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700"
            }`}
          >
            {announcement.title}
          </h1>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-purple-500" />
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                {new Date(announcement.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <button
              className="flex items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
            >
              <FiShare2 /> Share
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={announcement.image || "/placeholder.svg"}
            alt={announcement.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Content */}
        <div
          className={`prose max-w-none ${
            isDarkMode ? "prose-invert" : ""
          } mb-12`}
        >
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>
        </div>

        {/* Related Announcements (placeholder) */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Related Announcements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would be populated with actual related announcements */}
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <p className="text-purple-500 font-medium">Coming Soon</p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                More related announcements will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
