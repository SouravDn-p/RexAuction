import React, { useContext, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import "./Announcement.css";
import useAnnouncement from "../../../hooks/useAnnouncement";
import LoadingSpinner from "../../LoadingSpinner";
import axios from "axios";
import toast from "react-hot-toast";
import EditAnnouncementModal from "../admin/EditAnnouncementModal";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../Context/ThemeContext";

const Announcement = () => {
  const isAdmin = true;
  const [announcements, refetch, isLoading] = useAnnouncement();
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  if (isLoading) return <LoadingSpinner />;

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/announcement/${id}`
      );
      if (response.status === 200) {
        toast.success("Announcement deleted successfully!");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete the announcement. Please try again.");
    }
  };

  return (
    <div
      className={`px-4 md:px-16 py-10  min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50 text-black"
      }`}

      

      className={`px-4 md:px-16 py-10 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-800"
      } min-h-screen`}

    >
      {/* Heading */}
      <h2
        className={`text-4xl font-bold text-purple-800 mb-2 text-center ${
          isDarkMode
            ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800"
            : "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
        }`}
      >
        🗞 Announcements
      </h1>
      <p 
   
      
      className={`  max-w-xl mx-auto text-center ${
        isDarkMode ? "text-purple-300" : "text-purple-700"
      } mb-10 `}
      >

      </h2>
      <p className="text-center text-slate-600 mb-10 max-w-xl mx-auto">
        Stay updated with the latest news and upcoming bidding events from
        <strong> RexAuction</strong>. Explore exciting opportunities!
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {announcements.map((item) => (
          <div key={item._id} className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front */}
              <div className={`card-flip-front border ${isDarkMode ? "bg-gray-700":"text-white"} border-purple-200 rounded-xl overflow-hidden shadow-md relative`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className={`text-sm text-gray-300 mb-1 ${isDarkMode?'text-gray-300' :"text-gray-800"}`}>{item.date}</p>
                  <h2 className="text-lg font-bold text-purple-500 mb-2">
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Back */}
              <div className={`card-flip-back ${isDarkMode ? "bg-gray-700":"text-black"} border border-purple-200 rounded-xl p-4 flex flex-col justify-between shadow-md`}>
                <p className="text-sm ">{item.content}</p>
                  {/* Edit and Delete buttons */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <FiTrash />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/announcementDetails/${item._id}`)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700 transition"
                >
                  Read More →
                </button>

              
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Announcement Modal */}
      <EditAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        announcementData={selectedAnnouncement}
        refetch={refetch}
      />
    </div>
  );
};

export default Announcement;
