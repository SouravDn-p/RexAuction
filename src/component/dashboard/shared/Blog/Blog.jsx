import { useContext, useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBlogger,
  FaRegClock,
  FaSearch,
  FaMoon,
  FaSun,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaTags,
} from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineFeaturedPlayList } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";
import ThemeContext from "../../../Context/ThemeContext";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { AuthContexts } from "../../../../providers/AuthProvider";
import axios from "axios";
import LoadingSpinner from "../../../LoadingSpinner";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Utility function to safely format dates
const safeFormatDate = (dateString, formatPattern) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Unknown Date" : format(date, formatPattern);
  } catch {
    return "Unknown Date";
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 500 },
  },
  exit: { opacity: 0, y: 50 },
};

export default function Blog() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { dbUser } = useContext(AuthContexts);
  const email = dbUser?.email;
  const navigate = useNavigate(); // Added for navigation

  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(
          `https://rex-auction-server-side-jzyx.onrender.com/blogs/${email}`
        );
        setBlogPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        console.error("Error fetching blogs:", error);
      }
    };

    if (email) {
      fetchBlogPosts();
    }
  }, [email]);

  const deleteBlogPost = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `https://rex-auction-server-side-jzyx.onrender.com/delete/${id}`
        );
        setBlogPosts(blogPosts.filter((post) => post._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Your blog has been deleted.",
          icon: "success",
          background: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
        });
        if (selectedPost?._id === id) {
          closePreviewModal();
        }
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      Swal.fire({
        title: "Failed to delete blog",
        text: "There was an error deleting the blog post.",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    }
  };

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.fullContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPreviewModal = (post) => {
    setSelectedPost(post);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedPost(null);
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen flex items-center justify-center p-6 ${
          isDarkMode
            ? "bg-gray-900"
            : "bg-gradient-to-b from-purple-50 to-white"
        }`}
      >
        <div
          className={`text-center max-w-md p-8 rounded-2xl shadow-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`p-4 rounded-full inline-block ${
              isDarkMode ? "bg-gray-700" : "bg-purple-100"
            }`}
          >
            <FaBlogger
              className={`text-4xl ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </motion.div>
          <h3 className="text-xl font-bold mt-4">Oops! Something went wrong</h3>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            We couldn't load your blog posts. Please check your connection and
            try again.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/dashboard/create-blog"
              className={`mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg ${
                isDarkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              <FaPlus /> Create New Blog
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-purple-50 via-white to-white text-gray-800"
      }`}
    >
      {/* Top Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div
            className={`p-2 md:p-3 rounded-xl ${
              isDarkMode ? "bg-gray-700" : "bg-purple-100"
            } shadow-lg`}
          >
            <RiArticleLine
              className={`text-xl md:text-2xl ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              My Blog Dashboard
            </h1>
            <p
              className={`text-xs md:text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Create, manage and analyze your content
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <motion.div
            variants={itemVariants}
            className="relative flex-grow max-w-md"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch
                className={`${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              />
            </div>
            <input
              type="text"
              placeholder="Search blogs..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm md:text-base ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 focus:border-purple-500"
                  : "bg-white border-gray-300 focus:border-purple-400"
              } focus:outline-none focus:ring-2 ${
                isDarkMode ? "focus:ring-purple-600" : "focus:ring-purple-300"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2"
          >
            <button
              onClick={toggleTheme}
              className={`p-2 md:p-3 rounded-xl ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-700" />
              )}
            </button>

            <Link
              to="/dashboard/create-blog"
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all shadow-lg hover:shadow-xl ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              }`}
            >
              <FaPlus className="text-lg" />
              <span className="hidden sm:inline">Create New</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-4 md:p-5 rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border-t-4 border-purple-500`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs md:text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Posts
              </p>
              <h3 className="text-2xl md:text-3xl font-bold">
                {blogPosts.length}
              </h3>
            </div>
            <div
              className={`p-2 md:p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-purple-100"
              }`}
            >
              <MdOutlineDashboard
                className={`text-xl md:text-2xl ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-4 md:p-5 rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border-t-4 border-blue-500`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs md:text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Latest Post
              </p>
              <h3 className="text-lg md:text-xl font-bold truncate">
                {blogPosts.length > 0 ? blogPosts[0].title : "No posts"}
              </h3>
            </div>
            <div
              className={`p-2 md:p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-blue-100"
              }`}
            >
              <FaRegClock
                className={`text-xl md:text-2xl ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-4 md:p-5 rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border-t-4 border-green-500`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs md:text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Last Updated
              </p>
              <h3 className="text-lg md:text-xl font-bold">
                {blogPosts.length > 0
                  ? safeFormatDate(blogPosts[0].updatedAt, "MMM dd")
                  : "Never"}
              </h3>
            </div>
            <div
              className={`p-2 md:p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-green-100"
              }`}
            >
              <FaEdit
                className={`text-xl md:text-2xl ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`p-4 md:p-5 rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border-t-4 border-pink-500`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs md:text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Featured
              </p>
              <h3 className="text-lg md:text-xl font-bold">
                {blogPosts.filter((post) => post.featured).length}
              </h3>
            </div>
            <div
              className={`p-2 md:p-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-pink-100"
              }`}
            >
              <MdOutlineFeaturedPlayList
                className={`text-xl md:text-2xl ${
                  isDarkMode ? "text-pink-400" : "text-pink-600"
                }`}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Blog Grid */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center py-12 md:py-16 rounded-xl md:rounded-2xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-xl`}
        >
          <div className="max-w-md mx-auto px-4">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className={`p-3 md:p-4 rounded-full inline-block ${
                isDarkMode ? "bg-gray-700" : "bg-purple-100"
              }`}
            >
              <FaBlogger
                className={`text-3xl md:text-4xl ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mt-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {searchTerm ? "No matching posts found" : "No Blog Posts Yet"}
            </h3>
            <p
              className={`mt-2 text-sm md:text-base ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {searchTerm
                ? "Try a different search term or create a new post"
                : "Get started by creating your first blog post!"}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard/create-blog"
                className={`mt-4 md:mt-6 inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium text-sm md:text-base shadow-lg ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                }`}
              >
                <FaPlus /> Create First Post
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: isDarkMode
                  ? "0 10px 25px -5px rgba(124, 58, 237, 0.3)"
                  : "0 10px 25px -5px rgba(168, 85, 247, 0.3)",
              }}
              className={`rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl transition-all duration-300 border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 hover:border-purple-500"
                  : "bg-white border-gray-200 hover:border-purple-400"
              }`}
            >
              <div
                className="relative h-48 sm:h-56 md:h-64 overflow-hidden group cursor-pointer"
                onClick={() => openPreviewModal(post)}
              >
                <img
                  src={
                    post.imageUrls[0] ||
                    "https://source.unsplash.com/random/600x400/?blog,writing"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute bottom-0 left-0 right-0 p-2 md:p-3 text-xs md:text-sm ${
                    isDarkMode ? "bg-gray-900/90" : "bg-white/90"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-purple-500" />
                    {safeFormatDate(post.createdAt, "MMM dd, yyyy")}
                  </div>
                </div>
                {post.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
                    <MdOutlineFeaturedPlayList /> Featured
                  </div>
                )}
              </div>
              <div className="p-4 md:p-6 flex flex-col h-48 sm:h-56 md:h-64 justify-between">
                <div>
                  <h2
                    className="text-lg md:text-xl font-bold mb-2 md:mb-3 line-clamp-2 cursor-pointer hover:text-purple-500 transition-colors"
                    onClick={() => openPreviewModal(post)}
                  >
                    {post.title}
                  </h2>
                  <p
                    className={`text-sm md:text-base line-clamp-3 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {post.fullContent}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3 md:mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => openPreviewModal(post)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition text-sm ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-blue-400"
                            : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                        }`}
                        title="Preview"
                        aria-label="Preview blog post"
                      >
                        <FaEye size={14} /> Preview
                      </button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() =>
                          navigate(`/dashboard/updateBlog/${post._id}`)
                        }
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition text-sm ${
                          isDarkMode
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                        title="Edit"
                        aria-label="Edit blog post"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => deleteBlogPost(post._id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition text-sm ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-red-400"
                          : "bg-red-100 hover:bg-red-200 text-red-600"
                      }`}
                      title="Delete"
                      aria-label="Delete blog post"
                    >
                      <FaTrash size={14} /> Delete
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closePreviewModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-500 to-blue-500">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaEye /> Post Preview
                </h3>
                <button
                  onClick={closePreviewModal}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
                  aria-label="Close modal"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <div className="p-4 md:p-6">
                <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-lg mb-4">
                  <img
                    src={
                      selectedPost.imageUrls[0] ||
                      "https://source.unsplash.com/random/800x450/?blog,writing"
                    }
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPost.category && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        isDarkMode
                          ? "bg-gray-700 text-purple-400"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <FaTags size={12} /> {selectedPost.category}
                    </span>
                  )}
                  {selectedPost.featured && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        isDarkMode
                          ? "bg-gray-700 text-yellow-400"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <MdOutlineFeaturedPlayList size={14} /> Featured
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      isDarkMode
                        ? "text-gray-400 bg-gray-700"
                        : "text-gray-500 bg-gray-100"
                    }`}
                  >
                    <FaCalendarAlt size={12} />{" "}
                    {safeFormatDate(selectedPost.createdAt, "MMM dd, yyyy")}
                  </span>
                </div>

                <h2
                  className={`text-xl md:text-2xl font-bold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedPost.title}
                </h2>

                <div
                  className={`prose prose-sm max-w-none mb-6 ${
                    isDarkMode
                      ? "prose-invert prose-headings:text-white prose-strong:text-purple-300"
                      : "prose-headings:text-gray-900 prose-strong:text-purple-600"
                  }`}
                  dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}
                />

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={closePreviewModal}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-sm ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                      aria-label="Close preview modal"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => deleteBlogPost(selectedPost._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-sm ${
                        isDarkMode
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                      aria-label="Delete blog post"
                    >
                      <FaTrash /> Delete
                    </button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() =>
                        navigate(`/dashboard/updateBlog/${selectedPost._id}`)
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-sm ${
                        isDarkMode
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-purple-500 hover:bg-purple-600 text-white"
                      }`}
                      aria-label="Edit blog post"
                    >
                      <FaEdit /> Edit
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
