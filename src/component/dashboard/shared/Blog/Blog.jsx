import { useContext, useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ThemeContext from "../../../Context/ThemeContext";
import { Link } from "react-router-dom";
import { AuthContexts } from "../../../../providers/AuthProvider";
import axios from "axios"; // Import axios
import LoadingSpinner from "../../../LoadingSpinner";

export default function Blog() {
  const { isDarkMode } = useContext(ThemeContext);
  const { dbUser } = useContext(AuthContexts);
  const email = dbUser?.email;

  // State to store blog posts and loading/error states
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Fetch blog posts based on the user's email
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blogs/${email}`); // Pass email in URL
        setBlogPosts(response.data); // Store the fetched posts in state
        setIsLoading(false); // Set loading to false after fetching data
      } catch (error) {
        setIsError(true); // Set error state if there's an error
        setIsLoading(false); // Set loading to false
        console.error("Error fetching blogs:", error);
      }
    };
  
    if (email) {
      fetchBlogPosts();
    }
  }, [email]);
  // / Fetch data when the email changes

  if (isLoading) return <LoadingSpinner />; // Show spinner while loading
  if (isError) return <p>Error fetching data.</p>; // Show error message if fetch fails

  return (
    <div
      className={`min-h-screen p-6 md:p-8 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50 text-gray-800"
      }`}
    >
      {/* Top Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and explore recent blogs and articles.
          </p>
        </div>
        <Link
          to="/dashboard/create-blog"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-semibold shadow inline-flex items-center justify-center"
        >
          + Create New
        </Link>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {blogPosts.map((post) => (
          <div
            key={post._id} // Assuming MongoDB uses '_id' as the identifier
            className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <img
              src={post.imageUrls[0]} // Assuming imageUrls is an array and the first image is displayed
              alt={post.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col h-52 justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <p className="text-sm">{post.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  Read More
                </button>
                <div className="flex gap-2">
                  <button
                    className="bg-purple-100 text-purple-600 hover:bg-purple-200 p-2 rounded-full transition"
                    title="Edit Blog"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition"
                    title="Delete Blog"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
