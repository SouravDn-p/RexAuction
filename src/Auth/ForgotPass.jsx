import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import auth from "../firebase/firebase.init"; 
import biddingImg from "../assets/forgotpass.jpg";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetCode, setResetCode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmail(user.email);
    });

    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("oobCode");
    if (code) setResetCode(code);
  }, [location]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        title: "Success!",
        text: "A password reset link has been sent to your email. Please check your inbox.",
        icon: "success",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }

    setIsLoading(true);
    try {
      // await confirmPasswordReset(auth, resetCode, newPassword);
      Swal.fire({
        title: "Success!",
        text: "Password updated successfully. Redirecting to login...",
        icon: "success",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center lg:p-16 bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white lg:rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        <div
          className="w-full lg:h-[460px] h-[200px] md:w-1/2 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-black p-8"
          style={{ backgroundImage: `url(${biddingImg})` }}
        ></div>

<div className="w-full md:w-1/2 p-4 md:p-8">
  {resetCode ? (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Reset Password
      </h2>
      <form onSubmit={handlePasswordUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  ) : (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Forgot Password
      </h2>
      <p className="text-sm text-center text-gray-600 mb-4">
        Please enter your email address, and we will send you a link to reset your password.
      </p>
      <form onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-3 mt-1 border text-purple-600  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </>
  )}

  <div className="text-center mt-4">
    <Link to="/login" className="text-purple-500 hover:underline">
      Back to Login
    </Link>
  </div>
</div>

      </div>
    </div>
  );
};

export default ForgotPass;
