import React, { useState } from "react";
import newsLetter from "../../assets/5974451_22060-removebg-preview.png";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    // Simulate form submission
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    // Mock API call - replace with actual API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ text: "Thank you for subscribing!", type: "success" });
      setEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    }, 1500);
  };

  return (
    <div
      className="relative border-2 border-purple-700 bg-gradient-to-b from-purple-200 to-purple-500 px-6 md:px-10 py-8 rounded-lg shadow-2xl max-w-4xl mx-auto 
      transition-all duration-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-orange-400/20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-800/10"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-orange-300/20"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side - Image with Animation */}
        <div className="mb-4 md:mb-0 relative">
          <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-orange-400/30 animate-pulse"></div>
          <img
            src={newsLetter || "/placeholder.svg"}
            alt="Auction Newsletter"
            className="w-[200px] md:w-[250px] mx-auto transform transition-transform duration-700 hover:scale-105"
            style={{
              animation: "floating 3s ease-in-out infinite",
            }}
          />
        </div>

        {/* Right Side - Text & Subscription Form */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="bg-purple-800/20 inline-block px-3 py-1 rounded-full mb-2">
            <h3 className="text-orange-600 font-bold text-sm md:text-base tracking-wider">
              REX AUCTION NEWSLETTER
            </h3>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Get Exclusive <span className="text-orange-500">Benefits</span>
          </h2>

          <p className="text-purple-900 mb-5 max-w-md">
            Subscribe to our newsletter and stay updated with the latest
            auctions, special offers, and exclusive deals!
          </p>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row items-center rounded-full overflow-hidden shadow-md bg-white">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                className="w-full px-6 py-4 focus:outline-none text-purple-900 placeholder-purple-400"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-semibold w-full sm:w-auto transition-all duration-300 flex items-center justify-center ${
                  isSubmitting ? "opacity-70" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "SUBSCRIBE"
                )}
              </button>
            </div>

            {message.text && (
              <div
                className={`mt-3 text-sm ${
                  message.type === "error" ? "text-red-600" : "text-green-600"
                } bg-white/80 p-2 rounded-lg`}
              >
                {message.text}
              </div>
            )}

            <p className="text-xs text-purple-900/80 mt-3">
              By subscribing, you agree to our{" "}
              <a
                href="/privacy-policy"
                className="underline hover:text-purple-900"
              >
                Privacy Policy
              </a>
              . We respect your privacy and will never share your information.
            </p>
          </form>

          {/* Benefits Icons */}
          <div className="flex justify-center md:justify-start mt-5 space-x-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xs text-purple-900">Early Access</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xs text-purple-900">Special Deals</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xs text-purple-900">Instant Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes floating {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default Newsletter;
