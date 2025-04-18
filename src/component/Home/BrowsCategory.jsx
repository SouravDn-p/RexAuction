"use client"

import { FaPaintBrush, FaLaptop, FaCar, FaGem, FaTshirt, FaBuilding, FaGavel } from "react-icons/fa"
import { MdCollections } from "react-icons/md"
import { useContext } from "react"
import ThemeContext from "../Context/ThemeContext"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import useAxiosSecure from "../../hooks/useAxiosSecure"

const BrowsCategory = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  // Fetch auction data to get category counts
  const { data: auctionData = [] } = useQuery({
    queryKey: ["auctionDataCategories"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`)
      return res.data || []
    },
  })

  // Calculate the number of items per category
  const getCategoryCount = (categoryName) => {
    if (!auctionData || auctionData.length === 0) return "0 items"
    const count = auctionData.filter((item) => item.status === "Accepted" && item.category === categoryName).length
    return `${count.toLocaleString()} items`
  }

  // Define categories with dynamic item counts
  const categories = [
    {
      id: 1,
      name: "Art",
      items: getCategoryCount("Art"),
      icon: <FaPaintBrush className="h-4 w-4" />,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/30",
    },
    {
      id: 2,
      name: "Collectibles",
      items: getCategoryCount("Collectibles"),
      icon: <MdCollections className="h-4 w-4" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      shadowColor: "shadow-amber-500/30",
    },
    {
      id: 3,
      name: "Electronics",
      items: getCategoryCount("Electronics"),
      icon: <FaLaptop className="h-4 w-4" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-500",
      shadowColor: "shadow-blue-500/30",
    },
    {
      id: 4,
      name: "Vehicles",
      items: getCategoryCount("Vehicles"),
      icon: <FaCar className="h-4 w-4" />,
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/30",
    },
    {
      id: 5,
      name: "Jewelry",
      items: getCategoryCount("Jewelry"),
      icon: <FaGem className="h-4 w-4" />,
      color: "bg-gradient-to-br from-purple-500 to-fuchsia-500",
      shadowColor: "shadow-purple-500/30",
    },
    {
      id: 6,
      name: "Fashion",
      items: getCategoryCount("Fashion"),
      icon: <FaTshirt className="h-4 w-4" />,
      color: "bg-gradient-to-br from-red-500 to-pink-500",
      shadowColor: "shadow-red-500/30",
    },
    {
      id: 7,
      name: "Real Estate",
      items: getCategoryCount("Real Estate"),
      icon: <FaBuilding className="h-4 w-4" />,
      color: "bg-gradient-to-br from-cyan-500 to-blue-500",
      shadowColor: "shadow-cyan-500/30",
    },
    {
      id: 8,
      name: "Antiques",
      items: getCategoryCount("Antiques"),
      icon: <FaGavel className="h-4 w-4" />,
      color: "bg-gradient-to-br from-yellow-500 to-amber-500",
      shadowColor: "shadow-yellow-500/30",
    },
  ]

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    navigate(`/auction?category=${categoryName}`)
  }

  return (
    <section
      className={`py-12 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-white to-violet-50 text-gray-800"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2
            className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-400 to-pink-400"
                : "bg-gradient-to-r from-violet-500 to-indigo-500"
            }`}
          >
            Browse Categories
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Discover unique items in our auction categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4  mt-5">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`group  rounded-lg p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer ${
                isDarkMode ? "" : ""
              }`}
            >
              <div
                className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  isDarkMode ? "bg-gray-700" : "bg-violet-100"
                }`}
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`${category.color} ${category.shadowColor} text-white p-2 rounded-lg shadow-md mb-2`}>
                  {category.icon}
                </div>
                <h3 className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {category.name}
                </h3>
                <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{category.items}</p>
                <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-2 group-hover:w-12 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrowsCategory
