"use client"

import { useState, useContext, useEffect } from "react"
import useAxiosPublic from "../../../../hooks/useAxiosPublic"
import ThemeContext from "../../../Context/ThemeContext"
import { Star, MessageSquare, Users, ChevronRight, Award, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FeedbackDisplay = () => {
  const [selectedRole, setSelectedRole] = useState("all")
  const [feedbacks, setFeedbacks] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const axiosPublic = useAxiosPublic()
  const { isDarkMode } = useContext(ThemeContext)

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // load feedback
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosPublic.get("/feedbacks")
        if (response.status === 200) {
          setFeedbacks(response.data)
        } else {
          console.error("Error fetching feedbacks:", response.status)
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
      }
    }

    fetchFeedbacks()
  }, [axiosPublic])

  // Filter feedbacks based on selected role
  const filteredFeedbacks =
    selectedRole === "all" ? feedbacks : feedbacks.filter((feedback) => feedback.role.toLowerCase() === selectedRole)

  // Calculate statistics
  const totalFeedbacks = feedbacks.length
  const averageRating = feedbacks.reduce((sum, feedback) => sum + feedback.userRating, 0) / totalFeedbacks || 0
  const sellerCount = feedbacks.filter((feedback) => feedback.role === "seller").length
  const buyerCount = feedbacks.filter((feedback) => feedback.role === "buyer").length
  const highRatingCount = feedbacks.filter((feedback) => feedback.userRating >= 4).length

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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
      ))
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-float-medium"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-fuchsia-500/10 blur-3xl animate-float-fast"></div>
        </div>

        {/* Header Section with animated gradient background */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative overflow-hidden rounded-3xl mb-16 p-8 md:p-12 shadow-2xl ${
            isDarkMode ? "shadow-purple-900/30" : "shadow-purple-500/20"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-90"></div>
          
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                initial={{ 
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  width: Math.random() * 10 + 2,
                  height: Math.random() * 10 + 2,
                  opacity: Math.random() * 0.5 + 0.1
                }}
                animate={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  transition: {
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-white">
                Customer Voices
              </span>
            </motion.h1>
            <motion.p 
              className="mt-3 text-xl text-purple-100 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Real experiences from our valued community members
            </motion.p>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            icon={<Star className="w-6 h-6" />}
            title="Average Rating"
            value={`${averageRating.toFixed(1)}/5`}
            color="from-amber-500 to-yellow-500"
            isDarkMode={isDarkMode}
            delay={0.1}
          />

          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="Total Reviews"
            value={totalFeedbacks}
            color="from-violet-500 to-purple-600"
            isDarkMode={isDarkMode}
            delay={0.2}
          />

          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Community Members"
            value={buyerCount + sellerCount}
            color="from-blue-500 to-indigo-600"
            isDarkMode={isDarkMode}
            delay={0.3}
          />

          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="Top Ratings"
            value={highRatingCount}
            color="from-emerald-500 to-teal-600"
            isDarkMode={isDarkMode}
            delay={0.4}
          />
        </div>

        {/* Filter Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`inline-flex p-1.5 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} shadow-lg`}>
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
        </motion.div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full"
                >
                  <div
                    className={`h-full rounded-2xl overflow-hidden relative group ${
                      isDarkMode
                        ? "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700"
                        : "bg-white border border-gray-100"
                    } shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      feedback?.role === "seller" 
                        ? "bg-purple-500/10" 
                        : "bg-blue-500/10"
                    }`}></div>
                    
                    {/* Card Header with Role Badge and gradient line */}
                    <div className="relative">
                      <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
                      <div className="absolute top-3 right-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            feedback?.role === "seller"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                        >
                          {feedback?.role?.charAt(0)?.toUpperCase() + feedback?.role?.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-sm opacity-50"></div>
                          <img
                            src={feedback?.image || "/placeholder.svg?height=56&width=56"}
                            alt={feedback?.userName}
                            className="relative h-14 w-14 rounded-full object-cover border-2 border-white dark:border-gray-800"
                          />
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            {feedback?.userName}
                          </h3>
                          <div className="flex mt-1">{renderStars(feedback?.userRating)}</div>
                        </div>
                      </div>

                      {/* Feedback Content */}
                      <div className="mt-6 mb-4">
                        <div className="relative">
                          <Quote className={`absolute -left-1 -top-3 w-6 h-6 ${
                            isDarkMode ? "text-purple-500/30" : "text-purple-300"
                          }`} />
                          <p
                            className={`relative pl-6 pr-2 py-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } italic leading-relaxed min-h-[80px]`}
                          >
                            {feedback.userFeedback}
                          </p>
                          <Quote className={`absolute -right-1 -bottom-6 w-6 h-6 transform rotate-180 ${
                            isDarkMode ? "text-purple-500/30" : "text-purple-300"
                          }`} />
                        </div>
                      </div>

                      {/* Date */}
                      <div className={`mt-8 text-right text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {formatDate(feedback.date)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`text-center py-16 rounded-xl shadow-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800/50 text-gray-300 border border-gray-700"
                      : "bg-white/80 text-gray-500 border border-gray-100"
                  }`}
                >
                  <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-100 dark:bg-gray-700">
                    <MessageSquare className={`w-12 h-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Reviews Found</h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    We couldn't find any {selectedRole !== "all" ? selectedRole : ""} reviews at the moment.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Review CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div
            className={`max-w-3xl mx-auto rounded-2xl p-10 relative overflow-hidden ${
              isDarkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white/80 border border-gray-100"
            } shadow-xl`}
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
            
            <h3 className={`text-2xl md:text-3xl font-bold mb-4 relative z-10 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              Your Opinion Matters
            </h3>
            <p className={`text-lg mb-8 relative z-10 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Share your experience and help us grow better together
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Write a Review
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ icon, title, value, color, isDarkMode, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] ${
      isDarkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white/80 border border-gray-100"
    }`}
  >
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1 }}
          className={`h-12 w-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}
        >
          <div className="text-white">{icon}</div>
        </motion.div>
        <div>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{title}</p>
          <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
)

// Filter Button Component
const FilterButton = ({ label, isActive, onClick, isDarkMode }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? `${
            isDarkMode 
              ? "bg-gray-700 text-white shadow-lg shadow-purple-500/10" 
              : "bg-white text-purple-700 shadow-lg"
          }`
        : `${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-purple-700"}`
    }`}
  >
    {label}
  </motion.button>
)

export default FeedbackDisplay