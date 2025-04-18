"use client";

import { useState, useEffect } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";

const FeedbackDisplay = () => {
  const [selectedRole, setSelectedRole] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const axiosPublic = useAxiosPublic();

  // Simulate loading effect
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // load feedback
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosPublic.get("/feedbacks");

        // axios uses `response.status` and `response.data`
        if (response.status === 200) {
          setFeedbacks(response.data);
          console.log(response.data);
        } else {
          console.error("Error fetching feedbacks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Filter feedbacks based on selected role
  const filteredFeedbacks =
    selectedRole === "all"
      ? feedbacks
      : feedbacks.filter(
          (feedback) => feedback.role.toLowerCase() === selectedRole
        );

  // Calculate statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating =
    feedbacks.reduce((sum, feedback) => sum + feedback.userRating, 0) /
      totalFeedbacks || 0;
  const sellerCount = feedbacks.filter(
    (feedback) => feedback.role === "seller"
  ).length;
  const buyerCount = feedbacks.filter(
    (feedback) => feedback.role === "buyer"
  ).length;

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`${index < rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Customer Testimonials
          </h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
            See what our customers are saying about their experience
          </p>

          {/* Statistics */}
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-6 py-4 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-300 text-lg">
                  ★
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Rating
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {averageRating.toFixed(1)}/5
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-6 py-4 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 text-lg">
                  ✓
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Reviews
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {totalFeedbacks}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-6 py-4 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <span className="text-pink-600 dark:text-pink-300 text-lg">
                  ♥
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Happy Customers
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {buyerCount + sellerCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          className={`flex justify-center mb-10 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRole === "all"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              All ({totalFeedbacks})
            </button>
            <button
              onClick={() => setSelectedRole("buyer")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRole === "buyer"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              Buyers ({buyerCount})
            </button>
            <button
              onClick={() => setSelectedRole("seller")}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRole === "seller"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              Sellers ({sellerCount})
            </button>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedbacks.map((feedback, index) => (
            <div
              key={feedback?._id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Header with Role Badge */}
              <div className="relative">
                <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="absolute top-3 right-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      feedback?.role === "seller"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {feedback?.role?.charAt(0)?.toUpperCase() +
                      feedback?.role?.slice(1)}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={feedback?.image || "/placeholder.svg"}
                    alt={feedback?.userName}
                    className="h-14 w-14 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-900"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {feedback?.userName}
                    </h3>
                    <div className="flex mt-1 text-lg">
                      {renderStars(feedback?.userRating)}
                    </div>
                  </div>
                </div>

                {/* Feedback Content */}
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute -left-2 -top-2 text-indigo-200 dark:text-indigo-800 text-4xl">
                      "
                    </div>
                    <p className="relative pl-5 pr-2 py-2 text-gray-600 dark:text-gray-300 italic">
                      {feedback.userFeedback}
                    </p>
                    <div className="absolute -right-2 bottom-0 text-indigo-200 dark:text-indigo-800 text-4xl">
                      "
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="mt-6 text-right text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(feedback.date)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No {selectedRole !== "all" ? selectedRole : ""} reviews found.
            </p>
          </div>
        )}

        {/* Add Review CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Share Your Experience
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We value your feedback! Help us improve by sharing your thoughts.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
