import React from "react";
import footerBG from '../../assets/footer.jpg'; 
import Newsletter from "./Newsletter";

const Footer = () => {
  return (

    <footer
      className="bg-no-repeat bg-cover bg-center py-8"
      style={{ backgroundImage: `url(${footerBG})` }}
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Newsletter Section */}
        <div className="mt-7 mb-[60px]">
          <Newsletter />
        </div>

        {/* Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Quick Links */}
          <div className="flex flex-col md:mr-10">
            <h2 className="text-xl font-bold text-white">Quick Links</h2>
            <a href="#home" className="text-sm text-white font-semibold hover:text-gray-300 py-1">Home</a>
            <a href="#about" className="text-sm text-white font-semibold hover:text-gray-300 py-1">About Us</a>
            <a href="#faq" className="text-sm text-white font-semibold hover:text-gray-300 py-1">FAQs</a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <a href="mailto:support@rexauction.com" className="text-sm text-white font-semibold hover:text-gray-300 py-1">
              support@rexauction.com
            </a>
            <a href="tel:+123456789" className="text-sm text-white font-semibold hover:text-gray-300 py-1">
              +1 234 567 89
            </a>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-6 justify-center">
            <a href="https://facebook.com" className="text-gray-300 hover:text-white">
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="https://twitter.com" className="text-gray-300 hover:text-white">
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="https://instagram.com" className="text-gray-300 hover:text-white">
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a href="https://linkedin.com" className="text-gray-300 hover:text-white">
              <i className="fab fa-linkedin-in text-lg"></i>
            </a>
          </div>

          {/* Logo and Description */}
          <div>
            <h1 className="text-2xl font-bold text-white">Rex Auction</h1>
            <p className="text-sm text-gray-200 mt-2">
              A reliable platform for bidding and auctioning items. Find great deals, <br />
              or auction your own items today.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Rex Auction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
