import React, { useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ThemeContext from "../../../Context/ThemeContext";
import { Link } from "react-router-dom";

export default function Blog() {
  const { isDarkMode } = useContext(ThemeContext);

  const blogPosts = [
    {
      id: 1,
      title: "Mastering Live Auctions: Tips & Tricks",
      description: "Learn how to win auctions by mastering strategies and bidding smartly in real-time.",
      image: "https://source.unsplash.com/random/300x200?auction",
    },
    {
      id: 2,
      title: "Understanding Auction Pricing",
      description: "A deep dive into how pricing works in auctions and how to find the best deals.",
      image: "https://source.unsplash.com/random/300x200?money",
    },
    {
      id: 3,
      title: "How to Spot a Good Deal",
      description: "Recognize real opportunities and avoid common auction mistakes with our expert guide.",
      image: "https://source.unsplash.com/random/300x200?deal",
    },
    {
      id: 4,
      title: "Bidding Psychology 101",
      description: "Understand how psychology affects bidding and how you can use it to your advantage.",
      image: "https://source.unsplash.com/random/300x200?psychology",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 md:p-8 ${isDarkMode
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
            key={post.id}
            className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
          >
            <img
              src={post.image}
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
