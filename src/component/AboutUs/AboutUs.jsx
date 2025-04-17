import React, { useState, useEffect, useContext, useRef } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import biddingBg from "../../assets/aboutUs/bidding.jpg";
import auction1 from "../../assets/aboutUs/businessman-with-tablet-after-closing-deal.jpg";
import auction2 from "../../assets/auctions/auction2.jpg";
import auction3 from "../../assets/aboutUs/business-people-shaking-hands-together.jpg";
import auction4 from "../../assets/aboutUs/auctionj.jpg";
import {
  MdHeadsetMic,
  MdOutlineSecurity,
  MdOutlineSecurityUpdate,
} from "react-icons/md";
import { FaGavel, FaGlobe, FaShieldAlt, FaUserCheck, FaStar } from "react-icons/fa";
import { FiBell, FiFileText, FiGrid } from "react-icons/fi";
import ThemeContext from "../Context/ThemeContext";
import { AuthContexts } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";

import SouravImg from "../../assets/OurTeam/souravdebnath.jpg";
import SudiptaImg from "../../assets/OurTeam/sudiptaroy.jpg";
import JasminImg from "../../assets/OurTeam/jasminaramim.jpg";
import JoyetaImg from "../../assets/OurTeam/joyetamondal.jpg";
import RohitImg from "../../assets/OurTeam/rohit.jpg";
import AbirImg from "../../assets/OurTeam/abir.jpg";

const AboutUs = () => {
  const howItWorksRef = useRef(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  };

  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContexts);

  const darkModeStyles = {
    backgroundColor: isDarkMode ? "#1a1a1a" : "",
    color: isDarkMode ? "#ffffff" : "",
  };

  const [startAnimation, setStartAnimation] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!rating) return alert("Please select a rating.");
    alert(`Thank you! You rated us ${rating} stars.`);
    setRating(0);
    setFeedback("");
  };

  const teamMembers = [
    {
      image: SouravImg,
      name: "Sourav Debnath",
      project_role: "Team Leader",
      email: "souravdebnath@gmail.com",
      expertise: "Full stack Development, React.js, Socket, Wireframe, UI/UX Design",
      offer: "I ensured the full UI of RexAuction to be responsive, Project Management, Agile, SCRUM meetings, seamless and user friendly for the users.",
    },
    {
      image: SudiptaImg,
      name: "Sudipta Roy",
      project_role: "Documentation & Requirements recorder, backend developer",
      email: "sudiptaroy@gmail.com",
      expertise: "Backend Development, Node.js,Socket, Express, MongoDB",
      offer: "I recorded each detailing of requirements that are needed for a dynamic auction website.",
    },
    {
      image: JasminImg,
      name: "Jasmin Ara Mim",
      project_role: "UI designer and developer",
      email: "jasminaramim@gmail.com",
      expertise: "Full stack development, Wireframe, Socket, MERN stack, Next.Js",
      offer: "I ensure smooth deployment pipelines and server reliability with an eye-catching UI design for our website.",
    },
    {
      image: JoyetaImg,
      name: "Joyeta Mondal Kotha",
      project_role: "UI & detailing designer",
      email: "dipannitakotha2019@gmail.com",
      expertise: "Frontend Development, Wireframe, React Native, Firebase, MERN stack.",
      offer: "I craft highly responsive UI and animated features across our website and worked on seamless data flow from the backend.",
    },
    {
      image: RohitImg,
      name: "Rafid Islam Rohit",
      project_role: "Redux designer",
      email: "rafidislamrohit@gmail.com",
      expertise: "Full stack development, Wireframe, Socket, Redux.",
      offer: "I made the website dynamic and robust using redux on the backend and functionalities to get updated with data.",
    },
    {
      image: AbirImg,
      name: "Nazmul Hasan Abir",
      project_role: "Worked on backend and frontend to coordinate between the two ends for all the functionalities to work seamlessly.",
      email: "nazmulhasanabir@gmail.com",
      expertise: "Full stack development, Socket, MERN stack.",
      offer: "I ensured seamless data flow from frontend to backend for a smooth working of RexAuction",
    },
  ];

  useEffect(() => {
    if (inView) {
      setStartAnimation(true);
    }
  }, [inView]);

  return (
    <div style={darkModeStyles} className="overflow-x-hidden">
      {/* 🔹 Hero Section with Gradient Background */}
      <div className={`relative overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-r from-purple-900 to-purple-900"}`}>
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          {/* Text Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="w-full md:w-1/2 text-center md:text-left z-10"
          >
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDarkMode ? "text-white" : "text-white"}`}>
              Transforming Online <br className="hidden md:block" />
              <span className="text-purple-200">Auctions</span> Since 2015
            </h1>
            <p className={`text-xl mb-8 ${isDarkMode ? "text-purple-100" : "text-purple-100"}`}>
              Your trusted platform for exceptional finds and competitive bidding
            </p>
            <div className="flex  gap-4 justify-center md:justify-start">
              <Link to="/auction" aria-label="Navigate to auctions page">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="lg:px-8 lg:py-3 p-3 bg-white text-purple-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Explore Auctions
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:px-8 lg:py-3 p-3 border-2 border-white lg:w-1/3 text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                onClick={() => howItWorksRef.current.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Scroll to How It Works section"
              >
                How It Works
              </motion.button>
            </div>
          </motion.div>

          {/* Carousel Section */}
          <div className="w-full md:w-1/2 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full h-80 md:h-[400px] rounded-xl overflow-hidden shadow-2xl transform rotate-1"
            >
              <Slider {...carouselSettings}>
                {[auction1, auction2, auction3, auction4].map((img, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0 bg-black/30 z-10"></div>
                    <img
                      src={img}
                      alt={`Auction Slide ${index + 1}`}
                      className="w-full h-80 md:h-[400px] object-cover"
                    />
                  </div>
                ))}
              </Slider>
            </motion.div>
          </div>
        </div>

        {/* Floating auction elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${isDarkMode ? "bg-purple-900/30" : "bg-white/20"} rounded-full`}
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 40 - 20],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* 🔹 Our Story Section */}
      <div className={`py-16 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="w-full lg:w-1/2 relative">
              <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-2 rounded-xl shadow-2xl`}>
                <img
                  className="w-full h-auto rounded-lg object-cover"
                  src={biddingBg}
                  alt="Auction bidding"
                />
              </div>
              <div className={`absolute -bottom-6 -right-6 ${isDarkMode ? "bg-purple-900" : "bg-purple-500"} p-4 rounded-xl shadow-lg w-1/3`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? "text-purple-200" : "text-white"}`}>Since 2015</h3>
                <p className={`text-sm ${isDarkMode ? "text-purple-300" : "text-purple-100"}`}>Trusted by thousands</p>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="mb-2">
                <span className={`px-3 py-1 rounded-full ${isDarkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-600"} text-sm font-semibold`}>
                  OUR JOURNEY
                </span>
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                The Story Behind <span className="text-purple-500">RexAuction</span>
              </h2>
              <div className={`h-1 w-20 mb-6 ${isDarkMode ? "bg-purple-600" : "bg-purple-400"}`}></div>
              
              <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Founded in 2015, RexAuction emerged from a simple vision: to create a trusted space where buyers and sellers could connect through exciting online auctions.
              </p>
              
              <div className={`p-6 rounded-lg mb-6 ${isDarkMode ? "bg-gray-800" : "bg-purple-50"} border-l-4 border-purple-500`}>
                <p className={`italic ${isDarkMode ? "text-purple-200" : "text-purple-600"}`}>
                  "Our commitment to transparency and security has made us the preferred choice for both seasoned collectors and first-time bidders."
                </p>
              </div>
              
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                What started as a small platform has grown into a global marketplace, serving millions of users worldwide with unique items and memorable bidding experiences.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 🔹 Trust Section with Animated Cards */}
      <div className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Your <span className="text-purple-500">Trust</span> Is Our Priority
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              We've built RexAuction on pillars of security, transparency, and exceptional service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <MdOutlineSecurity className="text-3xl" />,
                title: "Secure Transactions",
                description: "Bank-level encryption and secure payment processing.",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: <FaUserCheck className="text-3xl" />,
                title: "Verified Sellers",
                description: "Every seller and item verified for quality and trust.",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: <FaGavel className="text-3xl" />,
                title: "Transparent Bidding",
                description: "Real-time bidding with full visibility for users.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FaShieldAlt className="text-3xl" />,
                title: "Buyer Protection",
                description: "Policies to safeguard your purchases.",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <MdOutlineSecurityUpdate className="text-3xl" />,
                title: "Regular Audits",
                description: "Frequent security checks for our systems.",
                color: "from-amber-500 to-orange-500"
              },
              {
                icon: <MdHeadsetMic className="text-3xl" />,
                title: "24/7 Support",
                description: "Dedicated team to assist you anytime.",
                color: "from-violet-500 to-purple-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative group max-w-[300px] mx-auto rounded-xl p-4 sm:p-6 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                role="region"
                aria-label={item.title}
              >
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${isDarkMode ? "bg-gradient-to-r from-slate-800 to-gray-800" : "bg-gradient-to-r from-violet-100 to-indigo-100"}`} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-4 group-hover:rotate-[360deg] transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{item.title}</h3>
                  <p className={`text-sm sm:text-base line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{item.description}</p>
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-4 group-hover:w-20 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 How It Works Section */}
      <div className={`py-16 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`} ref={howItWorksRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              How <span className="text-purple-500">RexAuction</span> Works
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              A simple guide to bidding and selling on our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <FaGavel className="text-3xl" />,
                title: "Browse Auctions",
                description: "Explore thousands of items across categories.",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: <FaGavel className="text-3xl" />,
                title: "Place Bids",
                description: "Join live auctions and bid in real-time.",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: <FaGavel className="text-3xl" />,
                title: "Win & Pay",
                description: "Win items and pay securely with ease.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FaUserCheck className="text-3xl" />,
                title: "List Your Item",
                description: "Create listings with photos and details.",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <FaGlobe className="text-3xl" />,
                title: "Reach Global Buyers",
                description: "Showcase items to a worldwide audience.",
                color: "from-amber-500 to-orange-500"
              },
              {
                icon: <MdHeadsetMic className="text-3xl" />,
                title: "Get Support",
                description: "Our team assists with all your needs.",
                color: "from-violet-500 to-purple-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative group max-w-[300px] mx-auto rounded-xl p-4 sm:p-6 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
                role="region"
                aria-label={item.title}
              >
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${isDarkMode ? "bg-gradient-to-r from-slate-800 to-gray-800" : "bg-gradient-to-r from-violet-100 to-indigo-100"}`} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-4 group-hover:rotate-[360deg] transition-transform duration-500`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{item.title}</h3>
                  <p className={`text-sm sm:text-base line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{item.description}</p>
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-4 group-hover:w-20 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Buyer and Seller Section */}
      <div className={` ${isDarkMode ? "bg-gray-950" : "bg-white"} overflow-hidden`}>
        <div className="flex justify-center items-center">
          <div className="w-full lg:max-w-4xl max-w-sm px-4">
            <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-center text-transparent my-10 ${isDarkMode ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"}`}>
              For Buyers and Sellers
            </h2>
            <div className="relative w-full group overflow-visible">
              <div className="flex w-max animate-marquee gap-6 mb-10 group-hover:[animation-play-state:paused]">
                {[
                  {
                    icon: <FaShieldAlt />,
                    title: "Secure Bidding",
                    description: "Advanced security measures to protect your transactions",
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
                    className={`relative rounded-lg shadow-lg p-6 md:p-8 w-full md:w-80 lg:w-96 hover:shadow-xl transition-all duration-200 transform hover:scale-105 overflow-hidden group ${isDarkMode ? "bg-gray-900" : "bg-white"} group-hover:[animation-play-state:paused]`}
                  >
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 transition-all duration-500 group-hover:w-full"></div>
                    <div className="flex justify-center mb-4">
                      <div className={`${item.color} ${item.shadowColor} text-white p-4 rounded-xl shadow-lg mb-5`}>
                        {item.icon}
                      </div>
                    </div>
                    <h3 className={`font-semibold text-lg mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>{item.title}</h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-purple-100"} py-8 px-4 text-center`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent ${isDarkMode ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"}`}>
              Meet our talented team
            </h2>
            <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              We have a hard-working and dynamically talented team that is working continuously for giving you the best experience of bidding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 0.4}s` }}
                className={`relative group rounded-xl p-6 transition-transform duration-500 ease-in-out animate-floating hover:scale-105 scale-100 ${isDarkMode ? "bg-gray-900 shadow-[0_0_15px_rgba(139,92,246,0.95)]" : "bg-slate-200 shadow-[0_0_30px_rgba(139,92,246,1)]"}`}
              >
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${isDarkMode ? "bg-gradient-to-r from-slate-800 to-gray-800" : "bg-gradient-to-r from-violet-100 to-indigo-100"}`} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-violet-400 mb-4"
                  />
                  <h3 className={`font-bold text-xl mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{member.name}</h3>
                  <p className={`${isDarkMode ? "text-violet-300" : "text-indigo-600"}`}>{member.project_role}</p>
                  <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>📧 {member.email}</p>
                  <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}><span className="font-semibold text-violet-500">Expertise:</span> {member.expertise}</p>
                  <p className={`text-xs italic ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>"{member.offer}"</p>
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-5 group-hover:w-20 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div ref={ref} className={`py-14 flex flex-wrap justify-around text-center font-bold text-xl md:text-2xl ${isDarkMode ? "bg-gray-950 text-purple-400" : "bg-white text-purple-600"}`}>
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
                  suffix={item.label === "Satisfaction Rate" ? "%" : item.label === "Support" ? "/7" : "+"}
                />
              ) : (
                "0"
              )}
            </p>
            <span className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{item.label}</span>
          </div>
        ))}
      </div>

     {/* 🔹 Rate Us Section - Enhanced with Animations */}
<div className={`relative py-16 px-4 sm:px-6 overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-purple-50 to-indigo-50"}`}>
 

  <div className="max-w-4xl mx-auto relative z-10">
    <div className={`text-center p-8 rounded-xl ${isDarkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"} shadow-xl transition-all duration-300 hover:shadow-2xl`}>
      <div className="mb-2">
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${isDarkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-800"} animate-pulse`}>
          WE VALUE YOUR OPINION
        </span>
      </div>
      <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        How was your experience?
      </h2>
      <p className={`max-w-2xl mx-auto mb-6 text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        Your feedback helps us improve RexAuction for everyone
      </p>
      
      {/* Star Rating - Enhanced with Pulse Animation */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/10 backdrop-blur-md p-2 rounded-full">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                setRating(star);
                // Play a subtle click sound
                if (typeof window !== 'undefined') {
                  new Audio('/sounds/click.mp3').play().catch(e => console.log('Audio play failed:', e));
                }
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`mx-1 transition-all duration-200 transform ${star <= (hoverRating || rating) ? 
                "text-yellow-400 scale-125 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" : 
                isDarkMode ? "text-gray-500 hover:text-yellow-300" : "text-gray-300 hover:text-yellow-500"
              }`}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <span className="text-4xl">★</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Feedback Form */}
      <div className="max-w-2xl mx-auto">
        <textarea
          rows="4"
          placeholder="Tell us more (optional)..."
          className={`w-full p-4 rounded-xl border-2 ${isDarkMode ? 
            "bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/30" : 
            "bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400/20"
          } focus:outline-none focus:ring-4 transition-all duration-200 resize-none`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              handleSubmit();
              // Show sweet alert after submission
              if (typeof window !== 'undefined') {
                import('sweetalert2').then((Swal) => {
                  Swal.default.fire({
                    title: 'Thank You!',
                    text: 'Your feedback has been submitted successfully.',
                    icon: 'success',
                    confirmButtonText: 'Awesome!',
                    background: isDarkMode ? '#1f2937' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#1f2937',
                    confirmButtonColor: isDarkMode ? '#7c3aed' : '#8b5cf6',
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: () => {
                      // Play success sound
                      new Audio('/sounds/success.mp3').play().catch(e => console.log('Audio play failed:', e));
                    }
                  });
                });
              }
            }}
            disabled={!rating}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none shadow-lg ${
              rating ? 
              "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/30 hover:brightness-110" : 
              isDarkMode ? 
              "bg-gray-700 text-gray-400 cursor-not-allowed" : 
              "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* CSS for floating animation */}
  <style jsx>{`
    @keyframes float {
      0% {
        transform: translateY(0) translateX(0);
      }
      50% {
        transform: translateY(-100px) translateX(20px);
      }
      100% {
        transform: translateY(-200px) translateX(0);
      }
    }
  `}</style>
</div>

{/* CTA Section - Enhanced with Floating Elements */}
{!user && (
  <div className={`relative overflow-hidden py-20 px-4 sm:px-6 ${isDarkMode ? "bg-gray-950" : "bg-gradient-to-br from-purple-900 to-indigo-900"}`}>
    {/* Floating Elements */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const color = isDarkMode ? 
          `rgba(167, 139, 250, ${Math.random() * 0.3 + 0.1})` : 
          `rgba(236, 72, 153, ${Math.random() * 0.3 + 0.1})`;
        
        return (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: color,
              opacity: 0.3,
              animation: `float ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              filter: 'blur(1px)'
            }}
          />
        );
      })}
    </div>
    
    <div className="max-w-6xl mx-auto relative z-10 text-center">
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md`}>
        Ready to Get Started?
      </h2>
      <p className={`max-w-2xl mx-auto text-lg mb-8 ${isDarkMode ? "text-gray-300" : "text-purple-200"}`}>
        Join thousands of happy users buying and selling on RexAuction
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        <button 
          onClick={() => {
            if (typeof window !== 'undefined') {
              new Audio('/sounds/click.mp3').play().catch(e => console.log('Audio play failed:', e));
            }
          }}
          className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none shadow-lg ${
            isDarkMode ? 
            "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/30 hover:brightness-110" : 
            "bg-white text-purple-900 hover:shadow-lg hover:shadow-white/20 hover:brightness-95"
          }`}
        >
          Join as Buyer
        </button>
        <button 
          onClick={() => {
            if (typeof window !== 'undefined') {
              new Audio('/sounds/click.mp3').play().catch(e => console.log('Audio play failed:', e));
            }
          }}
          className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none shadow-lg ${
            isDarkMode ? 
            "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-indigo-500/30 hover:brightness-110" : 
            "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-purple-500/30 hover:brightness-110"
          }`}
        >
          Start Selling
        </button>
      </div>
      
      <div className="mt-8">
        <Link 
          to="/terms" 
          className={`text-sm font-medium transition-colors duration-200 ${
            isDarkMode ? 
            "text-purple-400 hover:text-purple-300" : 
            "text-purple-300 hover:text-white"
          }`}
        >
          Terms and Conditions
        </Link>
      </div>
    </div>

    {/* CSS for floating animation */}
    <style jsx>{`
      @keyframes float {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0.3;
        }
        50% {
          transform: translateY(-50px) translateX(20px);
          opacity: 0.6;
        }
        100% {
          transform: translateY(-100px) translateX(0);
          opacity: 0.3;
        }
      }
    `}</style>
  </div>
)}
    </div>
  );
};

export default AboutUs;