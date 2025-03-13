"use client";

import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../firebase/firebase.init";
import { AuthContexts } from "../providers/AuthProvider";
import registerImg from "../assets/register.jpg";

const Register = () => {
  const { createUser } = useContext(AuthContexts);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Password validation criteria
  const passwordCriteria = [
    { test: /[A-Z]/, message: "One uppercase letter" },
    { test: /[a-z]/, message: "One lowercase letter" },
    { test: /.{6,}/, message: "At least 6 characters" },
  ];

  const validatePassword = (password) => {
    const failedCriteria = passwordCriteria.filter(
      (criterion) => !criterion.test.test(password)
    );
    return failedCriteria.length
      ? failedCriteria.map((c) => c.message).join(", ")
      : null;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { name, email, password, photoURL } = formData;
    const validationError = validatePassword(password);

    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUser(email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL:
          photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      });
      toast.success("Registration successful! Redirecting...");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google registration successful!");
      navigate("/");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        <div className="w-1/2 p-8">
          <div className="flex mb-5">
            <NavLink to="/login" className="w-1/2 text-center border p-2">
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="w-1/2 text-center border p-2 bg-orange-500 text-white"
            >
              Register
            </NavLink>
          </div>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 mb-3 border rounded"
              required
            />
            <input
              type="text"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="Profile Picture URL (Optional)"
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-3 border rounded"
              required
            />

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-gray-500"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            {/* Password Validation Messages */}
            <div className="mt-2 space-y-2 text-sm">
              {passwordCriteria.map((criterion, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    criterion.test.test(formData.password)
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {criterion.test.test(formData.password) ? "✔" : "✘"}{" "}
                  {criterion.message}
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full p-2 bg-purple-600 text-white rounded mt-3"
              disabled={loading}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <button
            onClick={handleGoogleRegister}
            className="w-full mt-4 flex items-center justify-center gap-2 p-2 bg-red-600 text-white rounded"
          >
            Sign up with Google
          </button>
        </div>

        <div className="w-1/2 hidden md:block">
          <img src={registerImg} alt="Register" className="h-full w-full" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
