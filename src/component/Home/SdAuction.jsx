import React, { useState, useEffect } from "react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FaClock,
  FaGavel,
  FaFire,
  FaRegHeart,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const auctionData = [
  {
    title: "Vintage Rolex Submariner",
    price: "$24,500",
    timeLeft: "2h 15m",
    bids: 23,
    img: "https://i.ibb.co/tT6LKgP/image.png",
    progress: 65,
    featured: true,
    category: "Watches",
  },
  {
    title: "Rare Diamond Necklace",
    price: "$138,000",
    timeLeft: "4h 30m",
    bids: 18,
    img: "https://i.ibb.co/8n10pmw/image.png",
    progress: 45,
    featured: false,
    category: "Jewelry",
  },
  {
    title: "Classic Ferrari 250 GT",
    price: "$2,450,000",
    timeLeft: "12h 45m",
    bids: 35,
    img: "https://i.ibb.co/ymh54KN/image.png",
    progress: 80,
    featured: true,
    category: "Cars",
  },
  {
    title: "Patek Philippe Nautilus",
    price: "$105,000",
    timeLeft: "5h 20m",
    bids: 27,
    img: "https://i.ibb.co/WWqqZXH/image.png",
    progress: 70,
    featured: false,
    category: "Watches",
  },
  {
    title: "Lamborghini Miura",
    price: "$3,200,000",
    timeLeft: "9h 10m",
    bids: 42,
    img: "https://i.ibb.co/CshWnMV/image.png",
    progress: 90,
    featured: true,
    category: "Cars",
  },
  {
    title: "Antique Persian Rug",
    price: "$75,000",
    timeLeft: "6h 5m",
    bids: 15,
    img: "https://i.ibb.co/mVMrhPY/image.png",
    progress: 40,
    featured: false,
    category: "Art",
  },
  {
    title: "Rolex Daytona Platinum",
    price: "$180,000",
    timeLeft: "3h 45m",
    bids: 30,
    img: "https://i.ibb.co/QFmqvHr/image.png",
    progress: 75,
    featured: false,
    category: "Watches",
  },
  {
    title: "1967 Chevrolet Corvette Stingray",
    price: "$250,000",
    timeLeft: "8h 50m",
    bids: 20,
    img: "https://i.ibb.co/B27D0Sf/image.png",
    progress: 55,
    featured: false,
    category: "Cars",
  },
  {
    title: "Cartier Panther Bracelet",
    price: "$280,000",
    timeLeft: "7h 30m",
    bids: 22,
    img: "https://i.ibb.co/NgdQH2f/image.png",
    progress: 60,
    featured: false,
    category: "Jewelry",
  },
  {
    title: "Mona Lisa Replica Painting",
    price: "$45,000",
    timeLeft: "10h 15m",
    bids: 12,
    img: "https://i.ibb.co/TqcJP8H/image.png",
    progress: 30,
    featured: false,
    category: "Art",
  },
  {
    title: "Bugatti Type 57 SC Atlantic",
    price: "$40,000,000",
    timeLeft: "1d 4h",
    bids: 50,
    img: "https://i.ibb.co/xSCNTQc/image.png",
    progress: 95,
    featured: true,
    category: "Cars",
  },
  {
    title: "Michael Jordan Signed Jersey",
    price: "$500,000",
    timeLeft: "14h 30m",
    bids: 25,
    img: "https://i.ibb.co/6cx38SZ/image.png",
    progress: 65,
    featured: false,
    category: "Sports",
  },
];

const SdAuction = () => {
  const [favorites, setFavorites] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Cars", "Watches", "Jewelry", "Art", "Sports"];

  const filteredAuctions =
    activeCategory === "All"
      ? auctionData
      : auctionData.filter((item) => item.category === activeCategory);

  // Toggle favorite status
  const toggleFavorite = (index) => {
    if (favorites.includes(index)) {
      setFavorites(favorites.filter((i) => i !== index));
    } else {
      setFavorites([...favorites, index]);
    }
  };

  // Initialize and update countdowns
  useEffect(() => {
    // Parse the time strings and set initial countdowns
    const initialCountdowns = {};

    auctionData.forEach((item, index) => {
      const timeString = item.timeLeft;
      let totalSeconds = 0;

      if (timeString.includes("d")) {
        const days = parseInt(timeString.split("d")[0]);
        totalSeconds += days * 24 * 60 * 60;

        const hoursPart = timeString.split("d ")[1];
        if (hoursPart && hoursPart.includes("h")) {
          const hours = parseInt(hoursPart.split("h")[0]);
          totalSeconds += hours * 60 * 60;
        }
      } else if (timeString.includes("h")) {
        const hours = parseInt(timeString.split("h")[0]);
        totalSeconds += hours * 60 * 60;

        const minutesPart = timeString.split("h ")[1];
        if (minutesPart && minutesPart.includes("m")) {
          const minutes = parseInt(minutesPart.split("m")[0]);
          totalSeconds += minutes * 60;
        }
      }

      initialCountdowns[index] = totalSeconds;
    });

    setCountdowns(initialCountdowns);

    // Update countdowns every second
    const timer = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        const newCountdowns = { ...prevCountdowns };

        Object.keys(newCountdowns).forEach((key) => {
          if (newCountdowns[key] > 0) {
            newCountdowns[key] -= 1;
          }
        });

        return newCountdowns;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format seconds to display time
  const formatTime = (seconds) => {
    if (seconds <= 0) return "Ended";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${secs}s`;
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center mb-4">
            <FaFire className="text-orange-500 mr-2 text-2xl" />
            <h2 className="text-3xl font-bold text-gray-900">Hot Auctions</h2>
          </div>
          <p className="text-gray-600 text-center max-w-2xl mb-8">
            Discover our most popular and trending auction items. Bid now before
            they're gone!
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-violet-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          modules={[Navigation, Autoplay, Pagination]}
          className="pb-14"
        >
          {filteredAuctions.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative">
                  {item.featured && (
                    <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <FaFire className="mr-1" /> Featured
                    </div>
                  )}

                  <button
                    onClick={() => toggleFavorite(index)}
                    className="absolute top-3 right-3 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300"
                    aria-label={
                      favorites.includes(index)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.includes(index) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-600" />
                    )}
                  </button>

                  <img
                    src={item.img || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                  />

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex justify-between items-center mb-3">
                    <p className="text-orange-500 font-bold text-xl">
                      {item.price}
                    </p>
                    <span className="bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-500 text-sm mb-3">
                    <div className="flex items-center">
                      <FaClock className="mr-1 text-violet-600" />
                      <span
                        className={
                          countdowns[index] < 3600
                            ? "text-red-500 font-semibold"
                            : ""
                        }
                      >
                        {formatTime(countdowns[index])}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaGavel className="mr-1 text-violet-600" />
                      <span>{item.bids} bids</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4 flex justify-between">
                    <span>Reserve price</span>
                    <span className="font-medium">
                      {item.progress}% reached
                    </span>
                  </div>

                  {/* Bid Button */}
                  <button className="mt-auto w-full bg-violet-900 text-white py-3 rounded-lg hover:bg-violet-800 transition-colors duration-300 flex items-center justify-center font-medium">
                    Bid Now
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <button className="swiper-button-prev-custom w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-violet-900 hover:bg-violet-900 hover:text-white transition-colors duration-300">
            <FaChevronLeft />
          </button>
          <button className="swiper-button-next-custom w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-violet-900 hover:bg-violet-900 hover:text-white transition-colors duration-300">
            <FaChevronRight />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href="/auction"
            className="inline-flex items-center px-6 py-3 border border-violet-900 text-violet-900 bg-white rounded-lg hover:bg-violet-900 hover:text-white transition-colors duration-300"
          >
            View All Auctions
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SdAuction;
