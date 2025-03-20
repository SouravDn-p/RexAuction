import React, { useContext, useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { AuthContexts } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import { MdOutlineLogout } from "react-icons/md";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, setUser, setLoader, setError } = useContext(AuthContexts);
  const {logOut,loading,setLoading,errorMessage,setErrorMessage}=useAuth()
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleGoogleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      setUser(null);
      setErrorMessage(null);
      toast.success("Successfully signed out", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
     
      setErrorMessage(err.message);
      toast.error(err.message);
    } finally {
     setLoading(false);
    }
  };

  const getNavLinkClass = (path) =>
    location.pathname === path
      ? "text-yellow-400 border-b-2 border-yellow-500 "
      : "hover:text-gray-300 hover:border-b-2 border-yellow-500";

  return (
    <div>
      <nav
        className={`fixed top-0 w-full z-50 px-4 py-3.5 transition-all duration-300 shadow-md 
        ${isScrolled ? "bg-purple-600 bg-opacity-70 lg:backdrop-blur-md" : "bg-purple-600"}`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Rex_Auction</span>
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
                <Link to="/profile" className={getNavLinkClass("/profile")}>
                  Profile
                </Link>
                <Link to="/dashboard" className={getNavLinkClass("/dashboard")}>
                  Dashboard
                </Link>
                <button
                  className="text-xl hover:text-gray-300"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />}
                </button>
                {user?.email && (
                  <img
                    src={user?.photoURL}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-gray-400"
                  />
                )}
                <button
                  onClick={handleGoogleSignOut}
                  className="bg-purple-500 text-xs hover:bg-purple-700 p-3 rounded-full text-white relative"
                  onMouseEnter={() => setIsHovered(true)} // Show tooltip on hover
                  onMouseLeave={() => setIsHovered(false)} // Hide tooltip when mouse leaves
                >
                  <MdOutlineLogout className="text-xl" />
                  {isHovered && (
                    <div className="absolute  left-1/2 transform -translate-x-1/2 mt-4 bg-purple-800 text-white text-xs rounded px-2 py-1">
                      Logout
                    </div>
                  )}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded text-white"
              >
                Login
              </Link>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-4">
            <button
              className="text-white text-xl"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              className="text-white text-xl py-1.5 border border-gray-500 rounded-full px-2.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden fixed top-0 left-0 w-60 h-full bg-purple-700/85 text-white shadow-lg transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="text-3xl absolute top-4 right-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            ×
          </button>

          <div className="flex flex-col items-start space-y-4 p-10 py-6 text-lg font-bold">
            <div className="text-lg font-bold">{currentTime}</div>

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
                  to="/profile"
                  className={getNavLinkClass("/profile")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  className={getNavLinkClass("/dashboard")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleGoogleSignOut}
                  className="bg-purple-500 text-xs hover:bg-purple-700 p-3 rounded-full text-white relative"
                  onMouseEnter={() => setIsHovered(true)} 
                  onMouseLeave={() => setIsHovered(false)} 
                >
                  <MdOutlineLogout className="text-xl" />
                  {isHovered && (
                    <div className="absolute  left-1/2 transform -translate-x-1/2 mt-4 bg-purple-800 text-white text-xs rounded px-2 py-1">
                      Logout
                    </div>
                  )}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-lg hover:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
