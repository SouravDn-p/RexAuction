import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import LoadingSpinner from "../../../LoadingSpinner";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaArrowRight,
  FaPenAlt,
  FaSearch,
  FaExclamationCircle,
} from "react-icons/fa";
import { BiSolidBookAdd } from "react-icons/bi";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";

const Blogs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const blogsPerPage = 8;
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosPublic.get("/allBlogs");

        // Sort blogs by createdAt (newest first)
        const sortedBlogs = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBlogs(sortedBlogs);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog?.fullContent?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-800"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x">
            Discover Our Blogs
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Explore insightful articles, tutorials, and stories from our
            community
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              />
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              className={`w-full pl-10 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 ${isDarkMode
                ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white"
                : "bg-white border-gray-300 focus:ring-purple-400 text-gray-800"
                }`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Error or Empty State */}
        {(isError || blogs.length === 0) && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              {isError ? (
                <FaExclamationCircle className="mx-auto text-6xl mb-4 text-red-500" />
              ) : (
                <BiSolidBookAdd className="mx-auto text-6xl mb-4 text-purple-500" />
              )}
              <h2 className="text-2xl font-bold mb-3">
                {isError ? "No blogs available yet" : "No blogs available yet"}
              </h2>
              <p
                className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                {isError
                  ? "Be the first to create an amazing blog post!"
                  : "Be the first to create an amazing blog post!"}
              </p>
              <button
                onClick={handleCreateBlog}
                className={`px-6 py-3 rounded-full font-medium flex items-center mx-auto space-x-2 transition-all ${isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
              >
                <FaPenAlt className="mr-2" />
                {isError ? "create blog" : "Create Your First Blog"}
              </button>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {!isError && blogs.length > 0 && filteredBlogs.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <FaSearch className="mx-auto text-6xl mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-3">
                No matching blogs found
              </h2>
              <p
                className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Try a different search term
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className={`px-6 py-3 rounded-full font-medium flex items-center mx-auto space-x-2 transition-all ${isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {!isError && filteredBlogs.length > 0 && (
          <>
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 p-6">
              {currentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className={`group relative rounded-lg overflow-hidden transition-all duration-500 transform hover:-translate-y-2 ${isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                >
                  {/* Image Section with Moon Background */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={blog.imageUrls?.[0] || "/fallback.jpg"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col">
                    {/* Date */}
                    <span
                      className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).toUpperCase()}
                    </span>

                    {/* Title */}
                    <h2
                      className={`text-xl font-bold mb-3 line-clamp-2 leading-snug ${isDarkMode ? "text-white" : "text-blue-900"
                        }`}
                    >
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p
                      className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                    >
                      {blog.fullContent}
                    </p>

                    {/* Read More Link */}
                    <div className="mt-auto">
                      <a
                        href={`/blogDetails/${blog._id}`}
                        className={`inline-flex items-center font-medium transition-colors ${isDarkMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                          }`}
                      >
                        <span className="uppercase text-sm font-semibold">Read More</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center mt-16 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all ${isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-400"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= currentPage - 2 && i <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-all ${currentPage === i + 1
                          ? isDarkMode
                            ? "bg-purple-700 text-white shadow-lg"
                            : "bg-purple-600 text-white shadow-lg"
                          : isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {i + 1}
                      </button>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all ${isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-400"
                    }`}
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;
