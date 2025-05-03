import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaImage, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ThemeContext from "../../../Context/ThemeContext";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContexts } from "../../../../providers/AuthProvider";

export default function UpdateBlog() {
  const { isDarkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({
    title: "",
    fullContent: "",
    imageUrls: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `https://rex-auction-server-side-jzyx.onrender.com/blog/${id}`
        );
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch blog data",
          background: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
        });
      }
    };
    fetchBlogData();
  }, [id, isDarkMode]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "newImages" && files) {
      setNewImages(files);
    } else {
      setBlogData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setNewImages(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...blogData.imageUrls];
    updatedImages.splice(index, 1);
    setBlogData({ ...blogData, imageUrls: updatedImages });
  };

  const removeNewImage = (index) => {
    const updatedImages = Array.from(newImages);
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = blogData.imageUrls;

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
            return response.data.data.url;
          })
        );
        imageUrls = [...imageUrls, ...uploadedImages];
      }

      const updatedBlog = { ...blogData, imageUrls };
      const response = await axios.patch(
        `https://rex-auction-server-side-jzyx.onrender.com/updateBlog/${id}`,
        updatedBlog
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Blog updated successfully",
          background: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
        });
        navigate("/dashboard/blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update blog",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-purple-50 via-white to-purple-50 text-gray-800"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto border border-opacity-20 p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in backdrop-blur-sm bg-opacity-80 ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-600"
            : "bg-white/80 border-purple-300"
        }`}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-all hover:-translate-x-1"
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-semibold text-sm">Back</span>
        </button>

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Update Blog Post
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Revise and enhance your blog content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Blog Title */}
          <div className="relative group">
            <label className="block text-sm font-medium mb-2 ml-1">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 group-hover:border-purple-400 ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-white/90 border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none top-7">
              <FaEdit
                className={`${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                } opacity-70`}
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing Images */}
            <div>
              <label className="block text-sm font-medium mb-2 ml-1">
                Existing Images
              </label>
              {blogData.imageUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {blogData.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt="Existing"
                        className="w-full h-32 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`p-8 text-center rounded-xl ${
                    isDarkMode ? "bg-gray-700/30" : "bg-purple-50"
                  }`}
                >
                  <FaImage
                    className={`mx-auto text-4xl mb-3 ${
                      isDarkMode ? "text-purple-400/50" : "text-purple-300"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No existing images
                  </p>
                </div>
              )}
            </div>

            {/* Upload New Images */}
            <div>
              <label className="block text-sm font-medium mb-2 ml-1">
                Add New Images
              </label>
              <div
                className={`border-2 ${
                  isDragging ? "border-purple-500" : "border-dashed"
                } rounded-xl p-6 text-center transition-all cursor-pointer ${
                  isDarkMode
                    ? isDragging
                      ? "bg-purple-900/20 border-purple-500"
                      : "border-purple-500/50 hover:bg-purple-900/10"
                    : isDragging
                    ? "bg-purple-100 border-purple-500"
                    : "border-purple-400 hover:bg-purple-50"
                }`}
                onClick={() =>
                  document.getElementById("newImageUpload").click()
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {newImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from(newImages).map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="New Upload"
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNewImage(index);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MdDelete className="text-xs text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FaUpload
                      className={`mx-auto text-4xl mb-3 ${
                        isDarkMode ? "text-purple-400" : "text-purple-500"
                      } ${isDragging ? "animate-bounce" : ""}`}
                    />
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-purple-300" : "text-purple-600"
                      }`}
                    >
                      {isDragging
                        ? "Drop your images here"
                        : "Click to upload or drag & drop"}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      (Supports JPG, PNG up to 5MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  id="newImageUpload"
                  name="newImages"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  multiple
                />
              </div>
            </div>
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-sm font-medium mb-2 ml-1">
              Blog Content
            </label>
            <textarea
              name="fullContent"
              value={blogData.fullContent}
              onChange={handleChange}
              rows="8"
              className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-white/90 border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:bg-gray-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:bg-gray-400"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
