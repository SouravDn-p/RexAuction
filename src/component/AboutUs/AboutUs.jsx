import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import auction1 from "../../assets/auction.jpg";
import auction2 from "../../assets/auction2.jpg";
import auction3 from "../../assets/auction3.jpg";
import auction4 from "../../assets/auction4.jpg";
import { Link } from "react-router-dom";
const AboutUs = () => {
  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: true,
  };

  return (
    <div className="min-h-screen bg-purple-400 text-white">
      {/* Carousel Section */}
      <div className="w-full h-96 md:h-[500px] overflow-hidden">
        <Slider {...carouselSettings}>
          <div>
            <img
              src={auction1}
              alt="Auction Art"
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </div>
          <div>
            <img
              src={auction2}
              alt="Auction Antique"
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </div>
          <div>
            <img
              src={auction3}
              alt="Auction Jewelry"
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </div>
          <div>
            <img
              src={auction4}
              alt="Auction Cars"
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </div>
        </Slider>
      </div>

      {/* About Us Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 animate-bounce">
          About RexAuction
        </h1>

        {/* Lottie Animation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <Player
            autoplay
            loop
            src="https://assets10.lottiefiles.com/packages/lf20_5tkzkblw.json"
            style={{ height: "200px", width: "200px" }}
          />
        </div>

        {/* How It Works Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* card 1 */}
          <div className="bg-purple-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="text-lg">
              RexAuction is a cutting-edge online auction platform that connects
              buyers and sellers from around the world. Whether you're looking
              for rare antiques, unique art pieces, or luxury items, RexAuction
              offers a seamless and secure bidding experience.
            </p>
          </div>
          {/* card 2 */}
          <div className="bg-orange-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-4">Why Choose RexAuction?</h2>
            <p className="text-lg">
              Our platform is built with the latest technologies, ensuring a
              smooth and reliable experience. With real-time bidding, secure
              payments, and a user-friendly interface, RexAuction is your go-to
              destination for online auctions.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 md:mt-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join the RexAuction Community
          </h2>
          <p className="text-lg mb-8">
            Become part of a global community of collectors, enthusiasts, and
            sellers. Start bidding today and discover unique treasures from
            around the world!
          </p>
          <Link to="/">
            <button className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
