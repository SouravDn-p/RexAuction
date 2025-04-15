import { useContext, useEffect, useState, useRef } from "react";
import { FaSun, FaMoon, FaWallet, FaPlus, FaUserCircle } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineLogout } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { AuthContexts } from "../../providers/AuthProvider";
import ThemeContext from "../../component/Context/ThemeContext";
import auth from "../../firebase/firebase.init";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { BiMoney } from "react-icons/bi";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { ImHammer2 } from "react-icons/im";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(300);
  const [accountNumber, setAccountNumber] = useState("");
  const profileRef = useRef(null);
  const axiosPublic = useAxiosPublic();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply dark mode class to document when isDarkMode changes
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
    console.log(dbUser._id);

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

  // Sidebar-style navigation link class
  const getNavLinkClass = (path) =>
    location.pathname === path
      ? isDarkMode
        ? "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 bg-indigo-700/60 text-white font-bold shadow-md"
        : "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 bg-indigo-200 text-indigo-900 font-bold shadow-md"
      : isDarkMode
      ? "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-indigo-800/40 text-indigo-100"
      : "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 hover:bg-indigo-100 text-indigo-800";

  return (
    <div>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? "bg-gradient-to-r from-gray-900 to-purple-900 shadow-lg"
              : "bg-gradient-to-r from-purple-900 to-purple-500 shadow-lg"
            : isDarkMode
            ? "bg-gradient-to-r from-gray-900 to-purple-900"
            : "bg-gradient-to-r  from-purple-900 to-purple-500"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 ">
          {/* Logo Section with enhanced hover effect */}
          <Link to="/" className=" relative">
            <div className="flex items-center space-x-2">
              <div className="relative overflow-hidden rounded-full">
                <img
                  className="w-14 mt-3 lg:w-16  group-hover:rotate-6"
                  src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                  alt="Rex Auction Logo"
                />
              </div>
              <h1 className="font-bold text-sm sm:text-lg md:text-xl lg:text-2xl tracking-tight relative">
                <span
                  className={`${
                    isDarkMode
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-700"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-600 to-purple-400"
                  } font-serif `}
                >
                  Rex
                </span>
                <span className="text-white transition-all duration-500 group-hover:tracking-wider">
                  {" "}
                  Auction
                </span>
              </h1>
            </div>
            {/* Enhanced underline animation */}
            <div className="h-0.5 w-0 bg-gradient-to-r from-purple-500 to-purple-700 group-hover:w-full transition-all duration-500 absolute -bottom-1 left-0 shadow-glow"></div>
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 via-purple-600/0 to-purple-700/0 group-hover:from-purple-500/10 group-hover:via-purple-600/10 group-hover:to-purple-700/10 rounded-lg blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          </Link>

          {/* Time Display with pulse animation */}
          <div
            className={`text-sm font-semibold hidden md:flex items-center px-4 py-1.5 rounded-full backdrop-blur-sm relative overflow-hidden transition-all duration-500 ${
              isDarkMode
                ? "bg-indigo-800/20 text-indigo-200 hover:bg-indigo-800/30"
                : "bg-purple-800 text-indigo-600 hover:bg-indigo-100/70"
            } hover:shadow-md hover:scale-105`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 relative z-10">
              {currentTime}
            </span>
            {/* Subtle background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-white-400/0 hover:from-pink-500/10 hover:to-yellow-400/10 transition-all duration-700"></div>
          </div>

          {/* Desktop Navigation with enhanced hover effects */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Navigation Links with enhanced hover effects */}
            {[
              { path: "/", label: "Home" },
              { path: "/aboutUs", label: "About Us" },
              ...(user?.email ? [{ path: "/auction", label: "Auction" }] : []),
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 px-3 rounded-lg transition-all duration-300 group overflow-hidden ${
                  location.pathname === item.path
                    ? "text-white border-b-2 border-purple-400" // Always white text and border for active routes
                    : isDarkMode
                    ? "text-indigo-200 hover:text-white"
                    : "text-gray-100 hover:text-gray-300"
                }`}
              >
                {/* Text with hover effect */}
                <span className="relative z-10 transition-transform duration-300 group-hover:transform group-hover:translate-y-[-2px]">
                  {item.label}
                </span>

                {/* Hover indicator with animation */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-300 w-0 group-hover:w-full transition-all duration-300 ${
                    location.pathname === item.path ? "opacity-0" : ""
                  }`}
                ></span>

                {/* Background glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-yellow-400/0 group-hover:from-pink-500/5 group-hover:to-yellow-400/5 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
              </Link>
            ))}

            {user?.email ? (
              <>
                {/* Wallet Button with enhanced hover effect */}
                <button
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-indigo-700/50 text-white hover:bg-indigo-600/70"
                      : "bg-indigo-200/50 text-indigo-900 hover:bg-indigo-300/70"
                  } hover:shadow-md hover:scale-105`}
                  onClick={() => setShowWalletModal(true)}
                >
                  <FaWallet
                    className={`${
                      isDarkMode ? "text-yellow-400" : "text-indigo-700"
                    } transition-transform duration-300 group-hover:scale-110`}
                  />
                  <span
                    className={`${
                      isDarkMode ? "text-indigo-100" : "text-indigo-800"
                    } relative z-10`}
                  >
                    $ {dbUser?.accountBalance}
                  </span>
                  <FaPlus className="text-green-400 text-xs animate-pulse" />

                  {/* Background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-400/0 hover:from-indigo-600/20 hover:to-indigo-400/20 transition-all duration-300 opacity-0 hover:opacity-100"></div>
                </button>

                {/* Theme Toggle with enhanced hover effect */}
                <button
                  className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-indigo-800/30 text-yellow-400 hover:bg-indigo-700/50"
                      : "bg-indigo-100/30 text-indigo-700 hover:bg-indigo-200/50"
                  } hover:scale-110`}
                  onClick={toggleTheme}
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <FaSun className="text-yellow-400 relative z-10 transition-transform duration-300 hover:rotate-12" />
                  ) : (
                    <FaMoon className="text-indigo-700 relative z-10 transition-transform duration-300 hover:rotate-12" />
                  )}

                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                      isDarkMode ? "bg-yellow-400/10" : "bg-indigo-700/10"
                    }`}
                  ></div>
                </button>

                {/* Profile with Dropdown - enhanced hover effect */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center p-1 rounded-full transition-all duration-300 hover:scale-110 relative"
                  >
                    <img
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg"
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-pink-400 transition-all duration-300 hover:border-yellow-400"
                    />

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/0 to-yellow-400/0 hover:from-pink-500/20 hover:to-yellow-400/20 transition-all duration-300 opacity-0 hover:opacity-100 blur-sm"></div>
                  </button>

                  {showProfileMenu && (
                    <div
                      className={`absolute right-0 mt-2 w-60 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-lg animate-fadeIn ${
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

                      {/* Enhanced dropdown menu items */}
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
                          className={`flex items-center gap-3 py-2.5 px-4 transition-all duration-200 relative overflow-hidden ${
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

                          {/* Hover background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-pink-500/5 hover:to-yellow-400/5 transition-all duration-300 opacity-0 hover:opacity-100"></div>
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
                          className={`w-full flex items-center gap-3 py-2.5 px-4 transition-all duration-200 relative overflow-hidden ${
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

                          {/* Hover background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-red-500/10 hover:to-red-400/5 transition-all duration-300 opacity-0 hover:opacity-100"></div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`relative py-2 px-4 rounded-lg transition-all duration-300 group overflow-hidden ${
                  location.pathname === "/login"
                    ? "text-white border-b-2 border-purple-500" // Always white text and border for active routes
                    : isDarkMode
                    ? "text-indigo-200 hover:text-white"
                    : "text-gray-100 hover:text-indigo-900"
                }`}
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:transform group-hover:translate-y-[-2px]">
                  Login
                </span>

                {/* Hover indicator with animation */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-700 w-0 group-hover:w-full transition-all duration-300 ${
                    location.pathname === "/login" ? "opacity-0" : ""
                  }`}
                ></span>

                {/* Background glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-yellow-400/0 group-hover:from-pink-500/10 group-hover:to-yellow-400/10 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
              </Link>
            )}
          </div>

          {/* Mobile Navigation with enhanced hover effects */}
          <div className="lg:hidden flex items-center space-x-3">
            {user?.email && (
              <button
                className={`flex items-center gap-1 py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg text-sm transition-all duration-300 relative overflow-hidden ${
                  isDarkMode
                    ? "bg-indigo-700/50 text-white hover:bg-indigo-600/70"
                    : "bg-indigo-200/50 text-indigo-900 hover:bg-indigo-300/70"
                } hover:scale-105`}
                onClick={() => setShowWalletModal(true)}
              >
                <FaWallet
                  className={`${
                    isDarkMode ? "text-yellow-400" : "text-indigo-700"
                  } text-xs sm:text-sm`}
                />
                <span className="relative z-10 text-xs sm:text-sm whitespace-nowrap">
                  ${dbUser?.accountBalance}
                </span>
                <FaPlus className="text-green-400 text-xs animate-pulse" />

                {/* Background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-400/0 hover:from-indigo-600/20 hover:to-indigo-400/20 transition-all duration-300 opacity-0 hover:opacity-100"></div>
              </button>
            )}

            {/* Theme Toggle with enhanced hover effect */}
            <button
              className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                isDarkMode
                  ? "bg-indigo-800/30 text-yellow-400 hover:bg-indigo-700/50"
                  : "bg-indigo-100/30 text-indigo-700 hover:bg-indigo-200/50"
              } hover:scale-110`}
              onClick={toggleTheme}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400 relative z-10 transition-transform duration-300 hover:rotate-12" />
              ) : (
                <FaMoon className="text-indigo-700 relative z-10 transition-transform duration-300 hover:rotate-12" />
              )}

              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                  isDarkMode ? "bg-yellow-400/10" : "bg-indigo-700/10"
                }`}
              ></div>
            </button>

            {/* Mobile menu button with enhanced hover effect */}
            <button
              className={`p-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                mobileMenuOpen
                  ? isDarkMode
                    ? "bg-indigo-700/50 text-yellow-400 border border-yellow-400/40"
                    : "bg-indigo-200/50 text-indigo-900 border border-indigo-400/40"
                  : isDarkMode
                  ? "bg-indigo-800/30 text-yellow-400 hover:bg-indigo-700/50"
                  : "bg-indigo-100/30 text-indigo-700 hover:bg-indigo-200/50"
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

              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 ${
                  isDarkMode ? "bg-yellow-400/10" : "bg-indigo-700/10"
                }`}
              ></div>
            </button>
          </div>

          {/* Add custom styles for the shadow glow effect */}
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
          `}</style>
        </div>

        {/* Mobile Menu - Scrollable Sidebar Style */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-72 h-full z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isDarkMode
              ? "bg-gradient-to-b from-gray-900 to-indigo-900 text-white"
              : "bg-gradient-to-b from-indigo-50 to-purple-100 text-gray-800"
          } shadow-2xl backdrop-blur-sm`}
        >
          <div className="relative h-full flex flex-col">
            {/* Fixed Close Button */}
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent p-6">
              {/* Logo and Title with Animation */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`w-12 mt-2 h-12 ${
                    isDarkMode ? "" : ""
                  } flex items-center justify-center `}
                >
                  <img
                    className="w-10 h-10 mt-2 animate-pulse"
                    src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                    alt="Rex Auction Logo"
                  />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-400">
                  Rex Auction
                </h1>
              </div>

              {/* User Profile Card */}
              {user?.email && (
                <div
                  className={`rounded-xl p-4 mb-8 backdrop-blur-sm shadow-lg ${
                    isDarkMode
                      ? "bg-indigo-800/60 border border-indigo-700/40"
                      : "bg-white/90 border border-indigo-200/40"
                  } transition-all duration-200 hover:shadow-xl`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-full border-2 border-pink-400 p-0.5"
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/Y75m1Mk9/Final-Boss.jpg"
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

              {/* Navigation Links */}
              <div className="space-y-2">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-3 pl-3 ${
                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  Navigation
                </p>
                <Link
                  to="/"
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/"
                      ? isDarkMode
                        ? "bg-indigo-700/70 text-white font-semibold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-semibold shadow-md"
                      : isDarkMode
                      ? "text-indigo-100 hover:bg-indigo-800/50"
                      : "text-indigo-800 hover:bg-indigo-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1-1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Home</span>
                </Link>
                <Link
                  to="/aboutUs"
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/aboutUs"
                      ? isDarkMode
                        ? "bg-indigo-700/70 text-white font-semibold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-semibold shadow-md"
                      : isDarkMode
                      ? "text-indigo-100 hover:bg-indigo-800/50"
                      : "text-indigo-800 hover:bg-indigo-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>About Us</span>
                </Link>
                <Link
                  to="/auction"
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                    location.pathname === "/auction"
                      ? isDarkMode
                        ? "bg-indigo-700/70 text-white font-semibold shadow-md"
                        : "bg-indigo-200 text-indigo-900 font-semibold shadow-md"
                      : isDarkMode
                      ? "text-indigo-100 hover:bg-indigo-800/50"
                      : "text-indigo-800 hover:bg-indigo-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span>Auction</span>
                </Link>

                {user?.email && (
                  <>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider mt-6 mb-3 pl-3 ${
                        isDarkMode ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      User
                    </p>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                        location.pathname === "/dashboard"
                          ? isDarkMode
                            ? "bg-indigo-700/70 text-white font-semibold shadow-md"
                            : "bg-indigo-200 text-indigo-900 font-semibold shadow-md"
                          : isDarkMode
                          ? "text-indigo-100 hover:bg-indigo-800/50"
                          : "text-indigo-800 hover:bg-indigo-100"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MdOutlineDashboard
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                        location.pathname === "/dashboard/profile"
                          ? isDarkMode
                            ? "bg-indigo-700/70 text-white font-semibold shadow-md"
                            : "bg-indigo-200 text-indigo-900 font-semibold shadow-md"
                          : isDarkMode
                          ? "text-indigo-100 hover:bg-indigo-800/50"
                          : "text-indigo-800 hover:bg-indigo-100"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUserCircle
                        className={`w-5 h-5 ${
                          isDarkMode ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      />
                      <span>Your Profile</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Bottom Section */}
              <div
                className={`mt-6 pt-6 border-t ${
                  isDarkMode ? "border-indigo-700/40" : "border-indigo-200/40"
                }`}
              >
                {user?.email ? (
                  <button
                    onClick={() => {
                      handleGoogleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-red-900/50 text-red-300 hover:bg-red-900/70"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <MdOutlineLogout
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-red-300" : "text-red-600"
                      }`}
                    />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={`w-full flex items-center justify-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-indigo-700/70 text-white hover:bg-indigo-700/90"
                        : "bg-indigo-200 text-indigo-900 hover:bg-indigo-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Version Info */}
              <div
                className={`mt-6 text-center text-xs ${
                  isDarkMode ? "text-indigo-300/70" : "text-indigo-600/70"
                }`}
              >
                <p>Rex Auction v1.2.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop for Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
