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
      icon: <FaPaintBrush />,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 2,
      name: "Collectibles",
      items: getCategoryCount("Collectibles"),
      icon: <MdCollections />,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: 3,
      name: "Electronics",
      items: getCategoryCount("Electronics"),
      icon: <FaLaptop />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 4,
      name: "Vehicles",
      items: getCategoryCount("Vehicles"),
      icon: <FaCar />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: 5,
      name: "Jewelry",
      items: getCategoryCount("Jewelry"),
      icon: <FaGem />,
      color: "from-purple-500 to-fuchsia-600",
    },
    {
      id: 6,
      name: "Fashion",
      items: getCategoryCount("Fashion"),
      icon: <FaTshirt />,
      color: "from-red-500 to-pink-600",
    },
    {
      id: 7,
      name: "Real Estate",
      items: getCategoryCount("Real Estate"),
      icon: <FaBuilding />,
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: 8,
      name: "Antiques",
      items: getCategoryCount("Antiques"),
      icon: <FaGavel />,
      color: "from-yellow-500 to-amber-600",
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
          ? "bg-gray-900"
          : "bg-gradient-to-b from-violet-50 to-indigo-50"
      }`}
    >
      {/* Decorative elements */}
      {!isDarkMode && (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-400/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-indigo-400/10 blur-3xl"></div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
                : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
            }`}
          >
            Explore Categories
          </h2>
          <div
            className={`w-24 h-1 mx-auto mb-4 rounded-full ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gradient-to-r from-indigo-400 to-purple-400"
            }`}
          ></div>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover amazing items across our diverse auction categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
                  : "bg-white"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              {/* Animated border bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                <div
                  className={`absolute bottom-0 left-0 h-full w-0 bg-gradient-to-r ${category.color} group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]`}
                ></div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col items-center text-center h-full">
                <div
                  className={`mb-3 p-4 rounded-full bg-gradient-to-br ${category.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-xl sm:text-2xl">{category.icon}</div>
                </div>
                <h3
                  className={`text-sm sm:text-base font-bold mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {category.name}
                </h3>
                <p
                  className={`text-xs sm:text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {category.items}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowsCategory;
