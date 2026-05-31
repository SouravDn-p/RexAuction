import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ThemeContext from '../../../Context/ThemeContext';

const BlogCard = () => {
    const { isDarkMode } = useContext(ThemeContext);

    // Placeholder images related to blogging
    const blogImages = [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', // Laptop with notebook
        'https://neilpatel.com/wp-content/uploads/2017/02/blogging.jpg', // Person writing
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', // Desk with laptop and coffee
        'https://cdn.logojoy.com/wp-content/uploads/20250313151628/Blog-name-ideas-for-all-blogs.jpg', // Pen and notebook
    ];

    return (
        <div className="p-4 sm:p-10">
            <style>
                {`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes zoomIn {
                        from {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }
                    .animate-fadeInUp {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    .animate-zoomIn {
                        animation: zoomIn 0.6s ease-out forwards;
                    }
                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }
                `}
            </style>
            <div
                className={`flex gap-4 sm:gap-6 flex-col rounded-xl md:flex-row items-center justify-between p-4 sm:p-8 max-w-5xl mx-auto transition-all duration-300 animate-fadeInUp ${
                    isDarkMode
                        ? 'bg-gray-900 text-white'
                        : 'backdrop-blur-3xl text-gray-800'
                }`}
            >
                {/* Left Section: Text and Buttons */}
                <div className="md:w-1/2 mb-4 sm:mb-6 md:mb-0">
                    <h2
                        className={`text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 animate-fadeInUp ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        style={{ animationDelay: '0.2s' }}
                    >
                        Join Our <span className="text-purple-500 font-bolder">Blog </span>Community And Stay Informed Today
                    </h2>
                    <p
                        className={`text-base sm:text-lg mb-4 sm:mb-6 animate-fadeInUp ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                        style={{ animationDelay: '0.4s' }}
                    >
                        Discover Insights, Tips, And Stories To Keep You Inspired And Engaged
                    </p>
                    <div className="flex gap-2 sm:gap-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                        <Link
                            to="/blogs"
                            className="bg-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Read More
                        </Link>
                        <Link
                            to="/blogs"
                            className={`border-2 border-purple-500 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                                isDarkMode
                                    ? 'text-white border-purple-500 hover:bg-purple-500 hover:text-white'
                                    : 'text-purple-500 border-purple-500 hover:bg-purple-500 hover:text-white'
                            }`}
                        >
                            Explore Blogs
                        </Link>
                    </div>
                </div>

                {/* Right Section: Images */}
                <div className="md:w-1/2 grid grid-cols-2 gap-2 sm:gap-4">
                    {blogImages.map((image, index) => (
                        <div
                            key={index}
                            className={`relative ${
                                index === 2 ? 'rounded-full' : 'rounded-2xl'
                            } overflow-hidden border-2 border-purple-500 shadow-md animate-zoomIn animate-float transition-all duration-300 hover:brightness-110 hover:scale-105`}
                            style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                        >
                            <img
                                src={image}
                                alt={`Blog image ${index + 1}`}
                                className="w-full h-32 sm:h-40 object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=Blog+Image';
                                }}
                            />
                            {/* Purple overlay with 40% opacity */}
                            <div className="absolute inset-0 bg-purple-500 opacity-40"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogCard;