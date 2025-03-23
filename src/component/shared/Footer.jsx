import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import footerBG from "../../assets/footer.jpg";
import Newsletter from "./Newsletter";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-no-repeat bg-cover bg-center py-12 relative"
      style={{ backgroundImage: `url(${footerBG})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold text-white mb-4">
              <span className="text-violet-400">Rex</span> Auction
            </h1>
            <p className="text-gray-300 mt-2 max-w-xs">
              A reliable platform for bidding and auctioning items. Find great
              deals, or auction your own items today.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-violet-500 rounded-full"></span>
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> About Us
                </a>
              </li>
              <li>
                <a
                  href="#auctions"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Auctions
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> How It Works
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
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
                  href="mailto:support@rexauction.com"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <FaEnvelope className="mr-3 text-violet-400" />
                  <span>support@rexauction.com</span>
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
          <div className="flex flex-col">
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

            <div className="mt-6 p-4 bg-violet-600/20 rounded-lg border border-violet-500/30">
              <h3 className="text-white font-semibold mb-2">
                Customer Support
              </h3>
              <p className="text-gray-300 text-sm">
                Our team is available 24/7 for urgent auction support
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Rex Auction. All rights reserved.</p>

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
