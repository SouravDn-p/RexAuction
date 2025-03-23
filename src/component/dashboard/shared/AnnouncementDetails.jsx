import { useParams } from "react-router-dom";
import useAnnouncement from "../../../hooks/useAnnouncement";
import LoadingSpinner from "../../LoadingSpinner";

const AnnouncementDetails = () => {
  const { id } = useParams(); 
  const [announcements, refetch, isLoading] = useAnnouncement();

  if (isLoading) return <LoadingSpinner />;

  // Find the announcement with the matching ID
  const announcement = announcements.find((item) => item._id === id);
  // If no announcement is found, show an error message
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
    <div className="w-full min-h-screen bg-purple-50 flex mt-10 mb-10 items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Announcement Image */}
        <div className="relative w-full">
          <img 
            src={announcement.image} 
            alt={announcement.title} 
            className="w-full h-auto max-h-[500px] object-cover rounded-t-lg"
          />
          {/* Floating Status Badge */}
          <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-md 
            ${announcement.status === "published" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}
          `}>
            {announcement.status === "published" ? "Published" : "Draft"}
          </span>
        </div>

        {/* Announcement Details */}
        <div className="p-6 md:p-10">
          <p className="text-gray-500 text-sm">{announcement.date}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mt-2">
            {announcement.title}
          </h1>
          <p className="text-gray-700 mt-4 text-base md:text-lg leading-relaxed">
            {announcement.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
