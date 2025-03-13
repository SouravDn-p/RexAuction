import React from "react";
import footerBG from '../../assets/footer.png'; // Ensure correct path to the image

const Footer = () => {
  return (
    <footer
      className="bg-no-repeat mt-[200px] bg-cover w-2/2 bg-center  py-8" // bg-contain will ensure the entire image is shown
      style={{ backgroundImage: `url(${footerBG})` }} // Use the correct syntax for background image
    >
      <div className="container mt-[150px] mx-auto px-4">
        <div className="flex flex-col  md:flex-row justify-between items-center">


          {/* Quick Links */}
          <div className="flex flex-col md:flex-row mb-4 md:mb-0">
            <div className="flex flex-col md:mr-10">
              <h2 className="font-semibold text-lg">Quick Links</h2>
              <a href="#home" className="text-sm text-gray-400 hover:text-white py-1">
                Home
              </a>
              <a href="#about" className="text-sm text-gray-400 hover:text-white py-1">
                About Us
              </a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white py-1">
                FAQs
              </a>
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold text-lg">Contact</h2>
              <a href="mailto:support@rexauction.com" className="text-sm text-gray-400 hover:text-white py-1">
                support@rexauction.com
              </a>
              <a href="tel:+123456789" className="text-sm text-gray-400 hover:text-white py-1">
                +1 234 567 89
              </a>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-4 justify-center md:justify-end">
            <a href="https://facebook.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-linkedin-in text-lg"></i>
            </a>
          </div>
            {/* Logo and Description */}
            <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-2xl font-semibold">Rex Auction</h1>
            <p className="text-sm mt-2">
              A reliable platform for bidding and auctioning items. Find great deals, or auction your own items today.
            </p>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Rex Auction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
