import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiCalendar, FiShare2 } from "react-icons/fi";
import ThemeContext from "../../../component/Context/ThemeContext";
import LoadingSpinner from "../../../component/LoadingSpinner";
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

    // Fetch announcement by ID if no announcementData is provided
    if (id) {
      const fetchAnnouncementDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://rex-auction-server-side-jzyx.onrender.com/announcement/${id}`,
            { withCredentials: true }
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
    } else {
      // No ID and no announcementData, show error
      setError("No announcement data provided.");
      setLoading(false);
    }
  }, [id, location.state]);

  if (loading) return <LoadingSpinner />;

  if (error || !announcement) {
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
            <p>{error || "Announcement not found."}</p>
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
                  {notificationData.sender || "System"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Sent:</span>{" "}
                  {new Date(notificationData.createdAt).toLocaleString()}
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
                {new Date(
                  announcement.date || announcement.createdAt
                ).toLocaleDateString("en-US", {
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
        {announcement.image && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={announcement.image}
              alt={announcement.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

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
