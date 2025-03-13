import React, { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";
import auction1 from "../assets/auction.jpg";
import auction2 from "../assets/auction2.jpg";
import auction3 from "../assets/auction3.jpg";
import auction4 from "../assets/auction4.jpg";
import { Link } from "react-router-dom";
import auctionbg from "../assets/auction5.jpg";
const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
    <div className="relative min-h-screen text-white">
      {/* Background Image */}
      <div
        className="absolute py-10 px-4 md:px-8 sm:p-4 inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${auctionbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Overlay*/}
      <div className="absolute inset-0 bg-slate-600 bg-opacity-30 backdrop-blur-md z-0" />

      {/* Main Content */}
      <div className="relative lg:p-8 md:p-6 sm:p-6 z-10">
        {/* Carousel Section */}
        <div className="w-full rounded-xl h-96 md:h-[500px] overflow-hidden">
          <Slider {...carouselSettings}>
            {[auction1, auction2, auction3, auction4].map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Auction Slide ${index + 1}`}
                  className="w-full h-96 md:h-[500px] object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* About Us Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 animate-bounce">
            About RexAuction
          </h1>

          {/* Lottie Animation */}
          <div className="flex justify-center mb-10">
            <Player
              autoplay
              loop
              src="https://assets10.lottiefiles.com/packages/lf20_5tkzkblw.json"
              style={{ height: "200px", width: "200px" }}
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flip Card - How It Works */}
            <div className="group perspective" data-aos="fade-up">
              <div className="relative transition-transform duration-700 transform-style preserve-3d group-hover:rotate-y-180 p-6 rounded-xl shadow-xl bg-white/60 text-slate-600 border-2 border-transparent hover:border-purple-400 hover:shadow-purple-500 overflow-hidden">
                <div className="absolute inset-0 border-2 border-orange-500 rounded-xl opacity-0 group-hover:opacity-100 animate-pulse duration-700 pointer-events-none"></div>

                {/* Front Side */}
                <div className="backface-hidden">
                  <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                  <p className="text-lg">
                    RexAuction is a cutting-edge online auction platform that
                    connects buyers and sellers from around the world. Whether
                    you're looking for rare antiques, unique art pieces, or
                    luxury items, RexAuction offers a seamless and secure
                    bidding experience.
                  </p>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 bg-black/50 text-white rounded-xl p-6 transform rotate-y-180 backface-hidden">
                  <h2 className="text-2xl font-bold mb-4">Secure & Seamless</h2>
                  <p className="text-lg">
                    Bidding has never been this effortless. Enjoy live auctions
                    with real-time feedback and fast payment processing.
                  </p>
                </div>
              </div>
            </div>

            {/* Static Card - Why Choose RexAuction */}
            <div
              className="p-6 rounded-xl shadow-xl bg-white/60 text-slate-600 border-2 border-transparent hover:border-orange-400 hover:shadow-orange-500 transition-all duration-500 relative overflow-hidden group"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="absolute inset-0 border-2 border-orange-500  rounded-xl opacity-0 group-hover:opacity-100 animate-pulse duration-700 pointer-events-none"></div>
              <h2 className="text-2xl font-bold mb-4">
                Why Choose RexAuction?
              </h2>
              <p className="text-lg">
                Our platform is built with the latest technologies, ensuring a
                smooth and reliable experience. With real-time bidding, secure
                payments, and a user-friendly interface, RexAuction is your
                go-to destination for online auctions.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div
            className="mt-12 text-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h2 className="text-3xl font-bold mb-4">
              Join the RexAuction Community
            </h2>
            <p className="text-lg mb-6">
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
    </div>
  );
};

export default AboutUs;
