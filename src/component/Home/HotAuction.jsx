import { useContext, useEffect, useRef, useState } from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaClock, FaFire, FaGavel } from "react-icons/fa";
import ThemeContext from "../../component/Context/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const HotAuction = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [visibleIndexes, setVisibleIndexes] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const itemRefs = useRef([]);
  const axiosSecure = useAxiosSecure();

  // Fetch auction data using React Query
  const {
    data: auctionData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      return res.data || [];
    },
  });

  // Initialize and update countdowns
  useEffect(() => {
    if (!auctionData || auctionData.length === 0) return;

    const interval = setInterval(() => {
      const updatedCountdowns = {};
      const acceptedAuctions = auctionData.filter(
        (item) => item.status === "Accepted"
      );

      acceptedAuctions.forEach((item, index) => {
        if (!item.endTime) return;

        const endTime = new Date(item.endTime).getTime();
        const currentTime = new Date().getTime();
        const remainingSecond = Math.max(
          0,
          Math.floor((endTime - currentTime) / 1000)
        );

        console.log(auctionData[index]);
        updatedCountdowns[index] = remainingSecond;
      });

      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionData]); // Added dependency

  // Filter auctions with status 'Accepted'
  const acceptedAuctions = auctionData.filter(
    (item) => item.status === "Accepted"
  );

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
  if (error)
    return <p className="text-center text-red-500">Error loading auctions.</p>;
  if (!acceptedAuctions.length)
    return <p className="text-center">No hot auctions available.</p>;

  return (
    <>
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
              Discover our most popular and trending auction items. Bid now
              before they're gone!
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
            {acceptedAuctions.map((item, index) => (
              <SwiperSlide key={item._id || index}>
                <div
                  className={`rounded-lg overflow-hidden transition-transform duration-500 ${
                    isDarkMode
                      ? "bg-gradient-to-r border-purple-400 border from-[#2c150c] to-[#32223f]"
                      : "bg-white"
                  } shadow-lg`}
                  ref={(el) => (itemRefs.current[index] = el)}
                  data-index={index}
                >
                  {/* Auction Image */}
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src={item.images?.[0] || "default-image-url"} // Fallback to a default image
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Auction Details */}
                  <div
                    className={`p-4 ${
                      isDarkMode ? "text-white bg-gray-950" : "text-gray-950 "
                    }`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>

                    {/* Price and Time Left */}
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-yellow-500 font-bold text-xl">
                        ${item.startingPrice}
                      </p>
                      <span className="text-sm text-gray-500">
                        {format(
                          new Date(item.endTime),
                          "MMM dd, yyyy, hh:mm a"
                        )}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      Category: {item.category}
                    </p>

                    <div className="p-0">
                      <h3 className="text-lg font-semibold text-gray-100 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-yellow-400 font-bold text-xl mt-1">
                        {item.price}
                      </p>
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
                          <span>{item.bids || 0} bids</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-gray-400 text-sm my-2">
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Live
                        </span>
                        <span>{item.bids}</span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                        <div className="bg-violet-600 h-2 rounded-full w-3/5"></div>
                      </div>
                      {/* Bid Button */}
                      <div className="flex justify-between items-center text-center mt-4 ">
                        <Link
                          to={`liveBid/${item._id}`}
                          className="w-full  bg-gradient-to-r from-purple-600 via-violet-700 to-purple-800 text-white py-2 rounded-lg hover:from-purple-500 hover:via-violet-600 hover:to-indigo-700 transition"
                        >
                          Bid Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default HotAuction;
