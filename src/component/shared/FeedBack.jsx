import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import ThemeContext from "../Context/ThemeContext";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const textVariant = () => ({
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
});

const FeedbackCard = ({ feedback, isDarkMode }) => {
  const isSeller = feedback.role.toLowerCase() === "seller";
  const stars = "★".repeat(feedback.rating) + "☆".repeat(5 - feedback.rating);
  const bids =
    feedback.bids && feedback.bids.length > 0 ? (
      feedback.bids.slice(0, 2).map((bid, idx) => (
        <li key={idx} className="text-xs text-gray-500 dark:text-gray-400">
          • {bid}
        </li>
      ))
    ) : (
      <p className="text-sm text-gray-400 italic">No bid yet</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-aos="fade-up"
      className={`rounded-xl shadow-md p-6 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800 text-white hover:shadow-purple-800/50"
          : "bg-white text-gray-800 hover:shadow-purple-800/50"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img
            src={feedback.image}
            alt={feedback.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
          />
          <div>
            <h3 className="text-lg font-semibold">{feedback.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {feedback.role}
            </p>
          </div>
        </div>
        {isSeller && (
          <div className="flex items-center gap-1 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.2l-3.5-3.6L4 14l5 5 10-10-1.5-1.5z" />
            </svg>
            Verified
          </div>
        )}
      </div>

      <div className="mb-3 text-yellow-400 text-sm">{stars}</div>

      <div className="mb-3">
        <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">
          Recent Bids:
        </h4>
        <ul className="list-disc pl-4">{bids}</ul>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 italic">
        "{feedback.feedback}"
      </div>

      <div className="text-xs text-gray-400 text-right">{feedback.date}</div>
    </motion.div>
  );
};

const Feedback = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const axiosPublic = useAxiosPublic();

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filter === "All") return true;
    return f.role.toLowerCase() === filter.toLowerCase();
  });

  const [formData, setFormData] = useState({
    name: "",
    role: "Buyer",
    feedback: "",
    rating: 5,
    image: "/images/default-avatar.jpg",
  });

  // load feedback
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosPublic.get("/feedbacks");

        // axios uses `response.status` and `response.data`
        if (response.status === 200) {
          setFeedbacks(response.data);
          console.log(response.data)
        } else {
          console.error("Error fetching feedbacks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const addReview = (e) => {
    e.preventDefault();

    const newFeedback = {
      ...formData,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      badgeColor:
        formData.role === "Buyer"
          ? "bg-yellow-400 text-yellow-900"
          : "bg-red-400 text-white",
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    setFormData({
      name: "",
      role: "Buyer",
      feedback: "",
      rating: 5,
      image: "/images/default-avatar.jpg",
    });
  };

  const averageRating =
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0;

  return (
    <section
      className={`py-16 px-6 md:px-10 ${
        isDarkMode ? "bg-gray-900" : "bg-purple-50"
      }`}
    >
      <motion.div
        className="text-center mb-10"
        variants={textVariant()}
        initial="hidden"
        animate="show"
      >
        <p className="text-purple-500 dark:text-purple-400 text-lg font-medium">
          Real Voices
        </p>
        <h2 className="text-4xl font-bold text-purple-700 dark:text-purple-300">
          Customer Feedback
        </h2>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {feedbacks.length} users reviewed · Avg Rating:{" "}
          {averageRating.toFixed(1)} ★
        </div>
      </motion.div>
      {/* filter user type */}
      <div className="flex justify-center gap-4 mb-10">
        {["All", "Buyer", "Seller"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === type
                ? "bg-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Feedback Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFeedbacks.map((feedback, idx) => (
          <FeedbackCard key={idx} feedback={feedback} isDarkMode={isDarkMode} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center" data-aos="fade-up">
        <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300">
          Give your valuable review
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Help us improve by sharing your honest feedback.
        </p>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md transition-all duration-300"
        >
          {showForm ? "Close Form" : "Give Feedback"}
        </button>
      </div>

      {/* Toggle Feedback Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          data-aos="fade-up"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Add Your Review
          </h3>
          <form
            onSubmit={addReview}
            className="grid md:grid-cols-2 gap-4 text-sm"
          >
            <input
              type="text"
              required
              placeholder="Your Name"
              value={formData.name}
              className="p-2 rounded border bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="p-2 rounded border bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option>Buyer</option>
              <option>Seller</option>
            </select>
            <input
              type="number"
              max="5"
              min="1"
              required
              value={formData.rating}
              className="p-2 rounded border bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Rating (1-5)"
              onChange={(e) =>
                setFormData({ ...formData, rating: Number(e.target.value) })
              }
            />
            <input
              type="text"
              value={formData.image}
              className="p-2 rounded border bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Image URL"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
            <textarea
              placeholder="Write your review"
              required
              value={formData.feedback}
              className="p-2 rounded border md:col-span-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 "
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
            ></textarea>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded md:col-span-2"
            >
              Submit Review
            </button>
          </form>
        </motion.div>
      )}
    </section>
  );
};

export default Feedback;
