import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaSearch, FaAngleRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SdSlider = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after component mounts
    setIsLoaded(true);

    // You can use any animation library here
    // For example with vanilla JS:
    const searchBar = document.querySelector(".search-bar-container");
    if (searchBar) {
      setTimeout(() => {
        searchBar.style.opacity = "1";
        searchBar.style.transform = "translate(-50%, -50%) translateY(0)";
      }, 500);
    }
  }, []);

  return (
    <div className="relative">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="w-full h-[600px] md:h-[700px]"
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src="https://i.ibb.co.com/jvKJ82Qs/rex-auction.png"
              alt="Auction Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-full max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Find Your Perfect{" "}
                <span className="text-violet-400">Auction</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                Discover exclusive items and bid on your dream products
              </p>
            </div>

            <div
              className={`search-bar-container absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl mx-auto px-4 transition-all duration-700 opacity-0 translate-y-8`}
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded
                  ? "translate(-50%, -50%) translateY(0)"
                  : "translate(-50%, -50%) translateY(20px)",
              }}
            >
              <div className="flex flex-col md:flex-row items-center bg-white p-2 rounded-lg shadow-xl border border-gray-200">
                <div className="flex items-center flex-1 w-full">
                  <FaSearch className="text-gray-400 ml-3 mr-2" />
                  <input
                    type="text"
                    placeholder="Search goods or services here..."
                    className="flex-grow p-3 outline-none text-gray-700 w-full"
                  />
                </div>

                <div className="flex items-center w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-200">
                  <select className="bg-gray-50 p-3 text-gray-700 outline-none rounded-none w-full md:w-auto">
                    <option>All Categories</option>
                    <option>Electronics</option>
                    <option>Real Estate</option>
                    <option>Luxury Cars</option>
                    <option>Art & Collectibles</option>
                    <option>Jewelry & Watches</option>
                  </select>

                  <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-r-lg transition-colors duration-300 flex items-center whitespace-nowrap">
                    Search Now <FaAngleRight className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src="https://i.ibb.co.com/jvKJ82Qs/rex-auction.png"
              alt="Auction Items"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div className="absolute bottom-20 left-0 right-0 text-center text-white px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                Premium Auctions
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                Bid on exclusive items from trusted sellers
              </p>
              <button className="mt-6 bg-white text-violet-700 hover:bg-violet-50 px-6 py-3 rounded-full font-medium transition-colors duration-300">
                View Featured Auctions
              </button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src="https://i.ibb.co.com/jvKJ82Qs/rex-auction.png"
              alt="Buy Now"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div className="absolute bottom-20 left-0 right-0 text-center text-white px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                Buy Now Options
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                Skip the bidding and purchase items instantly
              </p>
              <button className="mt-6 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300">
                Shop Now
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Custom pagination styling can be added with CSS */}
      <style jsx>{`
        /* Custom styling for Swiper pagination */
        :global(.swiper-pagination-bullet) {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }

        :global(.swiper-pagination-bullet-active) {
          background: white;
          transform: scale(1.2);
        }

        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(.swiper-button-next:after),
        :global(.swiper-button-prev:after) {
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default SdSlider;
