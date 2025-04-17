import { FaBars } from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
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
import auth from "../../firebase/firebase.init";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import LoadingSpinner from "../LoadingSpinner";
import io from "socket.io-client";
import axios from "axios";

const MainContent = () => {
  const {
    user,
    setUser,
    setLoading,
    errorMessage,
    setErrorMessage,
    dbUser,
    isMobile,
    setIsMobile,
    selectedUser,
    setSelectedUser,
  } = useContext(AuthContexts);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const chatPath = location.pathname.includes("chat");

  // Initialize socket connection
  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on("receiveNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setNotificationCount((prev) => prev + 1);

        toast.info(notification.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/notifications/${user.email}`,
            {
              withCredentials: true,
            }
          );

          if (response.data) {
            setNotifications(response.data);
            const unreadCount = response.data.filter(
              (notif) => !notif.read
            ).length;
            setNotificationCount(unreadCount);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [user]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const markNotificationsAsRead = async () => {
    if (notifications.length === 0) return;

    try {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setNotificationCount(0);

      if (user) {
        await axios.put(
          `http://localhost:5000/notifications/mark-read/${user.email}`,
          {},
          {
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const viewNotificationDetails = (notification) => {
    // Mark the notification as read locally
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
    );

    // Decrease notification count if applicable
    if (notificationCount > 0) {
      setNotificationCount((prev) => prev - 1);
    }

    // Update the notification as read in the database
    if (user) {
      axios
        .put(
          `http://localhost:5000/notifications/mark-read/${user.email}`,
          { notificationId: notification._id },
          { withCredentials: true }
        )
        .catch((error) => {
          console.error("Error marking notification as read:", error);
        });
    }

    // Close notifications panel
    setIsNotificationsOpen(false);

    // Navigate to the announcement page
    navigate("/dashboard/announcement", {
      state: { notificationDetails: notification },
    });
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setErrorMessage(null);
      toast.success("Successfully signed out", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (err) {
      console.error("Sign-Out error:", err.message);
      setErrorMessage(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPageName = () => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/announcement":
        return "Announcements";
      case "/dashboard/profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <div
      className={`drawer-content flex flex-col md:flex-row justify-between items-stretch`}
    >
      <div className="mx-auto w-full">
        {/* Top Navigation Bar */}
        <header
          className={`sticky top-0 z-10 mx-auto  ${
            chatPath && selectedUser ? "hidden" : "block"
          } ${
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
                <div className="relative" ref={notificationsRef}>
                  <button
                    className={`relative p-2 rounded-full ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-white"
                        : "hover:bg-gray-100 text-black"
                    } transition-colors duration-200`}
                    onClick={handleNotificationClick}
                  >
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md shadow-lg ${
                        isDarkMode
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div
                        className={`p-3 border-b flex justify-between items-center ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <h3 className="font-medium">Notifications</h3>
                        {notificationCount > 0 && (
                          <button
                            onClick={markNotificationsAsRead}
                            className={`text-xs px-2 py-1 rounded ${
                              isDarkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="py-1">
                        {notifications.length > 0 ? (
                          notifications.map((notification, index) => (
                            <div
                              key={notification._id || index}
                              onClick={() =>
                                viewNotificationDetails(notification)
                              }
                              className={`px-4 py-3 border-b last:border-b-0 cursor-pointer ${
                                isDarkMode
                                  ? "border-gray-700 hover:bg-gray-700"
                                  : "border-gray-100 hover:bg-gray-50"
                              } ${
                                !notification.read
                                  ? isDarkMode
                                    ? "bg-gray-700/50"
                                    : "bg-blue-50"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start">
                                <div
                                  className={`p-2 rounded-full mr-3 ${
                                    isDarkMode ? "bg-gray-700" : "bg-blue-100"
                                  }`}
                                >
                                  {notification.type === "auction" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-blue-500"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <Bell className="h-5 w-5 text-blue-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p
                                    className={`font-medium text-sm ${
                                      !notification.read ? "font-bold" : ""
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {notification.message}
                                  </p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isDarkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {new Date(
                                      notification.timestamp
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1"></div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            className={`px-4 py-6 text-center ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <p>No notifications yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
                        isDarkMode
                          ? "border-purple-600"
                          : "border-purple-400 text-black"
                      }`}
                    >
                      {user?.photoURL ? (
                        <img
                          src={user?.photoURL || "/placeholder.svg"}
                          alt={user?.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className={`h-full w-full flex items-center justify-center ${
                            isDarkMode ? "bg-purple-800" : "bg-purple-600"
                          } text-white`}
                        >
                          {user?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-sm">{user?.name}</p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {dbUser?.role}
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
                          isDarkMode ? "border-gray-700" : "border-gray-200 "
                        }`}
                      >
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={`/dashboard/profile`}
                          className={`w-full flex items-center px-4 py-2 text-sm ${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100 text-black"
                          }`}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          className={`w-full flex items-center px-4 py-2 text-sm ${
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100 text-black"
                          }`}
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
        <div className="bg-white rounded-lg flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
