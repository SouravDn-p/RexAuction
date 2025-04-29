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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/allBlogs"); // Update with actual endpoint
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
        {blogs.map((blog) => (
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
                to={`/blog/${blog._id}`}
                className="text-purple-600 font-medium hover:underline mt-4 inline-block"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
