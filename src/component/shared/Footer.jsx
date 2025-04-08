import React, { useContext, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import AOS from "aos";
import "aos/dist/aos.css";
import Newsletter from "./Newsletter";
import ThemeContext from "../Context/ThemeContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useContext(ThemeContext);

  // particles effect
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <footer
      // className="bg-no-repeat bg-cover bg-center py-12 relative" bg-no-repeat bg-cover bg-center
      className={` relative opacity-90 py-10  ${
        isDarkMode
          ? "bg-gray-900 bg-opacity-100 backdrop-blur-md"
          : "bg-gradient-to-r from-purple-600 to-purple-400 bg-opacity-90 backdrop-blur-md"
      }`}
    >
      {/* particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            style: {
              "mix-blend-mode": "screen",
            },
            color: { value: isDarkMode ? "#ffffff" : "#2d2d2d" },
            links: {
              enable: true,
              color: isDarkMode ? "#ffffff" : "#6b21a8",
              distance: 100,
            },
            move: { enable: true, speed: 1 },
            number: { value: 100 },
            size: { value: 3 },
            opacity: {
              value: 0.5,
            },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative container mx-auto px-6 md:px-12 z-10">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          {/* Logo and Description */}
          <div
            className="flex flex-col items-center md:items-start"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex gap-3 items-center ">
              <img
                className="text-xl border-2 border-violet-500 ring-2 ring-violet-500/60 rounded-full text-white w-[60px] lg:w-[70px] animate-pulse"
                src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                alt="rexauction"
              />
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className="text-violet-400">Rex</span> Auction
              </h1>
            </div>
            <p className="text-gray-300 mt-2 max-w-xs">
              A reliable platform for bidding and auctioning items. Find great
              deals, or auction your own items today.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4 mt-6">
              <style>{`@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
  .glow-border {
  border : 2px solid #a855f7 ;
  animation : glow 2s infinite ease-in-out;
  border-radius: 1rem;
  }
.floating-icon {
  animation: float 2s ease-in-out infinite;
}`}</style>
              <a
                href="https://facebook.com"
                className=" glow-border w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300 floating-icon"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="glow-border w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300 floating-icon"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="glow-border w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300 floating-icon"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                className="glow-border w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300 floating-icon"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div
            className="flex flex-col mt-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h2 className="text-xl font-bold text-white mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-violet-500 rounded-full"></span>
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                <FaMapMarkerAlt className="mr-3 text-violet-400" />
                <span>123 Auction Street, New York, NY 10001</span>
              </li>
              <li>
                <a
                  href="mailto:rexauctiontechnorexers@gmail.com"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <FaEnvelope className="mr-3 text-violet-400" />
                  <span>rexauctiontechnorexers@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+123456789"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <FaPhone className="mr-3 text-violet-400" />
                  <span>+1 234 567 89</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div
            className="flex flex-col mt-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h2 className="text-xl font-bold text-white mb-6 relative inline-block">
              Business Hours
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-violet-500 rounded-full"></span>
            </h2>
            <ul className="space-y-3">
              <li className="text-gray-300 flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 8:00 PM</span>
              </li>
              <li className="text-gray-300 flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 6:00 PM</span>
              </li>
              <li className="text-gray-300 flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          {/* customer support */}
          <div
            className=" m-2 p-6 bg-violet-600/20 rounded-lg border border-violet-500/30"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h3 className="text-white font-semibold mb-2">Customer Support</h3>
            <p className="text-gray-300 text-base">
              Our team is available 24/7 for urgent auction support
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-5 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Techno Rexers. All rights reserved.</p>

          <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4">
            <a
              href="/privacy-policy"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <span className="hidden md:inline">|</span>
            <a
              href="/terms-of-service"
              className="hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
            <span className="hidden md:inline">|</span>
            <a
              href="/cookie-policy"
              className="hover:text-white transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
