import { Navigation, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

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
  return (
    <div className="w-11/12 mx-auto p-10">
      <h2 className="text-2xl font-bold text-center text-black mb-6">Hot Auctions</h2>
      <Swiper
        spaceBetween={20}
        // slidesPerView={1}
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
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-yellow-500 font-bold text-xl">
                  {item.price}
                </p>
                <div className="flex justify-between items-center text-gray-500 text-sm my-2">
                  <span>{item.timeLeft}</span>
                  <span>{item.bids}</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-3/5"></div>
                </div>
                {/* Bid Button */}
                <button className="w-full bg-violet-900 text-white py-2 mt-4 rounded-lg hover:bg-violet-700 transition">
                  Bid Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HotAuction;
