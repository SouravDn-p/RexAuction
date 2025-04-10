import React, { useState } from "react";
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

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname.includes("login");

  const dispatch = useDispatch();
  const { loading, errorMessage } = useSelector((state) => state.userSlice);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <div
          className="w-full md:w-1/2 min-h-[200px] sm:min-h-[300px] md:h-auto bg-cover bg-center"
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
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="bg-white text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="bg-white text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link
                to="/forgotPassword"
                className="text-purple-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>

          {errorMessage && (
            <p className="text-red-600 text-sm text-center mt-3">
              {errorMessage}
            </p>
          )}

          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
