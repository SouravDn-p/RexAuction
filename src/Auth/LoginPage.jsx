import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../firebase/firebase.init";
import Swal from "sweetalert2";
import biddingImg from "../assets/bgimg.jpg";
import google from "../assets/Untitled_design__19_-removebg-preview.png";
import { AuthContexts } from "../providers/AuthProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, signInUser } = useContext(AuthContexts);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const emailToUse = email;
    const passwordToUse = password;

    try {
      const userCredential = await signInUser(emailToUse, passwordToUse);
      setUser(userCredential.user);
      Swal.fire({
        title: "Login successful",
        text: "Welcome back! Login successful",
        icon: "success",
      });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      toast.success("Welcome! Google sign-in successful", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (err) {
      console.error("Google Sign-In error:", err.message);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center lg:p-16 bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white lg:rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        {/* Image Section */}
        <div
          className="w-full lg:h-[460px] h-[200px] md:w-1/2 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-black p-8"
          style={{ backgroundImage: `url(${biddingImg})` }}
        ></div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <div className="flex mb-5 ">
            <NavLink
              to="/login"
              className="w-1/2  px-6 py-2 border border-purple-600 text-purple-600 font-semibold shadow-md hover:bg-purple-600 hover:text-white transition-all text-center"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#6b46c1" : "transparent",
                color: isActive ? "white" : "#6b46c1",
              })}
            >
              LogIn
            </NavLink>
            <NavLink
              to="/register"
              className="w-1/2 px-6 py-2 border border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all text-center"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#f97316" : "transparent",
                color: isActive ? "white" : "#f97316",
              })}
            >
              Register Now
            </NavLink>
          </div>

          <form onSubmit={handleEmailPasswordLogin}>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link to="/forgotPassword" className="text-purple-500 text-sm hover:underline">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>

          {error && (
            <p className="text-red-600 text-sm text-center mt-4">{error}</p>
          )}

          <div className="flex justify-center my-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full  rounded-lg flex items-center justify-center border-2 border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all"
            >
              <img src={google} alt="Google logo" className="w-10 h-10 mr-3" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
