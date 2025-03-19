import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Add Autoplay module
import "swiper/css";
import "swiper/css/navigation";
import { FaGavel, FaHeart } from "react-icons/fa";

const trendingAuctions = [
  {
    title: "Limited Edition Watch",
    price: "$4,500",
    bids: 23,
    likes: 45,
    img: "https://img.freepik.com/premium-photo/fashionable-elegant-men-s-watch-lying-outdoors-stone-stylish-accessories-nature-forest-copy-space-place-travel-compass-adventure-rocks_370059-2013.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Classic Camera Collection",
    price: "$1,900",
    bids: 18,
    likes: 27,
    img: "https://img.freepik.com/premium-photo/close-up-camera-table_1048944-30127704.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Vintage Furniture Set",
    price: "$2,800",
    bids: 15,
    likes: 32,
    img: "https://img.freepik.com/premium-photo/collection-antique-chairs-with-mirror-top_1077802-129392.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Classic Camera Collection",
    price: "$6,900",
    bids: 55,
    likes: 87,
    img: "https://img.freepik.com/premium-photo/close-up-camera-bag-against-white-background_1048944-9527983.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Classic Camera Collection",
    price: "$22,990",
    bids: 18,
    likes: 237,
    img: "https://img.freepik.com/premium-photo/close-up-camera-table_1048944-9088136.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
  {
    title: "Classic Camera Collection",
    price: "$13,900",
    bids: 184,
    likes: 2745,
    img: "https://img.freepik.com/free-photo/top-view-retro-camera_23-2148372215.jpg?ga=GA1.1.960511258.1740671009&semt=ais_hybrid",
  },
];

const TrendingAuction = () => {
  return (
    <div className="w-11/12 mx-auto p-2 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Trending Auctions
      </h2>

      <Swiper
        spaceBetween={20}
        // slidesPerView={3}

        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        navigation={true}
        autoplay={{ delay: 3000 }} // Auto play every 3 seconds
        modules={[Navigation, Autoplay]} // Include Autoplay module
        className="pb-10"
      >
        {trendingAuctions.map((auction, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={auction.img} className="w-full  h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg text-black font-semibold">{auction.title}</h3>
                <p className="text-purple-600 font-bold text-xl">
                  {auction.price}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm mt-2">
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
