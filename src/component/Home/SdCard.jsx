import React, { useState } from "react";
import { FaTag, FaChevronRight, FaGavel } from "react-icons/fa";
import Logo from "../../assets/Logos/Rex_2.png";

const trendingData = [
  // Car Categories
  {
    title: "Used Cars under $15,000",
    img: "https://i.ibb.co/F2H7Wb6/image.png",
    price: "$12,500",
    category: "cars",
  },
  {
    title: "Compact SUVs",
    img: "https://i.ibb.co/nsPdGCGH/image.png",
    price: "$18,900",
    category: "cars",
  },
  {
    title: "Electric Cars",
    img: "https://i.ibb.co/20DDpz7G/image.png",
    price: "$35,000",
    category: "cars",
  },
  {
    title: "Luxury Cars",
    img: "https://i.ibb.co/JRfzyRkf/image.png",
    price: "$60,000",
    category: "cars",
  },

  // Property Categories
  {
    title: "Apartments for Rent",
    img: "https://i.ibb.co/99PHsJh6/image.png",
    price: "$1,200/month",
    category: "property",
  },
  {
    title: "Luxury Villas",
    img: "https://i.ibb.co/YBpBvGcM/image.png",
    price: "$850,000",
    category: "property",
  },
  {
    title: "Commercial Spaces",
    img: "https://i.ibb.co/J0zqqdL/image.png",
    price: "$4,500/month",
    category: "property",
  },
  {
    title: "Beachfront Houses",
    img: "https://i.ibb.co/BHhxG2CT/image.png",
    price: "$1,200,000",
    category: "property",
  },

  // Electronics Categories
  {
    title: "Latest Smartphones",
    img: "https://i.ibb.co/67pkRx4v/image.png",
    price: "$999",
    category: "electronics",
  },
  {
    title: "Laptops & Computers",
    img: "https://i.ibb.co/Vcz92Py7/image.png",
    price: "$1,500",
    category: "electronics",
  },
  {
    title: "Gaming Consoles",
    img: "https://i.ibb.co/v4B1V2Pn/image.png",
    price: "$499",
    category: "electronics",
  },
  {
    title: "Smart TVs",
    img: "https://i.ibb.co/jP8DthB1/image.png",
    price: "$1,200",
    category: "electronics",
  },
];

const SdCard = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? trendingData
      : trendingData.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full bg-gradient-to-b from-violet-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-violet-100 p-3 rounded-full mb-4">
            <FaGavel className="w-8 h-8 text-violet-600" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            <span className="text-violet-600">Latest</span> Auctions
          </h2>

          <p className="text-gray-500 text-center max-w-2xl mb-8">
            Discover our most recent and trending auctions across various
            categories
          </p>

          <div className="w-full max-w-md mb-8">
            <div className="grid grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveCategory("all")}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  activeCategory === "all"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveCategory("cars")}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  activeCategory === "cars"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Cars
              </button>
              <button
                onClick={() => setActiveCategory("property")}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  activeCategory === "property"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Property
              </button>
              <button
                onClick={() => setActiveCategory("electronics")}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  activeCategory === "electronics"
                    ? "bg-violet-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Electronics
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden border border-violet-100 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-violet-100 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/80 backdrop-blur-sm font-medium px-2 py-1 rounded-full text-sm flex items-center">
                    <FaTag className="w-3.5 h-3.5 mr-1" />
                    {item.category.charAt(0).toUpperCase() +
                      item.category.slice(1)}
                  </span>
                </div>

                <img
                  src={item.img || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-sm whitespace-nowrap">
                    {item.price}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                  View Details
                  <FaChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SdCard;
