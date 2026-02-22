import React, { useContext, useState, useEffect } from "react";
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

  const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      blogData.imageFiles.forEach(file => {
        URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [blogData.imageFiles]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFiles") {
      // Clean up old object URLs
      blogData.imageFiles.forEach(file => {
        URL.revokeObjectURL(URL.createObjectURL(file));
      });
      setBlogData({ ...blogData, imageFiles: [...files] });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate environment variable
    if (!imageHostingKey) {
      Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "Image hosting key is not configured. Please check your environment variables.",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
      return;
    }

    // Validate user
    if (!dbUser?.email || !dbUser?.name) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "You must be logged in to post a blog.",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
      return;
    }

    setLoading(true);

    const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;
    const uploadedImageUrls = [];

    try {
      // Check if images are selected
      if (blogData.imageFiles.length === 0) {
        throw new Error("Please select at least one image");
      }

      // Upload images to ImgBB
      for (const file of blogData.imageFiles) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 5MB limit`);
        }

        const formDataImage = new FormData();
        formDataImage.append("image", file);
        
        const res = await fetch(imageHostingApi, {
          method: "POST",
          body: formDataImage,
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();

        if (data.success) {
          uploadedImageUrls.push(data.data.display_url);
        } else {
          throw new Error(`Failed to upload image: ${file.name}`);
        }
      }

      // Prepare blog data
      const blogDataWithImages = {
        title: blogData.title,
        imageUrls: uploadedImageUrls,
        fullContent: blogData.fullContent,
        authorName: dbUser.name,
        authorEmail: dbUser.email,
        authorImage: dbUser.photo || "",
        category: "General", // You can add a category field if needed
        tags: [], // You can add tags field if needed
        createdAt: new Date().toISOString(),
      };

      // Submit blog to backend
      const response = await axios.post(
        "http://localhost:5001/addBlogs",
        blogDataWithImages,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Clean up object URLs
        blogData.imageFiles.forEach(file => {
          URL.revokeObjectURL(URL.createObjectURL(file));
        });

        Swal.fire({
          icon: "success",
          title: "Blog Posted Successfully",
          text: "Your blog has been published.",
          background: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          timer: 2000,
          showConfirmButton: true,
        }).then(() => {
          navigate("/dashboard/create-blog");
        });
      }
    } catch (err) {
      console.error("Error submitting blog:", err);
      
      let errorMessage = "An error occurred while submitting the blog. Please try again later.";
      let errorTitle = "Error Occurred";
      let errorIcon = "error";

      if (err.message.includes("ImgBB") || err.message.includes("image")) {
        errorTitle = "Image Upload Failed";
        errorMessage = err.message || "Please check your images and try again.";
        errorIcon = "warning";
      } else if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data?.message || "Server error. Please try again.";
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      }

      Swal.fire({
        icon: errorIcon,
        title: errorTitle,
        text: errorMessage,
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Clean up object URLs
    blogData.imageFiles.forEach(file => {
      URL.revokeObjectURL(URL.createObjectURL(file));
    });
    
    setBlogData({
      title: "",
      imageFiles: [],
      fullContent: "",
    });
  };

  const handleCancel = () => {
    // Clean up object URLs
    blogData.imageFiles.forEach(file => {
      URL.revokeObjectURL(URL.createObjectURL(file));
    });
    navigate("/dashboard/blogs");
  };

  const handleBack = () => {
    // Clean up object URLs
    blogData.imageFiles.forEach(file => {
      URL.revokeObjectURL(URL.createObjectURL(file));
    });
    navigate("/dashboard/blogs");
  };

  // Check if user is authenticated
  if (!dbUser) {
    return (
      <div className={`min-h-screen p-4 flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to create a blog post</h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-purple-50 via-white to-purple-50 text-gray-800"
      }`}
    >
      <div className="max-w-3xl mx-auto border border-gray-400 dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in relative">
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
                        alt="Upload preview"
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
                      (JPG, PNG, max 5MB each)
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
                  ? "bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing...
                </span>
              ) : (
                "Publish Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}