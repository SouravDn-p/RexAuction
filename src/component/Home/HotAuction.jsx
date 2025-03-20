import { useContext, useEffect, useRef, useState } from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaFire } from "react-icons/fa";
import ThemeContext from "../../component/Context/ThemeContext";

const auctionData = [
  {
    title: "Vintage Rolex Submariner",
    price: "$24,500",
    timeLeft: "2h 15m",
    bids: "23 bids",
    img: "https://i.ibb.co/tT6LKgPC/image.png",
  },
  {
    title: "Rare Diamond Necklace",
    price: "$138,000",
    timeLeft: "4h 30m",
    bids: "18 bids",
    img: "https://i.ibb.co/8n10pmw8/image.png",
  },
  {
    title: "Classic Ferrari 250 GT",
    price: "$2,450,000",
    timeLeft: "12h 45m",
    bids: "35 bids",
    img: "https://i.ibb.co/ymh54KNn/image.png",
  },
  {
    title: "Patek Philippe Nautilus",
    price: "$105,000",
    timeLeft: "5h 20m",
    bids: "27 bids",
    img: "https://i.ibb.co.com/WWqqZXH8/image.png",
  },
  {
    title: "Lamborghini Miura",
    price: "$3,200,000",
    timeLeft: "9h 10m",
    bids: "42 bids",
    img: "https://i.ibb.co.com/CshWnMV6/image.png",
  },
  {
    title: "Antique Persian Rug",
    price: "$75,000",
    timeLeft: "6h 5m",
    bids: "15 bids",
    img: "https://i.ibb.co.com/mVMrhPYY/image.png",
  },
  {
    title: "Rolex Daytona Platinum",
    price: "$180,000",
    timeLeft: "3h 45m",
    bids: "30 bids",
    img: "https://i.ibb.co.com/QFmqvHrP/image.png",
  },
  {
    title: "1967 Chevrolet Corvette Stingray",
    price: "$250,000",
    timeLeft: "8h 50m",
    bids: "20 bids",
    img: "https://i.ibb.co.com/B27D0SfF/image.png",
  },
  {
    title: "Cartier Panther Bracelet",
    price: "$280,000",
    timeLeft: "7h 30m",
    bids: "22 bids",
    img: "https://i.ibb.co.com/NgdQH2fv/image.png",
  },
  {
    title: "Mona Lisa Replica Painting",
    price: "$45,000",
    timeLeft: "10h 15m",
    bids: "12 bids",
    img: "https://i.ibb.co.com/TqcJP8HZ/image.png",
  },
  {
    title: "Bugatti Type 57 SC Atlantic",
    price: "$40,000,000",
    timeLeft: "1d 4h",
    bids: "50 bids",
    img: "https://i.ibb.co.com/xSCNTQcr/image.png",
  },
  {
    title: "Michael Jordan Signed Jersey",
    price: "$500,000",
    timeLeft: "14h 30m",
    bids: "25 bids",
    img: "https://i.ibb.co.com/6cx38SZk/image.png",
  },
];


const HotAuction = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [visibleIndexes, setVisibleIndexes] = useState([]);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            // Trigger the animation every time the item becomes visible
            setVisibleIndexes((prev) => [...new Set([...prev, index])]);
          } else {
            // Optionally, reset the animation when the item is out of view
            setVisibleIndexes((prev) => prev.filter((i) => i !== index));
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the item is visible
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      itemRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section>
      <div className="w-11/12 mx-auto p-10">
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
            className={`text-gray-600 text-center max-w-2xl mb-8 ${
              isDarkMode ? "text-gray-200" : "text-gray-600"
            }`}
          >
            Discover our most popular and trending auction items. Bid now before
            they're gone!
          </p>
        </div>
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
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="pb-10"
        >
          {auctionData.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className={`rounded-lg overflow-hidden ${
                  isDarkMode
                    ? "bg-gradient-to-r border-purple-400 border from-[#2c150c] to-[#32223f]"
                    : "bg-white"
                } shadow-lg`}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div
                  className={`p-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-yellow-500 font-bold text-xl">
                    {item.price}
                  </p>
                  <div className="flex justify-between items-center text-gray-500 text-sm my-2">
                    <span>{item.timeLeft}</span>
                    <span>{item.bids}</span>
                  </div>
{/* Progress Bar */}
<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
  <div
    className={`bg-yellow-500 h-2 rounded-full progress-bar ${visibleIndexes.includes(index) ? "animate-progress" : ""}`}
  ></div>
</div>


                  {/* Bid Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600 via-violet-700 to-purple-800 text-white py-2 mt-4 rounded-lg hover:from-purple-500 hover:via-violet-600 hover:to-indigo-700 transition">
                    Bid Now
                  </button>
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
