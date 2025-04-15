"use client";

import { useState, useEffect } from "react";
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import auth from "../firebase/firebase.init";
import Swal from "sweetalert2";
import logo from "../assets/Logos/login.jpg";
import { FaEnvelope } from "react-icons/fa";

const ForgotPasswordModal = ({ showModal, setShowModal }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetCode, setResetCode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmail(user.email);
    });
    return () => unsubscribe();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        title: "Email Sent!",
        html: `
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p class="mt-4 text-lg font-medium">
              Password reset link sent to ${email}
            </p>
            <p class="mt-2 text-sm opacity-70">
              Please check your inbox and follow the instructions
            </p>
          </div>
        `,
        showConfirmButton: false,
        timer: 3000,
      });
      setShowModal(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#f43f5e",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Passwords Don't Match",
        text: "Please make sure both passwords are identical",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setIsLoading(true);
    try {
      // await confirmPasswordReset(auth, resetCode, newPassword);
      Swal.fire({
        title: "Password Updated!",
        html: `
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p class="mt-4 text-lg font-medium">
              Your password has been updated successfully
            </p>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
      });
      setShowModal(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#f43f5e",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal backdrop */}
      <div className="modal modal-open">
        <div className="modal-box relative max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl text-white">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-48">
              <img
                src={logo}
                alt="rexAuction Logo"
                className="h-16 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowModal(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>

          {/* Header */}
          <h3 className="font-bold text-2xl text-center">
            {resetCode ? "Reset Your Password" : "Forgot Password"}
          </h3>
          <p className="text-center text-sm mt-2 opacity-70">
            {resetCode
              ? "Enter your new password below"
              : "Enter your email to receive a reset link"}
          </p>

          {/* Form */}
          <div className="mt-6">
            {resetCode ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="input input-bordered w-full pr-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="input input-bordered w-full pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full ${
                      isLoading ? "loading" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4"> 
                <div className="relative">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-4 w-4 text-blue-950" />
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

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full ${
                      isLoading ? "loading" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="modal-action justify-center mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
