"use client";

import { useContext, useState } from "react";
import { Bell, Moon, Search, Sun, LogOut, Settings, User } from "lucide-react";
import { AuthContexts } from "../../../providers/AuthProvider";

export default function DashboardNavbar() {
  const { user } = useContext(AuthContexts);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light"); // Replace with actual theme logic if needed
  const [notificationCount, setNotificationCount] = useState(3);

 
  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  return (
    <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 backdrop-blur-md shadow-md p-4">
      <div className="container mx-auto flex justify-end">
     

        {/* Navbar Right: Actions and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button className="h-10 w-10 rounded-full border-2 border-gray-500 overflow-hidden">
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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden hidden">
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
          </div>
        </div>
      </div>
    </div>
  );
}
