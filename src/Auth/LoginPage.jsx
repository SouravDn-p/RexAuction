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
  const { user, setUser, signInUser } = useContext(AuthContexts);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInUser(email, password);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        <div className="w-1/2 p-8">
          <div className="flex mb-5">
            <NavLink to="/login" className="btn btn-primary">
              LogIn
            </NavLink>
            <NavLink to="/register" className="btn btn-secondary">
              Register Now
            </NavLink>
          </div>

          <form onSubmit={handleEmailPasswordLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
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
              className="btn btn-primary flex items-center gap-2"
            >
              <img src={google} alt="Google" className="w-5 h-5 " /> Sign in
              with Google
            </button>
          </div>
        </div>
        <div className="w-1/2 hidden md:block">
          <img
            src={biddingImg}
            alt="Bidding"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
