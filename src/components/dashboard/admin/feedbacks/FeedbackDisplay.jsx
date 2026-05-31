"use client";

import { useState, useContext, useEffect } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import ThemeContext from "../../../Context/ThemeContext";
import { Star, MessageSquare, Users, ChevronRight, Award } from "lucide-react";

const FeedbackDisplay = () => {
  const [selectedRole, setSelectedRole] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { isDarkMode } = useContext(ThemeContext);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // load feedback
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosPublic.get("/feedbacks");
        if (response.status === 200) {
          setFeedbacks(response.data);
        } else {
          console.error("Error fetching feedbacks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [axiosPublic]);

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
  const highRatingCount = feedbacks.filter(
    (feedback) => feedback.userRating >= 4
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
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : isDarkMode
              ? "fill-gray-700 text-gray-700"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ));
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-b from-gray-50 to-white text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section with animated gradient background */}
        <div
          className={`relative overflow-hidden rounded-2xl mb-16 p-8 md:p-12 transition-all duration-700 transform ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90"></div>

          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white opacity-10 blur-xl"></div>
            <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-white opacity-10 blur-xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Customer Feedbacks
            </h1>
            <p className="mt-3 text-xl text-purple-100 max-w-2xl mx-auto">
              Discover what our community is saying about their experiences
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <StatCard
            icon={<Star className="w-6 h-6" />}
            title="Average Rating"
            value={`${averageRating.toFixed(1)}/5`}
            color="from-amber-500 to-yellow-500"
            isDarkMode={isDarkMode}
          />

          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="Total Reviews"
            value={totalFeedbacks}
            color="from-violet-500 to-purple-500"
            isDarkMode={isDarkMode}
          />

          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Happy Customers"
            value={buyerCount + sellerCount}
            color="from-blue-500 to-indigo-500"
            isDarkMode={isDarkMode}
          />

          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="5-Star Reviews"
            value={highRatingCount}
            color="from-emerald-500 to-teal-500"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Filter Tabs */}
        <div
          className={`flex justify-center mb-10 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <div
            className={`inline-flex p-1.5 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } shadow-lg`}
          >
            <FilterButton
              label={`All (${totalFeedbacks})`}
              isActive={selectedRole === "all"}
              onClick={() => setSelectedRole("all")}
              isDarkMode={isDarkMode}
            />
            <FilterButton
              label={`Buyers (${buyerCount})`}
              isActive={selectedRole === "buyer"}
              onClick={() => setSelectedRole("buyer")}
              isDarkMode={isDarkMode}
            />
            <FilterButton
              label={`Sellers (${sellerCount})`}
              isActive={selectedRole === "seller"}
              onClick={() => setSelectedRole("seller")}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeedbacks.map((feedback, index) => (
            <div
              key={feedback?._id}
              className={`rounded-xl overflow-hidden transform transition-all duration-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div
                className={`h-full ${
                  isDarkMode
                    ? "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
                    : "bg-white border border-gray-100"
                } rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300`}
              >
                {/* Card Header with Role Badge and gradient line */}
                <div className="relative">
                  <div className="h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
                  <div className="absolute top-3 right-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        feedback?.role === "seller"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
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
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-50"></div>
                      <img
                        src={
                          feedback?.image ||
                          "/placeholder.svg?height=56&width=56"
                        }
                        alt={feedback?.userName}
                        className="relative h-14 w-14 rounded-full object-cover border-2 border-white dark:border-gray-800"
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {feedback?.userName}
                      </h3>
                      <div className="flex mt-1">
                        {renderStars(feedback?.userRating)}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div className="mt-6 mb-4">
                    <div className="relative">
                      <div
                        className={`absolute -left-1 -top-3 text-5xl ${
                          isDarkMode ? "text-purple-800/50" : "text-purple-200"
                        }`}
                      >
                        "
                      </div>
                      <p
                        className={`relative pl-6 pr-2 py-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        } italic leading-relaxed min-h-[80px]`}
                      >
                        {feedback.userFeedback}
                      </p>
                      <div
                        className={`absolute -right-1 -bottom-6 text-5xl ${
                          isDarkMode ? "text-purple-800/50" : "text-purple-200"
                        }`}
                      >
                        "
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div
                    className={`mt-8 text-right text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatDate(feedback.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFeedbacks.length === 0 && (
          <div
            className={`text-center py-16 rounded-xl shadow-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 text-gray-300 border border-gray-700"
                : "bg-white text-gray-500 border border-gray-100"
            }`}
          >
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-100 dark:bg-gray-700">
              <MessageSquare
                className={`w-12 h-12 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Reviews Found</h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              We couldn't find any {selectedRole !== "all" ? selectedRole : ""}{" "}
              reviews at the moment.
            </p>
          </div>
        )}

        {/* Add Review CTA */}
        <div
          className={`mt-20 text-center transition-all duration-700 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className={`max-w-3xl mx-auto rounded-2xl p-10 ${
              isDarkMode
                ? "bg-gray-800/50 border border-gray-700"
                : "bg-white/80 border border-gray-100"
            } shadow-xl`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Share Your Experience
            </h3>
            <p
              className={`text-lg mb-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              We value your feedback! Help us improve by sharing your thoughts.
            </p>
            <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                Write a Review
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color, isDarkMode }) => (
  <div
    className={`rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
      isDarkMode
        ? "bg-gray-800 border border-gray-700"
        : "bg-white border border-gray-100"
    }`}
  >
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <div
          className={`h-12 w-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <div className="text-white">{icon}</div>
        </div>
        <div>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Filter Button Component
const FilterButton = ({ label, isActive, onClick, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? `${
            isDarkMode
              ? "bg-gray-700 text-white shadow-lg shadow-purple-500/10"
              : "bg-white text-purple-700 shadow-lg"
          }`
        : `${
            isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-purple-700"
          }`
    }`}
  >
    {label}
  </button>
);

export default FeedbackDisplay;
