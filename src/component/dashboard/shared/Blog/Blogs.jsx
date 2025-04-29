import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeContext from "../../../Context/ThemeContext";
import axios from "axios";
import LoadingSpinner from "../../../LoadingSpinner";

const Blogs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/allBlogs");
        setBlogs(res.data);
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
  if (isError) return <p className="text-center text-red-500">Failed to load blogs.</p>;

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // scroll to top on page change
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
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center mt-12">Blogs</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentBlogs.map((blog) => (
          <div
            key={blog._id}
            className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <img
              src={blog.imageUrls?.[0] || "/fallback.jpg"}
              alt={blog.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col h-52 justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
                <p className="text-sm">
                  {blog.fullContent.length > 50
                    ? blog.fullContent.slice(0, 50) + "..."
                    : blog.fullContent}
                </p>
              </div>
              <Link
                to={`/blogDetails/${blog._id}`}
                className="text-purple-600 font-medium hover:underline mt-4 inline-block"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-10 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-purple-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Blogs;
