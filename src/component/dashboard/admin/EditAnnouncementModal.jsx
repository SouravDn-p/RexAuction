import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditAnnouncementModal = ({
  isOpen,
  onClose,
  announcementData,
  refetch,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (announcementData) {
      setTitle(announcementData.title);
      setContent(announcementData.content);
      setDate(announcementData.date);
      setImage(announcementData.image);
    }
  }, [announcementData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // If file is selected, upload it to ImgBB
    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadResponse = await axios.post(image_hosting_api, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.data.success) {
        setImage(uploadResponse.data.data.url);
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/announcement/${announcementData._id}`,
        {
          title,
          content,
          date,
          image,
        }
      );
      if (response.status === 200) {
        toast.success("Announcement updated successfully!");
        refetch();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update the announcement. Please try again.");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            Edit Announcement
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-700">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2  text-black border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
                defaultValue={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-700">
                Content
              </label>
              <textarea
                className="w-full px-4 py-2 text-black border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-700">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 text-black border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Image Preview */}
            {image && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-700">
                  Current Image
                </label>
                <img
                  src={image}
                  alt="Current Image"
                  className="w-20 h-20  rounded-lg mb-2"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-700">
                Upload Image
              </label>
              <input
                type="file"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditAnnouncementModal;
