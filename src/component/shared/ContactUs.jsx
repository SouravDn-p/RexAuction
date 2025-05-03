

import React, { useContext } from 'react';
import ThemeContext from '../Context/ThemeContext';

const ContactUs = () => {
    const { isDarkMode } = useContext(ThemeContext);

    // Reusable input class with refined dark/light styles
    const inputClass = `
    border 
    rounded-md 
    px-4 
    py-2 
    w-full 
    focus:outline-none 
    focus:ring-2 
    focus:ring-purple-400 
    transition-colors 
    duration-300
    ${isDarkMode
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        }
  `;

    return (
        <div
            className={`min-h-screen pt-8 transition-colors duration-500 ${isDarkMode
                ? 'bg-gray-900 text-white'
                : 'bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800'
                }`}
        >
            <div className="flex flex-col md:flex-row p-6 md:p-16 gap-10">
                {/* Left Section: Form */}
                <div
                    className={`shadow-lg rounded-xl p-8 w-full md:w-1/2 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                >
                    <h2 className="text-2xl font-semibold mb-6">Contact With our team</h2>
                    <form className="space-y-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="First Name *"
                                className={inputClass}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name *"
                                className={inputClass}
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <input
                                type="email"
                                placeholder="Work Email *"
                                className={inputClass}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Job Title"
                                className={inputClass}
                            />
                        </div>
                        <input
                            type="tel"
                            placeholder="Phone number *"
                            className={inputClass}
                            required
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Company Name *"
                                className={inputClass}
                                required
                            />
                            <select className={inputClass} required>
                                <option value="">Please select</option>
                                <option value="1-10">1-10</option>
                                <option value="11-50">11-50</option>
                                <option value="51-200">51-200</option>
                                <option value="200+">200+</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="What would you like to manage with babelforge.com? *"
                            className={`${inputClass} h-20 resize-y`}
                            required
                        />
                        <textarea
                            placeholder="How can our team help you?"
                            className={`${inputClass} h-20 resize-y`}
                        />
                        <div className="flex items-start gap-2">
                            <input type="checkbox" required />
                            <label className="text-sm">
                                Accept terms and conditions
                                <br />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    By clicking submit, I acknowledge babelforge.com Privacy Policy
                                </span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-md hover:opacity-90"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                {/* Right Section: Info */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl font-semibold mb-6">
                        Align, collaborate, and gain visibility into your work in one connected space
                    </h2>
                    <div className="space-y-6 text-sm">
                        <div className="flex gap-4 items-start">
                            <span className="text-purple-600 font-bold">Across 200+ countries</span>
                            <p>
                                Meet with a product consultant to see how babelforge.com can fit your exact
                                business needs
                            </p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <span className="text-purple-600 font-bold">225k+ paying customers</span>
                            <p>Explore our tailored pricing plans based on your goals and priorities</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <span className="text-purple-600 font-bold">Serving 200+ industries</span>
                            <p>Boost productivity from day one by building your team's ideal workflow</p>
                        </div>
                    </div>
                    <p className="text-sm mt-6 text-gray-500 dark:text-gray-400">
                        Trusted by 225,000+ customers, from startups to enterprises
                    </p>
                    <div className="mt-4 flex gap-4 flex-wrap items-center">
                        {/* Add company logos here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;