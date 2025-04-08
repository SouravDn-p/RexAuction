import { useContext, useEffect, useState, useRef } from "react";
import { FaSun, FaMoon, FaWallet, FaPlus, FaUserCircle } from "react-icons/fa";
import {
  MdHistory,
  MdManageAccounts,
  MdOutlineDashboard,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { AuthContexts } from "../../providers/AuthProvider";
import ThemeContext from "../../component/Context/ThemeContext";
import auth from "../../firebase/firebase.init";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { MdOutlineLogout } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";

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

  const getNavLinkClass = (path) =>
    location.pathname === path
      ? "text-yellow-400 border-b-2 border-yellow-500 font-bold"
      : "hover:text-yellow-300 hover:border-b-2 border-yellow-500 transition-all duration-300";

  return (
    <div>
      <nav
        className={`fixed top-0 w-full z-50 px-4 transition-all duration-300 shadow-lg ${
          isScrolled
            ? isDarkMode
              ? "bg-gray-900 bg-opacity-95 backdrop-blur-md"
              : "bg-gradient-to-r from-purple-700 to-purple-500 bg-opacity-95 backdrop-blur-md"
            : isDarkMode
            ? "bg-gray-800"
            : "bg-gradient-to-r from-purple-800 to-purple-600"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-0">
          <Link to="/">
            <div className="flex items-center">
              <img
                className="text-xl font-bold text-white w-[60px] lg:w-[70px] mt-4 animate-pulse"
                src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                alt=""
              />
              <h1 className="font-bold text-xl lg:text-2xl">
                <span className="text-yellow-400 font-serif tracking-wide">
                  Rex
                </span>
                <span className="text-white"> Auction</span>
              </h1>
            </div>
          </Link>

          <div className="text-lg font-bold hidden md:block text-white">
            {currentTime}
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-lg font-bold text-white">
            <Link to="/" className={getNavLinkClass("/")}>
              Home
            </Link>
            <Link to="/aboutUs" className={getNavLinkClass("/aboutUs")}>
              About Us
            </Link>

            {user?.email ? (
              <>
                <Link to="/auction" className={getNavLinkClass("/dashboard")}>
                  Auction
                </Link>

                {/* Wallet Button */}
                <div className="relative">
                  <button
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-purple-800 hover:bg-purple-700"
                    } transition-all duration-300`}
                    onClick={() => setShowWalletModal(true)}
                  >
                    <FaWallet className="text-yellow-400" />
                    <span className="font-medium">
                      $ {dbUser?.accountBalance}
                    </span>
                    <FaPlus className="text-green-400 text-sm" />
                  </button>
                </div>

                <button
                  className="text-xl hover:text-yellow-400 transition-colors duration-200"
                  onClick={toggleTheme}
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <FaSun className="text-yellow-400" />
                  ) : (
                    <FaMoon />
                  )}
                </button>

                {/* Profile with dropdown */}
                <div className="relative" ref={profileRef}>
                  <img
                    src={user?.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-yellow-400 cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  />

                  {showProfileMenu && (
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 
                      ${isDarkMode ? "bg-gray-800" : "bg-white"} 
                      ring-1 ring-black ring-opacity-5 z-50`}
                    >
                      <div
                        className={`px-4 py-2 text-sm ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        } border-b`}
                      >
                        <p className="font-medium">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-xs truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/dashboard/profile"
                        className={`block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FaUserCircle />
                          Your Profile
                        </div>
                      </Link>
                      <Link
                        to="/dashboard"
                        className={`block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MdOutlineDashboard />
                          Dashboard
                        </div>
                      </Link>
                      <Link
                        to="/dashboard/walletHistory"
                        className={`block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BiMoney />
                          Wallet History
                        </div>
                      </Link>

                      <button
                        onClick={handleGoogleSignOut}
                        className={`w-full text-left block px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-600 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MdOutlineLogout />
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`${
                  isDarkMode
                    ? "bg-purple-700 hover:bg-purple-600"
                    : "bg-purple-500 hover:bg-purple-600"
                } px-4 py-2 rounded-full text-white transition-all duration-200 hover:shadow-lg hover:scale-105`}
              >
                Login
              </Link>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-4">
            {user?.email && (
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  isDarkMode ? "bg-gray-700" : "bg-purple-800"
                } text-sm`}
                onClick={() => setShowWalletModal(true)}
              >
                <FaWallet className="text-yellow-400" />
                <span>${walletBalance}</span>
                <FaPlus className="text-green-400 text-xs" />
              </button>
            )}

            <button
              className="text-white text-xl"
              onClick={toggleTheme}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <button
              className={`text-white text-xl py-1.5 border border-yellow-400 rounded-full px-2.5 ${
                mobileMenuOpen ? "bg-purple-800" : ""
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-64 h-full ${
            isDarkMode
              ? "bg-gray-800/95"
              : "bg-gradient-to-b from-purple-700 to-purple-600 bg-opacity-95"
          } text-white shadow-lg transform transition-transform duration-300 z-50 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="text-3xl absolute top-4 right-4 text-yellow-400"
            onClick={() => setMobileMenuOpen(false)}
          >
            ×
          </button>

          <div className="flex flex-col items-start space-y-4 p-10 py-6 text-lg font-bold">
            <div className="text-lg font-bold text-yellow-400">
              {currentTime}
            </div>

            {user?.email && (
              <div className="flex items-center gap-2 mb-4 border-b border-yellow-400 pb-4 w-full">
                <img
                  src={user?.photoURL || "/placeholder.svg"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-yellow-400"
                />
                <div className="text-sm">
                  <p className="font-medium">{user?.displayName || "User"}</p>
                  <p className="text-xs truncate text-gray-300">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            <Link
              to="/"
              className={getNavLinkClass("/")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/aboutUs"
              className={getNavLinkClass("/aboutUs")}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>

            {user?.email ? (
              <>
                <Link
                  to="/dashboard"
                  className={getNavLinkClass("/dashboard")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-yellow-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/dashboard/walletHistory"
                  className="hover:text-yellow-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wallet History
                </Link>
                <button
                  onClick={handleGoogleSignOut}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full mt-4 ${
                    isDarkMode
                      ? "bg-red-900 hover:bg-red-800"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white transition-colors duration-200`}
                >
                  <MdOutlineLogout className="text-xl" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`${
                  isDarkMode
                    ? "bg-purple-700 hover:bg-purple-600"
                    : "bg-purple-500 hover:bg-purple-600"
                } px-4 py-2 rounded-full text-white transition-colors duration-200 mt-4`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Wallet Deposit Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`relative w-full max-w-md mx-4 rounded-lg shadow-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } overflow-hidden`}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <img
                  src="https://i.ibb.co/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                  alt="bKash"
                  className="h-10"
                />
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Add Money to Wallet
                </h3>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-2xl text-white border hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div
              className={`px-6 pt-6 pb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <p className="text-sm">Current Balance</p>
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {dbUser?.accountBalance?.toLocaleString() || 0} BDT
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Amount (Min 300.00 BDT / Max 20,000.00 BDT):
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  min="300"
                  max="20000"
                />
              </div>

              <div className="mb-6">
                <p
                  className={`mb-2 text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Please enter or select your deposit amount
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000, 5000, 10000, 20000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount)}
                      className={`py-2 border rounded-md ${
                        depositAmount === amount
                          ? isDarkMode
                            ? "bg-purple-700 border-purple-600 text-white"
                            : "bg-purple-100 border-purple-300 text-purple-800"
                          : isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Account number:
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              <button
                onClick={handleDepositSubmit}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
