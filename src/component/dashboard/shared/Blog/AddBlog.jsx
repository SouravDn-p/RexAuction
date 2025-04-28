import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ThemeContext from "../../../Context/ThemeContext";

export default function AddBlog() {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({
    title: "",
    image: null,
    fullContent: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setBlogData({ ...blogData, image: files[0] });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(blogData);
    // Handle blog submission here (send to backend etc.)
  };

  const handleReset = () => {
    setBlogData({
      title: "",
      image: null,
      fullContent: "",
    });
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
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
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center gap-2 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-400 transition"
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-semibold text-sm">Back</span>
        </button>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-purple-700 dark:text-purple-300">
          Create a New Blog Post
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Blog Title and Blog Image Upload - Side by Side */}
          <div className="flex flex-col md:flex-row gap-6">
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
                className={`w-full p-3 rounded-md border ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-600"
                    : "border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-purple-400"
                } focus:outline-none focus:ring-2 transition`}
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Upload Blog Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className={`block w-full text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-100 dark:file:bg-gray-600
                  file:text-purple-700 dark:file:text-white
                  hover:file:bg-purple-200 dark:hover:file:bg-gray-500
                  transition`}
                required
              />
              {blogData.image && (
                <p className="text-xs mt-1 text-green-500">
                  Selected: {blogData.image.name}
                </p>
              )}
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
              className={`w-full p-3 rounded-md border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-600"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-purple-400"
              } focus:outline-none focus:ring-2 transition`}
              rows="6"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition"
            >
              Publish Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
