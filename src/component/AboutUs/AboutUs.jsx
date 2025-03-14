import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import biddingBg from "../../assets/bidding.jpg";
import auction1 from "../../assets/businessman-with-tablet-after-closing-deal.jpg";
import auction2 from "../../assets/auction2.jpg";
import auction3 from "../../assets/business-people-shaking-hands-together.jpg";
import auction4 from "../../assets/auctionj.jpg";
import { MdHeadsetMic, MdOutlineSecurity, MdOutlineSecurityUpdate } from "react-icons/md";
import { FaGavel, FaGlobe, FaShieldAlt, FaUserCheck } from "react-icons/fa";
import { FiBell, FiFileText, FiGrid } from "react-icons/fi";
const AboutUs = () => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <div className="text-black">
      <div className="text-black">
        {/* 🔹 First Section - Hero */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-6 lg:p-0 bg-purple-100">
          {/* Text Section */}
          <div className="w-full lg:ml-[50px] my-10 lg:mb-[70px] md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Transforming Online <br />
              Auctions Since 2015
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your trusted platform for exceptional finds.
            </p>
            <div className="w-1/4 h-[4px] bg-purple-500 rounded-full mx-auto md:mx-0"></div>
          </div>

          {/* Carousel Section */}
          <div className="w-full md:w-1/2">
            <div className="w-full h-72 md:h-[400px] overflow-hidden  shadow-md">
              <Slider {...carouselSettings}>
                {[auction1, auction2, auction3, auction4].map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={`Auction Slide ${index + 1}`}
                      className="w-full h-72 md:h-[400px] object-cover"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>

        {/* 🔹 Second Section - Our Story */}
        <div className="flex flex-col md:flex-row mt-10 gap-8 p-6 md:p-10">
          <div className="w-full md:w-1/2">
            <img
              className="rounded-lg w-full object-cover"
              src={biddingBg}
              alt=""
            />
          </div>
          <div className="w-full md:w-1/2">
            <h1 className="text-black font-bold text-2xl text-center md:text-left">
              OUR STORY
            </h1>
            <div className="w-1/4 h-[2px] bg-purple-500 rounded-full mx-auto md:mx-0 mt-1"></div>
            <p className="text-gray-700 mt-5 text-justify">
              Founded in 2015, RexAuction emerged from a simple vision: to
              create a trusted space where buyers and sellers could connect
              through exciting online auctions. What started as a small platform
              has grown into a global marketplace, serving millions of users
              worldwide.
              <br />
              <br />
              Our commitment to transparency, security, and customer
              satisfaction has made us the preferred choice for both seasoned
              collectors and first-time bidders. Every day, we help people
              discover unique items and create memorable bidding experiences.
            </p>
          </div>
        </div>
      </div>

      {/* third section  */}
      <div className="bg-gray-100 p-10">
        <div className="bg-gray-100 p-10">
          <div className="text-center font-bold">
            <h1 className="text-3xl">Your Trust Is Our Priority</h1>
          </div>

          <div className="flex flex-col md:flex-row justify-evenly gap-10 mt-14 text-center">
            <div className="w-full md:w-[200px]">
              <div className="text-4xl text-purple-600 flex justify-center mb-2">
                <MdOutlineSecurity />
              </div>
              <h2 className="font-semibold text-lg mb-1">
                Secure Transactions
              </h2>
              <p className="text-gray-600 text-sm">
                Bank-level encryption and secure payment processing for every
                transaction.
              </p>
            </div>

            <div className="w-full md:w-[200px]">
              <div className="text-4xl text-purple-600 flex justify-center mb-2">
                <FaUserCheck />
              </div>
              <h2 className="font-semibold text-lg mb-1">Verified Sellers</h2>
              <p className="text-gray-600 text-sm">
                We verify every seller and item to ensure quality and trust.
              </p>
            </div>

            <div className="w-full md:w-[200px]">
              <div className="text-4xl text-purple-600 flex justify-center mb-2">
                <FaGavel />
              </div>
              <h2 className="font-semibold text-lg mb-1">
                Transparent Bidding
              </h2>
              <p className="text-gray-600 text-sm">
                Real-time bidding and full visibility for all users.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fourth section */}
      <div>
        <div className="bg-purple-100 mt-20 text-center p-10">
          <h1 className="font-bold text-purple-500 text-3xl lg:text-5xl">
            {" "}
            About RexAuction
          </h1>
          <p className="text-gray-600 mt-3">
            Your trusted Platform For Online Auctions
          </p>
        </div>
      </div>
      {/* buyer section */}
      <div className="mt-8">
        <div className="py-12 px-4">
          <h2 className="text-center text-purple-600 font-bold text-2xl mb-10">
            For Buyers
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-6 text-center">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-80 hover:shadow-xl transition duration-300">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <FaShieldAlt className="text-purple-600 text-3xl" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">Secure Bidding</h3>
              <p className="text-gray-600 text-sm">
                Advanced security measures to protect your transactions
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-80 hover:shadow-xl transition duration-300">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <FiGrid className="text-purple-600 text-3xl" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">Wide Selection</h3>
              <p className="text-gray-600 text-sm">
                Thousands of items across multiple categories
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-80 hover:shadow-xl transition duration-300">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <FiBell className="text-purple-600 text-3xl" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">
                Instant notifications on your bid status
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* 🔹 For Sellers Section */}
      <div className="bg-purple-100 py-16 px-4 text-center mt-20">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-10">
          For Sellers
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-72 hover:shadow-lg transition">
            <div className="text-3xl text-purple-500 mb-3 flex justify-center">
              <h1><FaGlobe /></h1>
            </div>
            <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
            <p className="text-gray-600 text-sm">
              Connect with buyers worldwide
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-72 hover:shadow-lg transition">
            <div className="text-3xl text-purple-500 mb-3 flex justify-center">
              <h1><FiFileText /></h1>
            </div>
            <h3 className="text-lg font-semibold mb-2">Transparent Process</h3>
            <p className="text-gray-600 text-sm">
              Clear and fair auction procedures
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-72 hover:shadow-lg transition">
            <div className="text-3xl text-purple-500 mb-3 flex justify-center">
              <h1><MdHeadsetMic /></h1>
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600 text-sm">
              Dedicated team to help you succeed
            </p>
          </div>
        </div>
      </div>

      {/*  Statistics Section */}
      <div className="py-14 bg-white flex flex-wrap justify-around text-center text-purple-600 font-bold text-xl md:text-2xl">
        <div>
          <p>10K+</p>
          <span className="block text-gray-600 text-sm font-medium">
            Active Users
          </span>
        </div>
        <div>
          <p>50K+</p>
          <span className="block text-gray-600 text-sm font-medium">
            Successful Auctions
          </span>
        </div>
        <div>
          <p>95%</p>
          <span className="block text-gray-600 text-sm font-medium">
            Satisfaction Rate
          </span>
        </div>
        <div>
          <p>24/7</p>
          <span className="block text-gray-600 text-sm font-medium">
            Support
          </span>
        </div>
      </div>

      {/*  CTA Section */}
      <div className="bg-purple-100 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition">
            Join as Buyer
          </button>
          <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg transition">
            Start Selling
          </button>
        </div>
        <div className="mt-4">
          <a
            href="#"
            className="text-purple-600 underline text-sm hover:text-purple-800"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
