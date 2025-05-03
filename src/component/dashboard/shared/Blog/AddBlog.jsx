import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import ThemeContext from "../../../Context/ThemeContext";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContexts } from "../../../../providers/AuthProvider";

export default function AddBlog() {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { dbUser } = useContext(AuthContexts);
  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    imageFiles: [],
    fullContent: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFiles") {
      setBlogData({ ...blogData, imageFiles: [...files] });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageHostingApi = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMAGE_HOSTING_KEY
    }`;
    const uploadedImageUrls = [];

    try {
      for (const file of blogData.imageFiles) {
        const formDataImage = new FormData();
        formDataImage.append("image", file);
        const res = await fetch(imageHostingApi, {
          method: "POST",
          body: formDataImage,
        });
        const data = await res.json();

        if (data.success) {
          uploadedImageUrls.push(data.data.display_url);
        } else {
          throw new Error("Failed to upload image to ImgBB");
        }
      }

      const blogDataWithImages = {
        title: blogData.title,
        imageUrls: uploadedImageUrls,
        fullContent: blogData.fullContent,
        authorName: dbUser?.name,
        authorEmail: dbUser?.email,
      };

      const response = await axios.post(
        "https://rex-auction-server-side-jzyx.onrender.com/addBlogs",
        blogDataWithImages,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Blog Posted Successfully",
          text: "Your blog has been published.",
          background: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
        });
        navigate("/dashboard/blogs");
      }
    } catch (err) {
      console.error("Error uploading images:", err);
      if (err.message.includes("ImgBB")) {
        Swal.fire({
          icon: "warning",
          title: "Image Upload Failed",
          text: "Please try again.",
          background: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error Occurred",
          text: "An error occurred while submitting the blog. Please try again later.",
          background: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBlogData({
      title: "",
      imageFiles: [],
      fullContent: "",
    });
  };

  const handleCancel = () => {
    navigate("/dashboard/blog");
  };

  const handleBack = () => {
    navigate("/blog");
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-purple-50 via-white to-purple-50 text-gray-800"
      }`}
    >
      <div className="max-w-3xl mx-auto border border-gray-400 dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-500 transition-transform transform hover:scale-105"
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-semibold text-sm">Back</span>
        </button>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center text-purple-700 dark:text-purple-400">
          Create a New Blog Post
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blog Title and Blog Image Upload - Side by Side */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Blog Title
              </label>
              <input
                type="text"
                name="title"
                value={blogData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                }`}
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Upload Blog Images
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all cursor-pointer ${
                  isDarkMode
                    ? "border-purple-500 hover:bg-purple-500/10"
                    : "border-purple-400 hover:bg-purple-400/10"
                }`}
                onClick={() => document.getElementById("imageUpload").click()}
              >
                {blogData.imageFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from(blogData.imageFiles).map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt="Uploaded"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <FaUpload
                      className={`mx-auto text-3xl mb-2 ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Click to upload images
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      (JPG, PNG, max 5MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  id="imageUpload"
                  name="imageFiles"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  multiple
                  required
                />
              </div>
            </div>
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Content
            </label>
            <textarea
              name="fullContent"
              value={blogData.fullContent}
              onChange={handleChange}
              placeholder="Write your full blog content here..."
              className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              rows="6"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className={`px-5 py-2 rounded-md font-semibold transition-all transform hover:scale-105 ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`px-5 py-2 rounded-md font-semibold transition-all transform hover:scale-105 ${
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
              className={`px-6 py-2 rounded-md font-semibold shadow transition-all transform hover:scale-105 ${
                isDarkMode
                  ? "bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-600"
                  : "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
              }`}
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
