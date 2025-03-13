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
import google from "../assets/Untitled_design__19_-removebg-preview.png";

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
    <div className="flex justify-center items-center lg:p-16 bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white lg:rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        {/* Left Section */}
        <div
          className="w-full lg:h-[460px] h-[200px] md:w-1/2 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-black p-8"
          style={{
            backgroundImage: `url(${registerImg})`,
          }}
        ></div>

        {/* Right Section - Registration Form */}
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <div className="flex mb-5">
            <NavLink
              to="/login"
              className="w-full md:w-1/2 text-center px-6 py-2 border border-purple-600 text-purple-600 font-semibold shadow-md hover:bg-purple-600 hover:text-white transition-all"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#6b46c1" : "transparent",
                color: isActive ? "white" : "#6b46c1",
              })}
            >
              LogIn
            </NavLink>

            <NavLink
              to="/register"
              className="w-full md:w-1/2 text-center px-6 py-2 border border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#f97316" : "transparent",
                color: isActive ? "white" : "#f97316",
              })}
            >
              Register Now
            </NavLink>
          </div>

          <form onSubmit={handleRegister}>
            <div className="flex gap-2 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 mt-1 border rounded-lg border-gray-300 h-[50px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Photo
                </label>
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="Enter Profile Picture URL (Optional)"
                  className="w-full p-3 mt-1 border rounded-lg border-gray-300 h-[50px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="w-full  sm:w-1/2">
                <label className="block  text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Password Validation Messages */}
            {formData.password && (
              <div className="mt-2 mb-2 flex gap-2 text-xs">
                {passwordCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className={`flex text-xs items-center gap-2 ${
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
            )}

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 mt-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <button
            onClick={handleGoogleRegister}
            className="w-full mt-3 rounded-lg flex items-center justify-center border-2 border-orange-500 text-orange-500 font-semibold shadow-md hover:bg-orange-500 hover:text-white transition-all"
          >
            <img src={google} alt="Google logo" className="w-10 h-10 mr-3" />
            Continue with Google
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
