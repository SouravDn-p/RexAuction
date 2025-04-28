import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ThemeContext from "../../../Context/ThemeContext";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import { AuthContexts } from "../../../../providers/AuthProvider";

export default function UpdateBlog() {
  const { isDarkMode } = useContext(ThemeContext);
  const { id } = useParams(); // Assuming blogId is in the URL params

  // State for blog data
  const [blogData, setBlogData] = useState({
    title: "",
    fullContent: "",
    imageUrls: [],
  });

  // State for image handling
  const [newImages, setNewImages] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Fetch existing blog data on component mount
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blog/${id}`);
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        Swal.fire("Error", "Failed to fetch blog data", "error");
      }
    };
    fetchBlogData();
  }, [id]);

  // Handle input changes for title, content, and images
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      // Handle image files
      setNewImages(files);
    } else {
      setBlogData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = blogData.imageUrls;

      // Upload new images if selected
      if (newImages.length > 0) {
        const uploadedImages = await Promise.all(
          Array.from(newImages).map(async (image) => {
            const formData = new FormData();
            formData.append("image", image);
            const response = await axios.post(
              `https://api.imgbb.com/1/upload?key=${
                import.meta.env.VITE_IMAGE_HOSTING_KEY
              }`,
              formData
            );
            return response.data.data.url; // Get the URL of the uploaded image
          })
        );
        imageUrls = [...imageUrls, ...uploadedImages]; // Add new image URLs to the existing ones
      }

      // Send PATCH request to update the blog
      const updatedBlog = { ...blogData, imageUrls };
      const response = await axios.patch(
        `http://localhost:5000/updateBlog/${id}`,
        updatedBlog
      );

      if (response.status === 200) {
        Swal.fire("Success", "Blog updated successfully", "success");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      Swal.fire("Error", "Failed to update blog", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 md:p-8 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50 text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-400 transition"
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-semibold text-sm">Back</span>
        </button>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-purple-700 dark:text-purple-300">
          Update Blog Post
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blog Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Blog Title</label>
            <input
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className={`w-full p-3 rounded-md border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-800"
              } focus:outline-none focus:ring-2 transition`}
              required
            />
          </div>

          {/* Blog Images */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload New Images (Optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              multiple
              className="block w-full text-sm file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition"
            />
            {newImages.length > 0 && (
              <p className="text-xs mt-1 text-green-500">
                Selected {newImages.length} images
              </p>
            )}
          </div>

          {/* Existing Images Preview */}
          {blogData.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blogData.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="Existing"
                  className="w-16 h-16 object-cover rounded-md"
                />
              ))}
            </div>
          )}

          {/* Full Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Content
            </label>
            <textarea
              name="fullContent"
              value={blogData.fullContent}
              onChange={handleChange}
              rows="6"
              className={`w-full p-3 rounded-md border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-800"
              } focus:outline-none focus:ring-2 transition`}
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:bg-gray-400 transition"
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
