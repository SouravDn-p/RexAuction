import React, { useContext, useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { AuthContexts } from "../../providers/AuthProvider";
import auth from "../../firebase/firebase.init";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const { user, setUser, setLoader, setError } = useContext(AuthContexts);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dummy user data

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignOut = async () => {
    setLoader(true);
    try {
      await signOut(auth);
      setUser(null);
      setError(null);
      toast.success("Successfully signed out", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Sign-Out error:", err.message);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoader(false);
    }
  };

  // Function to check if route is active
  const getNavLinkClass = (path) =>
    location.pathname === path ? "text-yellow-400" : "hover:text-gray-300";

  return (
    <div>
      <nav className="bg-blue-900 text-white px-4 py-3.5 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <div className="flex items-center">
              <span className="text-xl font-bold">Rex_Auction</span>
            </div>
          </Link>

          <div className="text-lg font-bold hidden md:block">{currentTime}</div>

          <div className="hidden lg:flex items-center space-x-6 text-lg font-bold">
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
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
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
          className={`lg:hidden fixed top-0 left-0 w-60 h-full bg-blue-900 text-white shadow-lg transform transition-transform duration-300 ${
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
                  className="w-full text-left hover:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Logout
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
