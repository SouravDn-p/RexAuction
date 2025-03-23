import { FaBars } from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";
import DashboardNavbar from "./shared/DashboardNavbar";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Bell,
  LogOut,
  Settings,
  User,
  Search,
  ChevronDown,
} from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";
import ThemeContext from "../Context/ThemeContext";
import { AuthContexts } from "../../providers/AuthProvider";

const MainContent = () => {
  const { user } = useContext(AuthContexts);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  // Get current page name from location
  const getPageName = () => {
    const path = location.pathname.split("/").filter(Boolean);
    if (path.length === 0) return "Dashboard";
    return (
      path[path.length - 1].charAt(0).toUpperCase() +
      path[path.length - 1].slice(1)
    );
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };
  user.role = "admin";
  return (
    <div
      className={`drawer-content flex flex-col md:flex-row justify-between items-stretch 
       `}
    >
      <div className="mx-auto w-11/12 md:w-full ">
        {/* Top Navigation Bar */}
        <header
          className={`sticky top-0 z-10 mx-auto ${
            isDarkMode ? "bg-gray-800/90" : "bg-white"
          } backdrop-blur-md shadow-sm border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left Side: Menu Toggle & Page Title */}
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="my-drawer-2"
                  className={`lg:hidden flex items-center justify-center h-10 w-10 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 text-purple-400 hover:bg-gray-600"
                      : "bg-white text-purple-600 hover:bg-white"
                  } cursor-pointer transition-colors duration-200`}
                >
                  <FaBars size={18} />
                </label>

                <div className="hidden md:block">
                  <h1
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {getPageName()}
                  </h1>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Welcome back to your dashboard
                  </p>
                </div>
              </div>

              {/* Right Side: Search, Notifications, Theme Toggle, Profile */}
              <div className="flex items-center space-x-1 md:space-x-4">
                {/* Search */}
                <div className="relative">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`p-2 rounded-full ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    <Search className="h-5 w-5" />
                  </button>

                  {isSearchOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-72 p-2 rounded-lg shadow-lg ${
                        isDarkMode
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          className={`w-full p-2 pl-8 rounded-md ${
                            isDarkMode
                              ? "bg-gray-700 text-white border-gray-600 focus:border-purple-500"
                              : "bg-gray-100 text-gray-800 border-gray-300 focus:border-purple-500"
                          } border outline-none`}
                          autoFocus
                        />
                        <Search
                          className={`absolute left-2 top-2.5 h-4 w-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <button
                  className={`relative p-2 rounded-full ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors duration-200`}
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Dark Mode Toggle */}
                <button
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-yellow-400"
                      : "hover:bg-gray-100 text-gray-700"
                  } transition-colors duration-200`}
                  onClick={toggleTheme}
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                </button>

                {/* User Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div
                      className={`h-10 w-10 rounded-full border-2 overflow-hidden ${
                        isDarkMode ? "border-purple-600" : "border-purple-400"
                      }`}
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL || "/placeholder.svg"}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={`h-full w-full flex items-center justify-center ${
                            isDarkMode ? "bg-purple-800" : "bg-purple-600"
                          } text-white`}
                        >
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg overflow-hidden ${
                        isDarkMode
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div
                        className={`p-3 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <p className="text-sm font-medium">{user.name}</p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          className={`w-full flex items-center px-4 py-2 text-sm ${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100"
                          } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </button>
                        <button
                          className={`w-full flex items-center px-4 py-2 text-sm ${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100"
                          }
                          ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </button>
                        <button
                          className={`w-full flex items-center px-4 py-2 text-sm ${
                            isDarkMode
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-gray-100"
                          }`}
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* <DashboardNavbar /> */}
        <div className="bg-white rounded-lg flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
