import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import biddingImg from "../assets/Logos/login.jpg";
import SocialLogin from "../component/SocialLogin";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  toggleLoading,
  setErrorMessage,
} from "../redux/features/user/userSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../firebase/firebase.init";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import AOS from "aos";
import "aos/dist/aos.css";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { FaLock, FaEnvelope } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname.includes("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, errorMessage } = useSelector((state) => state.userSlice);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // particles effect,
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    dispatch(toggleLoading(true));
    dispatch(setErrorMessage(null));

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch(
        setUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: "buyer",
          AuctionsWon: 0,
          ActiveBids: 0,
          TotalSpent: 0,
          AccountBalance: 0,
          BiddingHistory: 0,
          onGoingBid: 0,
          location: "",
          memberSince: new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        })
      );

      navigate("/");
      toast.success("Login successful");
    } catch (err) {
      console.error("Login error:", err.message);
      if (err.message.includes("auth/invalid-credential")) {
        dispatch(setErrorMessage("Password is incorrect"));
        toast.error("Password is incorrect");
      } else {
        dispatch(
          setErrorMessage("Login failed. Please check your credentials.")
        );
        toast.error("Login failed");
      }
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center p-12 sm:p-8 md:p-12 bg-gradient-to-r from-purple-100 via-orange-100 to-pink-100 min-h-screen">
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        showModal={showForgotPassword}
        setShowModal={setShowForgotPassword}
      />

      <div className="relative flex flex-col md:flex-row bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <div
          className="relative z-10 w-full md:w-1/2 min-h-[200px] sm:min-h-[300px] md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${biddingImg})` }}
        ></div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gradient-to-b from-violet-50 to-violet-100">
          <div className="flex mb-4 gap-2">
            <NavLink
              to="/login"
              className={`w-1/2 py-2 font-semibold text-center rounded-md transition-all border 
              ${
                isLogin
                  ? "bg-gradient-to-r from-purple-500 to-orange-500 text-white border-none"
                  : "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
              }`}
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="w-1/2 py-2 border border-orange-500 text-orange-500 font-semibold text-center rounded-md hover:bg-orange-500 hover:text-white transition-all"
            >
              Register
            </NavLink>
          </div>

          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            {/* particles */}
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={{
                fullScreen: { enable: false },
                background: { color: { value: "transparent" } },
                particles: {
                  style: {
                    "mix-blend-mode": "luminosity",
                  },
                  color: { value: "#2d2d2d" },
                  links: {
                    enable: true,
                    color: "#6b21a8",
                    distance: 100,
                  },
                  move: { enable: true, speed: 1 },
                  number: { value: 50 },
                  size: { value: 2 },
                  opacity: {
                    value: 0.5,
                  },
                },
              }}
              className="absolute inset-0 z-0 pointer-events-none"
            />

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="bg-white text-black w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="bg-white text-black w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {errorMessage && (
            <p className="text-red-600 text-sm text-center mt-3">
              {errorMessage}
            </p>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-b from-violet-50 to-violet-100 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
