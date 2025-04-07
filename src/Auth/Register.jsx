import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../redux/features/user/userSlice";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../redux/features/api/userApi";
import logo from "../assets/Logos/register.jpg";
import SocialLogin from "../component/SocialLogin";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname.includes("register");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });

  const { isLoading, isError, error } = useSelector((state) => state.userSlice);
  const [newUser] = useAddUserMutation();

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
  const validationError = validatePassword(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check password validation before proceeding
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photoURL:
          formData.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
      };

      // Dispatch Redux Thunk to Register User
      const result = await dispatch(createUser(userData)).unwrap();

      // If successful, add user to database
      await newUser({
        uid: result.uid,
        name: result.name,
        email: result.email,
        photo: result.photoURL,
        role: "buyer",
        AuctionsWon: 0,
        ActiveBids: 0,
        TotalSpent: 0,
        accountBalance: 0,
        BiddingHistory: [],
        onGoingBid: 0,
        Location: "",
        memberSince: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        recentActivity: [],
        watchingNow: [],
      });

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center p-12 sm:p-8 md:p-12 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row bg-white lg:rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        <div
          className="w-full lg:h-[460px] h-[200px] md:w-1/2 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${logo})` }}
        ></div>

        <div className="w-full md:w-1/2 p-4 md:p-8 bg-gray-100">
          <div className="flex mb-4 gap-2">
            <NavLink
              to="/login"
              className="w-1/2 py-2 border border-purple-600 text-purple-600 font-semibold text-center rounded-md hover:bg-purple-600 hover:text-white transition-all"
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className={`w-1/2 py-2 border border-orange-500 text-orange-500 font-semibold text-center rounded-md hover:bg-orange-500 hover:text-white transition-all ${
                isRegister ? "bg-orange-500 text-white" : ""
              }`}
            >
              Register
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
                  className="w-full p-3 mt-1 border rounded-lg border-gray-300 h-[50px] focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-black"
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
                  className="w-full p-3 mt-1 border rounded-lg border-gray-300 h-[50px] focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-black"
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
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-black"
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-black font-bold"
                  required
                />
              </div>
            </div>

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

            {isError && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 mt-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          <SocialLogin />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
