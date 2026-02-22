import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import axios from "axios";
import LoadingSpinner from "../../../LoadingSpinner";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaArrowRight,
  FaPenAlt,
  FaSearch,
  FaExclamationCircle,
  FaRegClock,
  FaFilter,
} from "react-icons/fa";
import { BiSolidBookAdd } from "react-icons/bi";
import { motion } from "framer-motion";

const Blogs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState([]);
  const blogsPerPage = 8;
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/allBlogs`);
        console.log("Fetched blogs:", res.data); // Debug log
        setBlogs(res.data);
        
        // Extract unique categories (handle case when category might be missing)
        const uniqueCategories = ["All", ...new Set(res.data.map(blog => blog.category || "Uncategorized").filter(Boolean))];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [apiUrl]);

  // Filter blogs based on search query and category
  const filteredBlogs = blogs
    .filter((blog) => {
      if (!blog) return false;
      
      // Search filter
      const matchesSearch = searchQuery === "" || 
        blog?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog?.fullContent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog?.author?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === "All" || blog?.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort blogs
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCreateBlog = () => {
    navigate("/dashboard/blog");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Get reading time estimate
  const getReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
  };

  // Truncate content
  const truncateContent = (content, maxLength = 120) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substr(0, content.lastIndexOf(' ', maxLength)) + '...';
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              Discover Our Blogs
            </h1>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Explore insightful articles, tutorials, and stories from our
              community
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto mt-8 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                />
              </div>
              <input
                type="text"
                placeholder="Search blogs by title, category, or author..."
                className={`w-full pl-10 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 focus:ring-purple-400 text-gray-800 placeholder-gray-500"
                }`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <FaFilter className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white"
                      : "bg-white border-gray-300 focus:ring-purple-400 text-gray-800"
                  }`}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white"
                    : "bg-white border-gray-300 focus:ring-purple-400 text-gray-800"
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>

              {/* Results Count */}
              <span
                className={`px-4 py-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {filteredBlogs.length} {filteredBlogs.length === 1 ? "Blog" : "Blogs"} Found
              </span>
            </div>
          </div>
        </div>

        {/* Error or Empty State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <FaExclamationCircle className="mx-auto text-6xl mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-3">
                Failed to load blogs
              </h2>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                There was an error loading the blogs. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className={`px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State - No Blogs */}
        {!isError && blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <BiSolidBookAdd className="mx-auto text-6xl mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-3">
                No blogs available yet
              </h2>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Be the first to create an amazing blog post!
              </p>
              <button
                onClick={handleCreateBlog}
                className={`px-8 py-3 rounded-full font-medium flex items-center mx-auto space-x-2 transition-all transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                <FaPenAlt className="mr-2" />
                Create Your First Blog
              </button>
            </div>
          </motion.div>
        )}

        {/* No Search Results */}
        {!isError && blogs.length > 0 && filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <FaSearch className="mx-auto text-6xl mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-3">
                No matching blogs found
              </h2>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Try adjusting your search or filters
              </p>
              <button
                onClick={handleClearFilters}
                className={`px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        {!isError && filteredBlogs.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={blog.imageUrls?.[0] || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
                      }}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                          isDarkMode
                            ? "bg-purple-600/90 text-white"
                            : "bg-purple-500/90 text-white"
                        }`}
                      >
                        {blog.category || "General"}
                      </span>
                    </div>

                    {/* Reading Time Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1 ${
                          isDarkMode
                            ? "bg-gray-800/90 text-gray-200"
                            : "bg-white/90 text-gray-700"
                        }`}
                      >
                        <FaRegClock className="text-xs" />
                        {getReadingTime(blog.fullContent)} min
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Author and Date */}
                    <div className="flex items-center gap-3 text-xs mb-3 flex-wrap">
                      <span
                        className={`flex items-center ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FaUserAlt className="mr-1" />
                        {blog.author || "Admin"}
                      </span>
                      <span
                        className={`flex items-center ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <FaCalendarAlt className="mr-1" />
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : "Unknown"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-purple-500 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className={`text-sm mb-4 line-clamp-3 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {truncateContent(blog.fullContent)}
                    </p>

                    {/* Read More Link */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/blogDetails/${blog._id}`}
                        className={`inline-flex items-center text-sm font-medium transition-colors group-hover:text-purple-500 ${
                          isDarkMode
                            ? "text-purple-400 hover:text-purple-300"
                            : "text-purple-600 hover:text-purple-800"
                        }`}
                      >
                        Continue Reading
                        <FaArrowRight className="ml-2 text-xs transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center mt-16 gap-2"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-400"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            currentPage === pageNumber
                              ? isDarkMode
                                ? "bg-purple-600 text-white shadow-lg"
                                : "bg-purple-600 text-white shadow-lg"
                              : isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className={`w-10 h-10 flex items-center justify-center ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-400"
                  }`}
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;