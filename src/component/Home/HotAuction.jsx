import { useContext, useEffect, useRef, useState } from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaFire } from "react-icons/fa";
import ThemeContext from "../../component/Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const HotAuction = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [visibleIndexes, setVisibleIndexes] = useState([]);
  const itemRefs = useRef([]);
  const axiosSecure = useAxiosSecure();

  const { data: auctionData = [], isLoading, error } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      return res.data || [];
    },
  });

  const acceptedAuctions = auctionData.filter((item) => item.status === "Accepted");

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
  if (!acceptedAuctions.length) return <p className="text-center">No hot auctions available.</p>;

  return (
    <section>
      <div className="w-11/12 mx-auto p-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center mb-4">
            <FaFire className="text-orange-500 mr-2 text-2xl" />
            <h2
              className={`text-3xl font-bold ${
                isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
              }`}
            >
              Hot Auctions
            </h2>
          </div>
          <p
            className={`text-center max-w-2xl mb-8 ${
              isDarkMode ? "text-gray-200" : "text-gray-600"
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
            pauseOnMouseEnter: true,
          }}
          navigation
          modules={[Navigation, Autoplay]}
          className="pb-10"
        >
          {acceptedAuctions.map((item, index) => (
            <SwiperSlide key={item._id || index}>
              <div
                className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r border-purple-400 border from-[#2c150c] to-[#32223f]"
                    : "bg-white"
                } shadow-lg hover:shadow-xl hover:-translate-y-1`}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
              >
                {/* Image container with flash effect */}
                <div className="w-full h-56 overflow-hidden relative">
                  <img
                    src={item.images?.[0] || "default-image-url"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Flash overlay (image only) */}
                  <div
                    className={`absolute inset-0 ${
                      isDarkMode ? "bg-white" : "bg-black"
                    } opacity-0 group-hover:opacity-50 group-hover:animate-flash pointer-events-none`}
                  ></div>
                </div>

                {/* Rest of the card content */}
                <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex justify-between items-center mb-4">
                    <p className="text-yellow-500 font-bold text-xl">${item.startingPrice}</p>
                    <span className="text-sm text-gray-500">
                      {format(new Date(item.endTime), "MMM dd, yyyy, hh:mm a")}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">Category: {item.category}</p>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-4">
                    <div
                      className={`bg-yellow-500 h-2 rounded-full progress-bar ${
                        visibleIndexes.includes(index) ? "animate-progress" : ""
                      }`}
                      style={{
                        width: `${Math.min(item.progress || 0, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`LiveBid`}
                      className="w-full text-center bg-gradient-to-r from-purple-600 via-violet-700 to-purple-800 text-white py-2 rounded-lg hover:from-purple-500 hover:via-violet-600 hover:to-indigo-700 transition"
                    >
                      Bid Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Animation styles */}
        <style jsx global>{`
          @keyframes flash {
            0% { opacity: 0; }
            20% { opacity: 0.3; }
            100% { opacity: 0; }
          }
          .animate-flash {
            animation: flash 0.6s ease-out;
          }
        `}</style>
      </div>
    </section>
  );
};

export default HotAuction;