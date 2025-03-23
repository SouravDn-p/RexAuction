import { useContext, useEffect, useRef, useState } from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaFire } from "react-icons/fa";
import ThemeContext from "../../component/Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const HotAuction = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [visibleIndexes, setVisibleIndexes] = useState([]);
  const itemRefs = useRef([]);
  const axiosSecure = useAxiosSecure();

  // Fetch auction data using React Query
  const { data: auctionData = [], isLoading, error } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      return res.data || [];
    },
  });
  console.log(auctionData)

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleIndexes((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => {
      itemRefs.current.forEach((el) => el && observer.unobserve(el));
    };
  }, [auctionData]);

  if (isLoading) return <p className="text-center">Loading auctions...</p>;
  if (error) return <p className="text-center text-red-500">Error loading auctions.</p>;
  if (!auctionData.length) return <p className="text-center">No hot auctions available.</p>;

  return (
    <section>
      <div className="w-11/12 mx-auto p-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center mb-4">
            <FaFire className="text-orange-500 mr-2 text-2xl" />
            <h2
              className={`text-3xl font-bold ${isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
                }`}
            >
              Hot Auctions
            </h2>
          </div>
          <p
            className={`text-center max-w-2xl mb-8 ${isDarkMode ? "text-gray-200" : "text-gray-600"
              }`}
          >
            Discover our most popular and trending auction items. Bid now before they're gone!
          </p>
        </div>

        {/* Swiper Component */}
        <Swiper
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          navigation
          modules={[Navigation, Autoplay]}
          className="pb-10"
        >
          {auctionData?.map((item, index) => (
            <SwiperSlide key={item._id || index}>
              <div
                className={`rounded-lg overflow-hidden transition-transform duration-500 ${isDarkMode
                    ? "bg-gradient-to-r border-purple-400 border from-[#2c150c] to-[#32223f]"
                    : "bg-white"
                  } shadow-lg`}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
              >
                {/* Auction Image */}
                <div className="w-full h-56 overflow-hidden">
                  {/* Check if images exist and use the first image */}
                  <img
                    src={item.images?.[0] || "default-image-url"} // Fallback to a default image if images array is empty or undefined
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Auction Details */}
                <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {/* Auction Title */}
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

                  {/* Price and Time Left */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-yellow-500 font-bold text-xl">${item.startingPrice}</p>
                    <span className="text-sm text-gray-500">{item.endTime}</span>
                  </div>

                  {/* Category */}
                  <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                    <div
                      className={`bg-yellow-500 h-2 rounded-full progress-bar ${visibleIndexes.includes(index) ? "animate-progress" : ""
                        }`}
                      style={{
                        width: `${Math.min(item.progress || 0, 100)}%`,
                      }}
                    ></div>
                  </div>

                  {/* Bids and Action Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.bidIncrement} bid increment</span>
                    <button className="w-full bg-gradient-to-r from-purple-600 via-violet-700 to-purple-800 text-white py-2 rounded-lg hover:from-purple-500 hover:via-violet-600 hover:to-indigo-700 transition">
                      Bid Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
    </section>
  );
};

export default HotAuction;
