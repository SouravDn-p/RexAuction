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

const categories = [
  { id: 1, name: "Art", items: "2,451 items", icon: <FaPaintBrush /> },
  {
    id: 2,
    name: "Collectibles",
    items: "1,234 items",
    icon: <MdCollections />,
  },
  { id: 3, name: "Electronics", items: "3,456 items", icon: <FaLaptop /> },
  { id: 4, name: "Vehicles", items: "867 items", icon: <FaCar /> },
  { id: 5, name: "Jewelry", items: "1,589 items", icon: <FaGem /> },
  { id: 6, name: "Fashion", items: "2,789 items", icon: <FaTshirt /> },
  { id: 7, name: "Real Estate", items: "456 items", icon: <FaBuilding /> },
  { id: 8, name: "Antiques", items: "1,897 items", icon: <FaGavel /> },
];

const BrowsCategorys = () => {
  return (
    <div className="container mx-auto px-14 lg:px-48 p-2 lg:p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Browse Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 "
          >
            <div className="text-violet-700 text-3xl ">{category.icon}</div>
            <h3 className="text-lg font-semibold mt-2 ">{category.name}</h3>
            <p className="text-gray-500 text-sm">{category.items}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowsCategorys;
