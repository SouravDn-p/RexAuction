import { useContext, useEffect, useState, useRef } from "react";
import {
  FaSun,
  FaMoon,
  FaWallet,
  FaPlus,
  FaUserCircle,
  FaGavel,
  FaBloggerB,
} from "react-icons/fa";
import { IoMdContact } from "react-icons/io";
import { MdOutlineDashboard, MdOutlineLogout } from "react-icons/md";
import { FiInfo } from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContexts } from "../../providers/AuthProvider";
import ThemeContext from "../../component/Context/ThemeContext";
import auth from "../../firebase/firebase.init";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import io from "socket.io-client";
import axios from "axios";

const Navbar = () => {
  const {
    user,
    setUser,
    setLoading,
    setErrorMessage,
    dbUser,
    setDbUser,
    walletBalance,
    setWalletBalance,
  } = useContext(AuthContexts);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(300);
  const [accountNumber, setAccountNumber] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const socketRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  // Socket.IO connection
  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io(
        "https://rex-auction-server-side-jzyx.onrender.com",
        {
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
        }
      );

      socketRef.current.on("receiveNotification", (notification) => {
        console.log("Received notification:", notification); // Debug log
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
            `https://rex-auction-server-side-jzyx.onrender.com/notifications/${user.email}`,
            {
              withCredentials: true,
            }
          );
          console.log("Fetched notifications:", response.data); // Debug log
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

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleGoogleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setErrorMessage(null);
      setShowProfileMenu(false);
      toast.success("Successfully signed out", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Sign-Out error:", err.message);
      setErrorMessage(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSubmit = async () => {
    if (!accountNumber) {
      toast.error("Please enter your account number");
      return;
    }

    const updatedBalance = dbUser.accountBalance + Number(depositAmount);
    setWalletBalance(updatedBalance);

    try {
      const res = await axiosPublic.patch(`/accountBalance/${dbUser._id}`, {
        accountBalance: updatedBalance,
      });
      if (res.data.success) {
        Swal.fire(
          "Updated!",
          "User accountBalance has been upgraded.",
          "success"
        );
        if (user?.email) {
          setLoading(true);
          axiosPublic
            .get(`/user/${user.email}`)
            .then((res) => {
              setDbUser(res.data);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
              setErrorMessage("Failed to load user data");
              setLoading(false);
            });
        }
      } else {
        Swal.fire("Failed!", "Could not update user role.", "error");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire("Error!", "Something went wrong!", "error");
    }

    toast.success(`Successfully added ${depositAmount} to your wallet!`);
    setShowWalletModal(false);
    setAccountNumber("");
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
          `https://rex-auction-server-side-jzyx.onrender.com/notifications/mark-read/${user.email}`,
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
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
    );
    if (notificationCount > 0) {
      setNotificationCount((prev) => prev - 1);
    }

    if (user) {
      axiosPublic
        .put(
          `/notifications/mark-read/${user.email}`,
          { notificationId: notification._id },
          { withCredentials: true }
        )
        .catch((error) => {
          console.error("Error marking notification as read:", error);
        });
    }

    // Navigate based on notification type
    if (notification.type === "auction" && notification.auctionData?._id) {
      navigate(`/dashboard/auction-details/${notification.auctionData._id}`);
    } else if (
      notification.type === "announcement" &&
      notification.announcementData?._id
    ) {
      // Navigate to announcement details with ID
      navigate(`/dashboard/announcement/${notification.announcementData._id}`, {
        state: { notificationDetails: notification },
      });
    } else {
      // Fallback for notifications without specific announcement data
      navigate("/dashboard/announcement", {
        state: { notificationDetails: notification },
      });
    }

    setIsNotificationsOpen(false);
  };

  const getNavLinkClass = (path) =>
    location.pathname === path
      ? isDarkMode
        ? "flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-700/60 text-white font-bold shadow-md"
        : "flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-200 text-indigo-900 font-bold shadow-md"
      : isDarkMode
      ? "flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-indigo-800/40 text-indigo-100"
      : "flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-indigo-100 text-indigo-800";

  const navRoutes = [
    // { path: "/", label: "Home", icon: <FiHome className="w-5 h-5" /> },
    ...(user?.email
      ? [
          {
            path: "/auction",
            label: "Auction",
            icon: <FaGavel className="w-5 h-5" />,
          },
        ]
      : []),
    {
      path: "/aboutUs",
      label: "About Us",
      icon: <FiInfo className="w-5 h-5" />,
    },
    {
      path: "/blogs",
      label: "Blog",
      icon: <FaBloggerB className="w-5 h-5" />,
    },
    {
      path: "/contactUs",
      label: "Contact Us",
      icon: <IoMdContact className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      <nav
        className={`fixed  top-0 w-full z-50 shadow-lg transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? "backdrop-blur-md bg-gray-900/30 shadow-lg"
              : "backdrop-blur-md bg-purple-800/80 shadow-lg "
            : isDarkMode
            ? "bg-gray-900/90"
            : "bg-purple-800/70 "
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="relative group">
            <div className="flex items-center">
              <div className="relative overflow-hidden rounded-full">
                <img
                  className="w-14 mt-4 lg:w-14 transition-transform duration-300 group-hover:scale-110"
                  src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                  alt="Rex Auction Logo"
                />
              </div>
              <h1 className="font-bold text-lg md:text-xl lg:text-2xl tracking-tight">
                <span
                  className={`${
                    isDarkMode
                      ? "text-transparent bg-clip-text bg-white border-b-2 border-purple-600"
                      : "text-transparent bg-clip-text bg-white border-purple-600 border-b-2 "
                  } font-serif`}
                >
                  Rex
                </span>
                <span className="text-white transition-all duration-500 group-hover:tracking-wider">
                  {" "}
                  Auction
                </span>
              </h1>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 to-purple-700/0 group-hover:from-purple-500/10 group-hover:to-purple-700/10 rounded-lg blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          </Link>

          <div className="hidden lg:flex justify-center flex-grow">
            <div className="flex items-center space-x-6">
              {navRoutes.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 group ${
                    location.pathname === item.path
                      ? "text-white font-bold border-b-2 border-purple-400"
                      : isDarkMode
                      ? "text-white hover:text-purple-200"
                      : "text-white hover:text-purple-100"
                  }`}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:transform group-hover:translate-y-[-2px]">
                    {item.label}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-400/0 group-hover:from-pink-500/5 group-hover:to-purple-400/5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {user?.email ? (
              <>
                {/* <button
                  className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-all duration-300 relative overflow-hidden ${
                    isDarkMode
                      ? "border-2 text-white hover:border-b-purple-600/90 hover:bg-purple-100/20"
                      : "border text-white hover:bg-purple-100/20 hover:border-b-purple-500 border-b-2"
                  } hover:shadow-md hover:scale-105`}
                  onClick={() => setShowWalletModal(true)}
                >
                  <FaWallet
                    className={`text-purple-400"
                     transition-transform duration-300 group-hover:scale-110`}
                  />
                  <span
                    className={`${
                      isDarkMode ? "text-indigo-100" : "text-white"
                    } relative z-10`}
                  >
                    $ {dbUser?.accountBalance}
                  </span>
                  <FaPlus className="text-green-400 text-xs animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-400/0 hover:from-indigo-600/20 hover:to-indigo-400/20 transition-all duration-300 opacity-0 hover:opacity-100"></div>
                </button> */}

                {/* Notifications Button and Dropdown (Desktop) */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                      isDarkMode
                        ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                        : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
                    } hover:scale-110`}
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5 relative z-10 transition-transform duration-300 hover:rotate-12" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                        isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                      }`}
                    ></div>
                  </button>

                  {isNotificationsOpen && (
                    <div
                      className={`absolute lg:right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-2xl z-50 backdrop-blur-lg animate-fadeIn max-w-[90vw] lg:max-w-[20rem] lg:top-[3rem] top-12 lg:right-0 right-2 ${
                        isDarkMode
                          ? "bg-gradient-to-b from-indigo-800/90 to-gray-900/90 border border-indigo-700/40"
                          : "bg-gradient-to-b from-white/90 to-indigo-100/90 border border-indigo-200/40"
                      }`}
                    >
                      <div
                        className={`p-3 border-b flex justify-between items-center ${
                          isDarkMode
                            ? "border-indigo-700/50"
                            : "border-indigo-200/50"
                        }`}
                      >
                        <h3
                          className={`font-medium ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Notifications
                        </h3>
                        {notificationCount > 0 && (
                          <button
                            onClick={markNotificationsAsRead}
                            className={`text-xs px-2 py-1 rounded ${
                              isDarkMode
                                ? "bg-indigo-700 hover:bg-indigo-600 text-indigo-200"
                                : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                            }`}
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="py-1">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() =>
                                viewNotificationDetails(notification)
                              }
                              className={`px-4 py-3 border-b last:border-b-0 cursor-pointer transition-all duration-200 ${
                                isDarkMode
                                  ? "border-indigo-700/50 hover:bg-indigo-700/70"
                                  : "border-indigo-200/50 hover:bg-indigo-100"
                              } ${
                                !notification.read
                                  ? isDarkMode
                                    ? "bg-indigo-700/50"
                                    : "bg-blue-50"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start">
                                <div
                                  className={`p-2 rounded-full mr-3 ${
                                    isDarkMode ? "bg-indigo-700" : "bg-blue-100"
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
                                      isDarkMode
                                        ? "text-white"
                                        : "text-gray-800"
                                    } ${!notification.read ? "font-bold" : ""}`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isDarkMode
                                        ? "text-indigo-200"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {notification.message}
                                  </p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      isDarkMode
                                        ? "text-indigo-300"
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
                              isDarkMode ? "text-indigo-200" : "text-gray-500"
                            }`}
                          >
                            <p>No notifications yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dark Mode Toggle Button (Desktop) */}
                <button
                  className={`p-2 lg:p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                      : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
                  } hover:scale-110`}
                  onClick={toggleTheme}
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <FaSun className="text-purple-400 relative z-10 transition-transform duration-300 hover:rotate-12" />
                  ) : (
                    <FaMoon className="text-indigo-700 relative z-10 transition-transform duration-300 hover:rotate-12" />
                  )}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                      isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                    }`}
                  ></div>
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center p-1 rounded-full transition-all duration-300 hover:scale-110 relative"
                  >
                    <img
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg" ||
                        "/placeholder.svg"
                      }
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-pink-400 transition-all duration-300 hover:border-purple-400"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/0 to-purple-400/0 hover:from-pink-500/20 hover:to-purple-400/20 transition-all duration-300 opacity-0 hover:opacity-100 blur-sm"></div>
                  </button>

                  {showProfileMenu && (
                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-lg animate-fadeIn ${
                        isDarkMode
                          ? "bg-gradient-to-b from-indigo-800/90 to-gray-900/90 border border-indigo-700/40"
                          : "bg-gradient-to-b from-white/90 to-indigo-100/90 border border-indigo-200/40"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 ${
                          isDarkMode
                            ? "border-b border-indigo-700/50"
                            : "border-b border-indigo-200/50"
                        }`}
                      >
                        <p
                          className={`font-semibold text-sm ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {user?.displayName || "User"}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isDarkMode ? "text-indigo-200" : "text-indigo-600"
                          }`}
                        >
                          {user?.email}
                        </p>
                        <span className="inline-block px-2 py-0.5 mt-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-xs font-semibold capitalize">
                          {dbUser?.role || "Guest"}
                        </span>
                      </div>

                      {[
                        {
                          to: "/dashboard/profile",
                          icon: <FaUserCircle />,
                          label: "Your Profile",
                        },
                        {
                          to: "/dashboard",
                          icon: <MdOutlineDashboard />,
                          label: "Dashboard",
                        },
                        {
                          to: "/dashboard/walletHistory",
                          icon: <BiMoney />,
                          label: "Wallet History",
                        },
                      ].map((item, index) => (
                        <Link
                          key={index}
                          to={item.to}
                          className={`flex items-center gap-3 py-2 px-4 transition-all duration-200 relative overflow-hidden ${
                            isDarkMode
                              ? "text-indigo-100 hover:bg-indigo-700/70 hover:text-white"
                              : "text-indigo-800 hover:bg-indigo-100 hover:text-indigo-900"
                          }`}
                        >
                          <span
                            className={`${
                              isDarkMode ? "text-indigo-300" : "text-indigo-700"
                            } transition-all duration-300`}
                          >
                            {item.icon}
                          </span>
                          <span className="relative z-10">{item.label}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-pink-500/5 hover:to-purple-400/5 transition-all duration-200 opacity-0 hover:opacity-100"></div>
                        </Link>
                      ))}

                      <div
                        className={`mt-1 ${
                          isDarkMode
                            ? "border-t border-indigo-700/50"
                            : "border-t border-indigo-200/50"
                        }`}
                      >
                        <button
                          onClick={handleGoogleSignOut}
                          className={`w-full flex items-center gap-3 py-2 px-4 transition-all duration-200 relative overflow-hidden ${
                            isDarkMode
                              ? "text-red-300 hover:bg-red-900/50 hover:text-red-200"
                              : "text-red-600 hover:bg-red-100 hover:text-red-700"
                          }`}
                        >
                          <MdOutlineLogout
                            className={`${
                              isDarkMode ? "text-red-300" : "text-red-600"
                            }`}
                          />
                          <span className="relative z-10">Logout</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-red-500/10 hover:to-red-400/5 transition-all duration-200 opacity-0 hover:opacity-100"></div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`relative flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 group ${
                  location.pathname === "/login"
                    ? "text-white font-bold border-b-2 border-purple-500"
                    : isDarkMode
                    ? "text-white hover:text-purple-200"
                    : "text-white hover:text-purple-100"
                }`}
              >
                <FaUserCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative z-10 transition-transform duration-300 group-hover:transform group-hover:translate-y-[-2px]">
                  Login
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-400/0 group-hover:from-pink-500/5 group-hover:to-purple-400/5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
              </Link>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            {user?.email && (
              <div className="hidden">
                <button
                  className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-sm transition-all duration-300 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-indigo-700/50 text-white hover:bg-indigo-600/70"
                      : "bg-indigo-200/50 text-indigo-900 hover:bg-indigo-300/70"
                  } hover:scale-105`}
                  onClick={() => setShowWalletModal(true)}
                >
                  <FaWallet
                    className={`${
                      isDarkMode ? "text-purple-400" : "text-indigo-700"
                    } text-sm`}
                  />
                  <span className="relative z-10 text-sm">
                    $ {dbUser?.accountBalance}
                  </span>
                  <Link to={`/dashboard/walletHistory`}>
                    <FaPlus className="text-green-400 text-xs animate-pulse ml-auto" />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-400/0 hover:from-indigo-600/20 hover:to-indigo-400/20 transition-all duration-300 opacity-0 hover:opacity-100"></div>
                </button>
              </div>
            )}

            {/* Dark Mode Toggle Button (Mobile) */}
            <button
              className={`p-2 lg:p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                isDarkMode
                  ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                  : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
              } hover:scale-110 touch-p-3`}
              onClick={toggleTheme}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <FaSun className="text-purple-400 relative z-10 transition-transform duration-300 hover:rotate-12" />
              ) : (
                <FaMoon className="text-indigo-700 relative z-10 transition-transform duration-300 hover:rotate-12" />
              )}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                  isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                }`}
              ></div>
            </button>
            {/* Mobile Notifications Button */}
            {user?.email && (
              <div className="relative" ref={notificationsRef}>
                <button
                  className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                      : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
                  } hover:scale-110`}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 relative z-10 transition-transform duration-300 hover:rotate-12" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                      isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                    }`}
                  ></div>
                </button>

                {isNotificationsOpen && (
                  <div
                    className={`absolute lg:right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-2xl z-50 backdrop-blur-lg animate-fadeIn max-w-[90vw] lg:max-w-[20rem] lg:top-[3rem] top-12  right-0  ${
                      isDarkMode
                        ? "bg-gradient-to-b from-indigo-800/90 to-gray-900/90 border border-indigo-700/40"
                        : "bg-gradient-to-b from-white/90 to-indigo-100/90 border border-indigo-200/40"
                    }`}
                  >
                    <div
                      className={`p-3 border-b flex justify-between items-center ${
                        isDarkMode
                          ? "border-indigo-700/50"
                          : "border-indigo-200/50"
                      }`}
                    >
                      <h3
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Notifications
                      </h3>
                      {notificationCount > 0 && (
                        <button
                          onClick={markNotificationsAsRead}
                          className={`text-xs px-2 py-1 rounded ${
                            isDarkMode
                              ? "bg-indigo-700 hover:bg-indigo-600 text-indigo-200"
                              : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                          }`}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="py-1">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() =>
                              viewNotificationDetails(notification)
                            }
                            className={`px-4 py-3 border-b last:border-b-0 cursor-pointer transition-all duration-200 ${
                              isDarkMode
                                ? "border-indigo-700/50 hover:bg-indigo-700/70"
                                : "border-indigo-200/50 hover:bg-indigo-100"
                            } ${
                              !notification.read
                                ? isDarkMode
                                  ? "bg-indigo-700/50"
                                  : "bg-blue-50"
                                : ""
                            }`}
                          >
                            <div className="flex items-start">
                              <div
                                className={`p-2 rounded-full mr-3 ${
                                  isDarkMode ? "bg-indigo-700" : "bg-blue-100"
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
                                    isDarkMode ? "text-white" : "text-gray-800"
                                  } ${!notification.read ? "font-bold" : ""}`}
                                >
                                  {notification.title}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isDarkMode
                                      ? "text-indigo-200"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {notification.message}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isDarkMode
                                      ? "text-indigo-300"
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
                            isDarkMode ? "text-indigo-200" : "text-gray-500"
                          }`}
                        >
                          <p>No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                mobileMenuOpen
                  ? isDarkMode
                    ? "bg-indigo-700/70 text-purple-400 border border-purple-400/40"
                    : "bg-indigo-200/70 text-indigo-900 border border-indigo-400/40"
                  : isDarkMode
                  ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                  : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
              } hover:scale-110`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6 relative z-10 transition-transform duration-300 hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 relative z-10 transition-transform duration-300 hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                  isDarkMode ? "bg-purple-400/10" : "bg-indigo-700/10"
                }`}
              ></div>
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden fixed top-0 left-0 w-64 h-screen z-50 transform transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isDarkMode
              ? "bg-gradient-to-b from-gray-900 to-indigo-900"
              : "bg-gradient-to-b from-indigo-50 to-purple-100"
          } rounded-r-xl shadow-2xl`}
        >
          <div className="relative h-full flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <button
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode
                    ? "text-indigo-300 hover:bg-indigo-800/50"
                    : "text-indigo-700 hover:bg-indigo-200"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent p-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    className="w-10 h-10 mt-3 animate-pulse"
                    src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                    alt="Rex Auction Logo"
                  />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-400">
                  Rex Auction
                </h1>
              </div>

              {user?.email && (
                <div
                  className={`rounded-xl p-3 mb-6 shadow-lg ${
                    isDarkMode
                      ? "bg-indigo-800/60 border border-indigo-700/40"
                      : "bg-white/90 border border-indigo-200/40"
                  } transition-all duration-200 hover:shadow-xl`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-pink-400 p-0.5"
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg" ||
                        "/placeholder.svg"
                      }
                      alt="User profile"
                    />
                    <div>
                      <p
                        className={`font-bold text-sm ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {user?.displayName || "User"}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-indigo-200" : "text-indigo-600"
                        }`}
                      >
                        <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-xs font-semibold mt-1 capitalize">
                          {dbUser?.role || "Guest"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-2 ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  Navigation
                </p>
                {navRoutes.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={getNavLinkClass(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                {user?.email && (
                  <>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider mt-4 mb-2 pl-2 ${
                        isDarkMode ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      User
                    </p>
                    <Link
                      to="/dashboard"
                      className={getNavLinkClass("/dashboard")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MdOutlineDashboard
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className={getNavLinkClass("/dashboard/profile")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUserCircle
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      />
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      to={`/dashboard/walletHistory`}
                      className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg transition-all duration-200 ${
                        isDarkMode
                          ? "bg-indigo-700/50 text-white hover:bg-indigo-600/70"
                          : "bg-indigo-200/50 text-indigo-900 hover:bg-indigo-300/70"
                      }`}
                      onClick={() => {
                        setShowWalletModal(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <FaWallet
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-purple-400" : "text-indigo-700"
                        }`}
                      />
                      <span>${dbUser?.accountBalance}</span>
                      <FaPlus className="text-green-400 text-xs animate-pulse ml-auto" />
                    </Link>
                  </>
                )}
              </div>

              <div
                className={`mt-4 pt-4 border-t ${
                  isDarkMode ? "border-indigo-700/40" : "border-indigo-200/40"
                }`}
              >
                {user?.email ? (
                  <button
                    onClick={() => {
                      handleGoogleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-red-900/50 text-red-300 hover:bg-red-900/70"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <MdOutlineLogout
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-red-300" : "text-red-600"
                      }`}
                    />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-indigo-700/70 text-white hover:bg-indigo-700/90"
                        : "bg-indigo-200 text-indigo-900 hover:bg-indigo-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserCircle
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              <div
                className={`mt-4 text-center text-xs ${
                  isDarkMode ? "text-indigo-300/70" : "text-indigo-600/70"
                }`}
              >
                <p>Rex Auction v1.2.0</p>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </nav>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Add Funds to Wallet</h2>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className={`w-full p-2 mb-4 border rounded ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-300"
              }`}
              placeholder="Enter amount"
            />
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={`w-full p-2 mb-4 border rounded ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-300"
              }`}
              placeholder="Enter account number"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowWalletModal(false)}
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDepositSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 8px 1px rgba(147, 51, 234, 0.3);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #6366f1;
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .touch-p-3 {
          padding: 0.75rem; /* Slightly larger padding for touch devices */
        }
      `}</style>
    </div>
  );
};

export default Navbar;
