import { useParams } from "react-router-dom";
import useAnnouncement from "../../../hooks/useAnnouncement";
import LoadingSpinner from "../../LoadingSpinner";
import { useContext } from "react";
import ThemeContext from "../../Context/ThemeContext";

const AnnouncementDetails = () => {
  const { id } = useParams(); 
  const [announcements, refetch, isLoading] = useAnnouncement();
  const { isDarkMode } = useContext(ThemeContext);

  if (isLoading) return <LoadingSpinner />;

  const announcement = announcements.find((item) => item._id === id);
  if (!announcement) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-red-600 text-center">
          Announcement Not Found!
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full min-h-screen flex items-center justify-center px-4 py-10 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-800"
      }`}
    >
      <div className="w-full mt-[100px] max-w-xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 border border-purple-100 dark:border-gray-700">
        
        {/* Flash Image Container */}
        <div className="relative group overflow-hidden rounded-t-2xl">
          <img
            src={announcement.image}
            alt={announcement.title}
            className="w-full h-[300px] object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Flash Overlay on Hover */}
          <div className="absolute top-0 left-[-75%] w-[33%] h-full bg-white opacity-20 transform rotate-[12deg] pointer-events-none group-hover:left-[125%] transition-all duration-1000"></div>

          {/* Floating Status Badge */}
          <span
            className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full shadow-md ${
              announcement.status === "published"
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                : "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
            }`}
          >
            {announcement.status === "published" ? "Published" : "Draft"}
          </span>
        </div>

        {/* Announcement Content */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</p>
          <h2 className="text-xl border-b font-bold text-purple-800 dark:text-purple-300 leading-snug">
            {announcement.title}
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {announcement.content.length > 200
              ? `${announcement.content.slice(0, 200)}...`
              : announcement.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
