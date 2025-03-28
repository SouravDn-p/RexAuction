import React, { useState, useEffect, useContext } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import biddingBg from "../../assets/bidding.jpg";
import auction1 from "../../assets/businessman-with-tablet-after-closing-deal.jpg";
import auction2 from "../../assets/auction2.jpg";
import auction3 from "../../assets/business-people-shaking-hands-together.jpg";
import auction4 from "../../assets/auctionj.jpg";
import {
  MdHeadsetMic,
  MdOutlineSecurity,
  MdOutlineSecurityUpdate,
} from "react-icons/md";
import { FaGavel, FaGlobe, FaShieldAlt, FaUserCheck } from "react-icons/fa";
import { FiBell, FiFileText, FiGrid } from "react-icons/fi";
import ThemeContext from "../Context/ThemeContext";

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

  const { isDarkMode } = useContext(ThemeContext);

  const darkModeStyles = {
    backgroundColor: isDarkMode ? "#1a1a1a" : "",
    color: isDarkMode ? "#ffffff" : "",
  };

  const cardStyles = {
    // backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "",
  };

  // Statistics Section Logic
  const [startAnimation, setStartAnimation] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger animation only once
    threshold: 0.5, // Trigger when 50% of the section is visible
  });

  useEffect(() => {
    if (inView) {
      setStartAnimation(true); // Start the animation when the section is in view
    }
  }, [inView]);

  return (
    <div style={darkModeStyles} className="mt-16">
      {/* 🔹 First Section - Hero */}
      <div
        className={`flex flex-col-reverse md:flex-row items-center gap-6 lg:p-0 ${
          isDarkMode ? "bg-gray-800" : "bg-purple-300"
        }`}
      >
        {/* Text Section */}
        <div className="w-full lg:ml-[50px] my-10 lg:mb-[70px] md:w-1/2 text-center md:text-left">
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Transforming Online <br />
            Auctions Since 2015
          </h1>
          <p
            className={`text-lg mb-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your trusted platform for exceptional finds.
          </p>
          <div className="w-1/4 h-[4px] bg-purple-500 rounded-full mx-auto md:mx-0"></div>
        </div>

        {/* Carousel Section */}
        <div className="w-full md:w-1/2 relative">
          {/* Black Overlay with Low Opacity */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>

          {/* Carousel */}
          <div className="w-full h-72 md:h-[400px] overflow-hidden shadow-md">
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
      <div
        className={`flex flex-col md:flex-row gap-8 p-6 md:p-10 ${
          isDarkMode ? "bg-gray-950" : "bg-gray-100"
        }`}
      >
        <div className="w-full md:w-1/2">
          <img
            className="rounded-lg w-full object-cover"
            src={biddingBg}
            alt=""
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1
            className={`font-bold text-2xl text-center md:text-left ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            OUR STORY
          </h1>
          <div className="w-1/4 h-[2px] bg-purple-500 rounded-full mx-auto md:mx-0 mt-1"></div>
          <p
            className={`mt-5 text-justify ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Founded in 2015, RexAuction emerged from a simple vision: to create
            a trusted space where buyers and sellers could connect through
            exciting online auctions. What started as a small platform has grown
            into a global marketplace, serving millions of users worldwide.
            <br />
            <br />
            Our commitment to transparency, security, and customer satisfaction
            has made us the preferred choice for both seasoned collectors and
            first-time bidders. Every day, we help people discover unique items
            and create memorable bidding experiences.
          </p>
        </div>
      </div>

      {/* Third Section - Trust */}
      <div className={`p-10 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="text-center font-bold">
          <h1
            className={`text-3xl ${isDarkMode ? "text-white" : "text-black"}`}
          >
            Your Trust Is Our Priority
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-evenly gap-10 mt-14 text-center">
          {[
            {
              icon: <MdOutlineSecurity />,
              title: "Secure Transactions",
              description:
                "Bank-level encryption and secure payment processing for every transaction.",
            },
            {
              icon: <FaUserCheck />,
              title: "Verified Sellers",
              description:
                "We verify every seller and item to ensure quality and trust.",
            },
            {
              icon: <FaGavel />,
              title: "Transparent Bidding",
              description:
                "Real-time bidding and full visibility for all users.",
            },
          ].map((item, index) => (
            <div key={index} className="w-full md:w-[200px]">
              <div className="text-4xl text-purple-600 flex justify-center mb-2">
                {item.icon}
              </div>
              <h2
                className={`font-semibold text-lg mb-1 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {item.title}
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Section */}
      <div className={` ${isDarkMode ? "bg-gray-950" : "bg-white"}`}>
        <div className="flex justify-center items-center ">
          <div className="w-full lg:max-w-4xl max-w-sm px-4">
            <h2
              className={`text-3xl md:text-4xl font-bold bg-clip-text text-center text-transparent my-10 ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                  : "bg-gradient-to-r  from-cyan-400 via-purple-400 to-pink-400"
              }`}
            >
              For Buyers
            </h2>
            <div className="flex flex-col md:flex-row justify-center gap-6 text-center  mb-8">
              {[
                {
                  icon: <FaShieldAlt />,
                  title: "Secure Bidding",
                  description:
                    "Advanced security measures to protect your transactions",
                  color: "bg-gradient-to-br from-pink-500 to-rose-500",
                  shadowColor: "shadow-pink-500/20",
                },
                {
                  icon: <FiGrid />,
                  title: "Wide Selection",
                  description: "Thousands of items across multiple categories",
                  color: "bg-gradient-to-br from-purple-500 to-indigo-600",
                  shadowColor: "shadow-purple-500/20",
                },
                {
                  icon: <FiBell />,
                  title: "Real-time Updates",
                  description: "Instant notifications on your bid status",
                  color: "bg-gradient-to-br from-emerald-500 to-teal-500",
                  shadowColor: "shadow-emerald-500/20",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={cardStyles}
                  className={`relative rounded-lg  shadow-lg p-6 md:p-8 w-full md:w-80 lg:w-96 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group ${
                    isDarkMode ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  {/* Border Bottom Animation */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 transition-all duration-500 group-hover:w-full"></div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`${item.color} ${item.shadowColor}  text-white p-4 rounded-xl shadow-lg mb-5`}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3
                    className={`font-semibold text-lg mb-1 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seller Section */}
      <div
        className={`${
          isDarkMode ? "bg-gray-900" : "bg-purple-100"
        } py-8 px-4 text-center `}
      >
        <div className="flex justify-center items-center py-12">
          <div className="w-full lg:max-w-4xl max-w-sm px-4">
            <h2
              className={`text-2xl md:text-3xl font-bold mb-10 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              For Sellers
            </h2>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              {[
                {
                  icon: <FaGlobe />,
                  title: "Global Reach",
                  description: "Connect with buyers worldwide",
                  color: "bg-gradient-to-br from-pink-500 to-rose-500",
                  shadowColor: "shadow-pink-500/20",
                },
                {
                  icon: <FiFileText />,
                  title: "Transparent Process",
                  description: "Clear and fair auction procedures",
                  color: "bg-gradient-to-br from-purple-500 to-indigo-600",
                  shadowColor: "shadow-purple-500/20",
                },
                {
                  icon: <MdHeadsetMic />,
                  title: "Expert Support",
                  description: "Dedicated team to help you succeed",
                  color: "bg-gradient-to-br from-emerald-500 to-teal-500",
                  shadowColor: "shadow-emerald-500/20",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={cardStyles}
                  className={`relative rounded-lg  shadow-lg p-6 md:p-8 w-full md:w-80 lg:w-96 hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group ${
                    isDarkMode ? "bg-violet-950" : "bg-white"
                  }`}
                >
                  {/* Border Bottom Animation */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 transition-all duration-500 group-hover:w-full"></div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`${item.color} ${item.shadowColor}  text-white p-4 rounded-xl shadow-lg mb-5`}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3
                    className={`font-semibold text-lg mb-1 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div
        ref={ref}
        className={`py-14 flex flex-wrap justify-around text-center font-bold text-xl md:text-2xl ${
          isDarkMode
            ? "bg-gray-950 text-purple-400"
            : "bg-white text-purple-600"
        }`}
      >
        {[
          { value: 124500, label: "Active Users" },
          { value: 50700, label: "Successful Auctions" },
          { value: 98, label: "Satisfaction Rate" },
          { value: 24, label: "Support" },
        ].map((item, index) => (
          <div key={index}>
            <p>
              {startAnimation ? (
                <CountUp
                  start={0}
                  end={item.value}
                  duration={8}
                  separator=","
                  suffix={
                    item.label === "Satisfaction Rate"
                      ? "%"
                      : item.label === "Support"
                      ? "/7"
                      : "+"
                  } // Add suffix if needed
                />
              ) : (
                "0"
              )}
            </p>
            <span
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-purple-100"
        } py-16 text-center`}
      >
        <h2
          className={`text-2xl md:text-3xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
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
            className={`underline text-sm ${
              isDarkMode
                ? "text-purple-400 hover:text-purple-300"
                : "text-purple-600 hover:text-purple-800"
            }`}
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
