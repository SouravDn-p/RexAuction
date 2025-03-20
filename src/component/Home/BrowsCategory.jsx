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

const categories = [
  { id: 1, name: "Art", items: "2,451 items", icon: <FaPaintBrush /> },
  { id: 2, name: "Collectibles", items: "1,234 items", icon: <MdCollections /> },
  { id: 3, name: "Electronics", items: "3,456 items", icon: <FaLaptop /> },
  { id: 4, name: "Vehicles", items: "867 items", icon: <FaCar /> },
  { id: 5, name: "Jewelry", items: "1,589 items", icon: <FaGem /> },
  { id: 6, name: "Fashion", items: "2,789 items", icon: <FaTshirt /> },
  { id: 7, name: "Real Estate", items: "456 items", icon: <FaBuilding /> },
  { id: 8, name: "Antiques", items: "1,897 items", icon: <FaGavel /> },
];

const BrowsCategory = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <section
    className={`transition-colors duration-300 ${
      isDarkMode
        ? "bg-[#151e28]  text-white" 
        : "bg-purple-100 text-gray-900"
    }`}
  >
    <div className={`container ${isDarkMode ? "text-white" : "text-black"} mx-auto px-14 lg:px-48 p-2 lg:p-6`}>
      <div className="text-center mb-10">
        <h2
          className={`text-3xl font-bold ${isDarkMode
            ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800"
            : "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
          }`}
        >
          Browse Categories
        </h2>
        <div className="w-1/5 h-[2px] bg-purple-500 rounded-full mx-auto mt-2"></div>
        <p className={`mt-4 ${isDarkMode ? "text-gray-200" : "text-gray-600"} max-w-2xl mx-auto`}>
          Discover Auction By Categories
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0 gap-y-6">
  {categories.map((category) => (
    <button
      key={category.id}
      className={`group flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full transition-all duration-300 border shadow-md
        ${
          isDarkMode
            ? "bg-[#1f2a38] text-white border-gray-700 hover:border-purple-600 hover:bg-[#2e3d57]"
            : "bg-white text-black border-gray-200 hover:border-purple-400 hover:bg-purple-100"
        }`}
    >
      <div
        className={`text-2xl mb-1 transition-colors duration-300 ${
          isDarkMode ? "text-purple-300" : "text-purple-700"
        } group-hover:text-purple-500`}
      >
        {category.icon}
      </div>
      <h3 className="text-xs font-medium">{category.name}</h3>
      <p
        className={`text-[10px] ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {category.items}
      </p>
    </button>
  ))}
</div>


    </div>
  </section>
  
  
  );
};

export default BrowsCategory;
