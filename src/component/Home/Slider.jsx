import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Lottie from "lottie-react";
import celebrationAnimation from "../../assets/Lotties/celebrate.json"; // You'll need to import your Lottie JSON file
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Slider = () => {
  const { dbUser } = useAuth();
  const banners = [
    {
      id: 1,
      img: "https://i.ibb.co.com/Z1K8Y0kW/Untitled-design-33.jpg",
      alt: "Banner 1",
    },
    {
      id: 2,
      img: "https://i.ibb.co.com/B28vwn2h/Untitled-design-36.jpg",
      alt: "Banner 2",
    },
    {
      id: 3,
      img: "https://i.ibb.co.com/Pvc4sVfL/Untitled-design-35.jpg",
      alt: "Banner 3",
    },
  ];

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[100vh] w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={banner.img}
                alt={banner.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Glowing yellow circles */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-yellow-400 opacity-50 filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-yellow-400 opacity-50 filter blur-xl animate-pulse delay-300"></div>
                <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-yellow-400 opacity-40 filter blur-xl animate-pulse delay-500"></div>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-left">
                <div className="text-left px-4 ml-4 md:ml-10 lg:ml-20 text-white relative z-10">
                  <h1 className="text-xl md:text-5xl lg:text-4xl font-bold mb-4 text-yellow-400">
                    EID SPECIAL AUCTIONS
                  </h1>
                  <p className="text-xs md:text-xl lg:text-xl mb-6 max-w-xs lg:max-w-md">
                    Celebrate Eid with exciting auctions! Our Eid Special
                    Auctions bring you exclusive deals, rare collectibles, and
                    premium items at unbeatable prices.
                  </p>

                  {/* 50% offer with Lottie animation */}
                  <div className="relative inline-block">
                    {dbUser?.role == "buyer" ? (
                      <Link
                        className="bg-red-600 text-white text-sm md:text-base lg:text-lg px-4 py-2 rounded-full animate-pulse relative z-20"
                        to={`/dashboard/becomeSeller`}
                      >
                        🎉 50% DISCOUNT ON BECOMING AN AUCTIONEER 🎉
                      </Link>
                    ) : (
                      <div className="bg-red-600 text-white text-sm md:text-base lg:text-lg px-4 py-2 rounded-full animate-pulse relative z-20">
                        🎉 50% DISCOUNT ON BECOMING AN AUCTIONEER 🎉
                      </div>
                    )}
                    <div className="absolute -top-20 -left-10 w-40 h-40 z-10 pointer-events-none">
                      <Lottie
                        animationData={celebrationAnimation}
                        loop={true}
                        autoplay={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
