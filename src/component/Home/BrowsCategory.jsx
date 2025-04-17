import {
  FaPaintBrush,
  FaLaptop,
  FaCar,
  FaGem,
  FaTshirt,
  FaBuilding,
  FaGavel,
} from "react-icons/fa";
import { MdCollections } from "react-icons/md";
import { useContext } from "react";
import ThemeContext from "../Context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BrowsCategory = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fetch auction data to get category counts
  const { data: auctionData = [] } = useQuery({
    queryKey: ["auctionDataCategories"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      return res.data || [];
    },
  });

  // Calculate the number of items per category
  const getCategoryCount = (categoryName) => {
    if (!auctionData || auctionData.length === 0) return "0 items";

    // Filter accepted auctions by category
    const count = auctionData.filter(
      (item) =>
        item.status === "Accepted" &&
        (categoryName === "Antiques"
          ? item.category === "Antiques"
          : categoryName === "Electronics"
          ? item.category === "Electronics"
          : categoryName === "Vehicles"
          ? item.category === "Vehicles"
          : categoryName === "Jewelry"
          ? item.category === "Jewelry"
          : categoryName === "Fashion"
          ? item.category === "Fashion"
          : categoryName === "Real Estate"
          ? item.category === "Real Estate"
          : categoryName === "Art"
          ? item.category === "Art"
          : categoryName === "Collectibles"
          ? item.category === "Collectibles"
          : false)
    ).length;

    return `${count.toLocaleString()} items`;
  };

  // Define categories with dynamic item counts
  const categories = [
    {
      id: 1,
      name: "Art",
      items: getCategoryCount("Art"),
      icon: <FaPaintBrush className="h-6 w-6" />,
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/20",
    },
    {
      id: 2,
      name: "Collectibles",
      items: getCategoryCount("Collectibles"),
      icon: <MdCollections className="h-6 w-6" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
      shadowColor: "shadow-amber-500/20",
    },
    {
      id: 3,
      name: "Electronics",
      items: getCategoryCount("Electronics"),
      icon: <FaLaptop className="h-6 w-6" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      shadowColor: "shadow-blue-500/20",
    },
    {
      id: 4,
      name: "Vehicles",
      items: getCategoryCount("Vehicles"),
      icon: <FaCar className="h-6 w-6" />,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      id: 5,
      name: "Jewelry",
      items: getCategoryCount("Jewelry"),
      icon: <FaGem className="h-6 w-6" />,
      color: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
      shadowColor: "shadow-purple-500/20",
    },
    {
      id: 6,
      name: "Fashion",
      items: getCategoryCount("Fashion"),
      icon: <FaTshirt className="h-6 w-6" />,
      color: "bg-gradient-to-br from-red-500 to-pink-600",
      shadowColor: "shadow-red-500/20",
    },
    {
      id: 7,
      name: "Real Estate",
      items: getCategoryCount("Real Estate"),
      icon: <FaBuilding className="h-6 w-6" />,
      color: "bg-gradient-to-br from-cyan-500 to-blue-600",
      shadowColor: "shadow-cyan-500/20",
    },
    {
      id: 8,
      name: "Antiques",
      items: getCategoryCount("Antiques"),
      icon: <FaGavel className="h-6 w-6" />,
      color: "bg-gradient-to-br from-yellow-500 to-amber-600",
      shadowColor: "shadow-yellow-500/20",
    },
  ];

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    navigate(`/auction?category=${categoryName}`);
  };

  return (
    <section
      className={`relative overflow-hidden py-16 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-950 text-white"
          : "bg-gradient-to-b from-violet-50 to-violet-100 text-gray-800"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
            }`}
          >
            Explore Categories
          </h2>
          <p
            className={`mt-4 max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover amazing items across our diverse auction categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`relative group rounded-xl p-6 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl cursor-pointer ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              }`}
            >
              {/* Hover overlay */}
              <div
                className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-slate-800 to-gray-800"
                    : "bg-gradient-to-r from-violet-100 to-indigo-100"
                }`}
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`${category.color} ${category.shadowColor} text-white p-4 rounded-xl shadow-lg mb-5`}
                >
                  {category.icon}
                </div>

                <h3
                  className={`font-bold text-xl mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {category.name}
                </h3>

                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {category.items}
                </p>

                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-5 group-hover:w-20 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowsCategory;