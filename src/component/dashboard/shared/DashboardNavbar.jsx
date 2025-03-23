import { useContext, useEffect, useState } from "react";
import { Bell, Moon, Sun, LogOut, Settings, User } from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";
import { AuthContexts } from "../../../providers/AuthProvider";

export default function DashboardNavbar() {
  const [theme, setTheme] = useState("light");
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  const user = {
    photoURL: "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg",
    name: "Sourav Debnath",
    email: "sourav@example.com",
    role: "admin",
  };

  return (
    <div
      className={`sticky top-0 z-10 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100 text-gray-800"
      } backdrop-blur-md shadow-md pb-4 mb-4`}
    >
      <div className="container mx-auto flex justify-end">
        {/* Navbar Right: Actions and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className={`relative p-2 rounded-full hover:${
              isDarkMode ? "bg-gray-800" : " bg-gray-200"
            }`}
            onClick={handleNotificationClick}
          >
            <Bell
              className={`h-5 w-5 ${isDarkMode ? "text-white" : "text-black"}`}
            />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            className="text-xl hover:text-gray-300"
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-black" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              className="h-10 w-10 rounded-full border-2 border-gray-500 overflow-hidden"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="h-full w-full flex items-center justify-center bg-gray-400 text-white">
                  {user.name.charAt(0)}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                } shadow-lg rounded-md overflow-hidden`}
              >
                <div className="p-3 border-b dark:border-gray-700">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <button className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </button>
                <button className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
                <button
                  className="w-full flex items-center p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
