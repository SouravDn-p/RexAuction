import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaGavel, FaHeart } from "react-icons/fa";
import ThemeContext from "../Context/ThemeContext";

const trendingAuctions = [
  {
    title: "Limited Edition Watch",
    price: "$4,500",
    bids: 23,
    likes: 45,
    img: "https://img.freepik.com/premium-photo/fashionable-elegant-men-s-watch-lying-outdoors-stone-stylish-accessories-nature-forest-copy-space-place-travel-compass-adventure-rocks_370059-2013.jpg",
  },
  {
    title: "Classic Camera Collection",
    price: "$1,900",
    bids: 18,
    likes: 27,
    img: "https://img.freepik.com/premium-photo/close-up-camera-table_1048944-30127704.jpg",
  },
  {
    title: "Vintage Furniture Set",
    price: "$2,800",
    bids: 15,
    likes: 32,
    img: "https://img.freepik.com/premium-photo/collection-antique-chairs-with-mirror-top_1077802-129392.jpg",
  },
  {
    title: "Camera Collection",
    price: "$6,900",
    bids: 55,
    likes: 87,
    img: "https://img.freepik.com/premium-photo/close-up-camera-bag-against-white-background_1048944-9527983.jpg",
  },
  {
    title: "Old Camera",
    price: "$22,990",
    bids: 18,
    likes: 237,
    img: "https://img.freepik.com/premium-photo/close-up-camera-table_1048944-9088136.jpg",
  },
  {
    title: "Retro Camera",
    price: "$13,900",
    bids: 184,
    likes: 2745,
    img: "https://img.freepik.com/free-photo/top-view-retro-camera_23-2148372215.jpg",
  },
];

const TrendingAuction = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`w-full mx-auto p-14 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">Trending Auctions</h2>

      <Swiper
        spaceBetween={20}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        navigation={true}
        autoplay={{ delay: 3000 }}
        modules={[Navigation, Autoplay]}
        className="pb-10"
      >
        {trendingAuctions.map((auction, index) => (
          <SwiperSlide key={index}>
            <div
              className={`rounded-lg overflow-hidden shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Image container with flash effect */}
              <div className="relative group w-full h-48 overflow-hidden">
                <img
                  src={auction.img}
                  alt={auction.title}
                  className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
                />
                {/* Purple Flash Overlay ON IMAGE ONLY */}
                <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10" />
              </div>

              {/* Auction Info */}
              <div
                className={`p-4 ${isDarkMode ? "text-white" : "text-black"}`}
              >
                <h3 className="text-lg font-semibold">{auction.title}</h3>
                <p className="text-purple-600 font-bold text-xl">
                  {auction.price}
                </p>
                <div
                  className={`flex items-center justify-between text-sm mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <FaGavel /> {auction.bids} bids
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart /> {auction.likes}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendingAuction;
