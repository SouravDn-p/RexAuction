import React, { useContext, useEffect, useCallback, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import AOS from "aos";
import "aos/dist/aos.css";
import ThemeContext from "../Context/ThemeContext";
import { useLocation } from "react-router-dom";

// Social Media Icons
const SocialLinks = React.memo(() => {
  const links = [
    { href: "https://facebook.com", icon: <FaFacebookF />, label: "Facebook" },
    { href: "https://twitter.com", icon: <FaXTwitter />, label: "Twitter" },
    {
      href: "https://instagram.com",
      icon: <FaInstagram />,
      label: "Instagram",
    },
    { href: "https://linkedin.com", icon: <FaLinkedinIn />, label: "LinkedIn" },
  ];

  return (
    <div className="flex gap-4 mt-6">
      {links.map(({ href, icon, label }, idx) => (
        <a
          key={idx}
          href={href}
          aria-label={label}
          className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition floating-icon border border-violet-500/50"
        >
          {icon}
        </a>
      ))}
    </div>
  );
});

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useContext(ThemeContext);
  const [showParticles, setShowParticles] = useState(false);

  // Animate on scroll
  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (window.innerWidth > 768) setShowParticles(true);
  }, [location.pathname]);

  const particlesInit = useCallback(
    async (main) => {
      await loadFull(main);
    },
    [location]
  );

  return (
    <footer
      className={`relative py-10 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-r from-purple-600 to-purple-400"
      } backdrop-blur-md`}
    >
      {/* Particles */}
      {showParticles && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            particles: {
              color: { value: isDarkMode ? "#ffffff" : "#2d2d2d" },
              links: {
                enable: true,
                color: isDarkMode ? "#ffffff" : "#6b21a8",
                distance: 100,
              },
              move: { enable: true, speed: 1 },
              number: { value: 100 },
              size: { value: 3 },
              opacity: { value: 0.5 },
            },
          }}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          {/* Logo & About */}
          <div
            className="flex flex-col items-center md:items-start"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex items-center gap-2">
              <img
                className="w-[60px] lg:w-[70px] animate-pulse pt-6"
                src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                alt="rexauction"
              />
              <h1 className="text-3xl font-bold text-white">
                <span className="text-violet-400">Rex</span> Auction
              </h1>
            </div>
            <p className="text-gray-300 mt-2 max-w-xs">
              A reliable platform for bidding and auctioning items. Find great
              deals or auction your own items today.
            </p>
            <SocialLinks />
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
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center hover:text-white">
                <FaMapMarkerAlt className="mr-3 text-violet-400" />
                123 Auction Street, NY 10001
              </li>
              <li className="flex items-center hover:text-white">
                <FaEnvelope className="mr-3 text-violet-400" />
                <a href="mailto:rexauctiontechnorexers@gmail.com">
                  rexauctiontechnorexers@gmail.com
                </a>
              </li>
              <li className="flex items-center hover:text-white">
                <FaPhone className="mr-3 text-violet-400" />
                <a href="tel:+123456789">+1 234 567 89</a>
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
            <ul className="space-y-3 text-gray-300">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div
            className="m-2 p-6 bg-violet-600/20 rounded-lg border border-violet-500/30"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h3 className="text-white font-semibold mb-2">Customer Support</h3>
            <p className="text-gray-300 text-base">
              Our team is available 24/7 for urgent auction support.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-5 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Techno Rexers. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, idx) => (
                <React.Fragment key={idx}>
                  <a
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="hover:text-white"
                  >
                    {item}
                  </a>
                  {idx < 2 && <span className="hidden md:inline">|</span>}
                </React.Fragment>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
