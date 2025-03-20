import { Navigation, Pagination } from "swiper/modules";
import { animate } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { useEffect } from "react";
const Slider = () => {
  useEffect(() => {
    animate(".box", { opacity: 1, rotate: 360 }, { duration: 1 });
  }, []);
  return (
    <div>
      <Swiper
        spaceBetween={200}
        centeredSlides={true}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Pagination, Navigation]}
      >
        <SwiperSlide>
          <div>
            <img
              className="h-80 md:h-1/3 object-contain"
              src="https://i.ibb.co.com/jvKJ82Qs/rex-auction.png"
              alt=""
            />
            <div className="rounded-2xl shadow-lg max-w-4xl mx-auto focus:ring-2 border border-gray-300 absolute top-[83.33%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center p-2 rounded-2xl shadow-md">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search goods or services here..."
                  className="flex-grow bg-gray-300 p-3 outline-none text-white rounded-l-2xl search-placeholder"
                />

                {/* Dropdown */}
                <select className="bg-gray-100 px-2 p-3 border-l border-gray-300 text-gray-700">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Real Estate</option>
                  <option>Luxury Cars</option>
                </select>

                {/* Search Button */}
                <button className="bg-gradient-to-r from-purple-600 via-violet-700 to-purple-800 hover:bg-purple-800 text-white px-5 py-3 rounded-r-lg">
                  Search Now!
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="h-80 md:h-1/3 object-contain"
            src="https://i.ibb.co.com/S4CMgd9J/rex-auction.png"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className=" h-80 md:h-1/3 object-contain"
            src="https://i.ibb.co.com/d4PQcWSn/Buy-Now.png"
            alt=""
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;
