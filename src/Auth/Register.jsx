import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../redux/features/user/userSlice";
import { useAddUserMutation } from "../redux/features/api/userApi";
import logo from "../assets/Logos/register.jpg";
import SocialLogin from "../component/SocialLogin";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import AOS from "aos";
import "aos/dist/aos.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname.includes("register");

  // particles effect
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [newUser] = useAddUserMutation();
  const { isLoading, isError, error } = useSelector((state) => state.userSlice);

  const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const imageHostingApi = `https://api.imgbb.com/1/upload?key=${apiKey}`;

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

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validatePassword(formData.password);
    if (validationError) return toast.error(validationError);
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    let photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`;

    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append("image", imageFile);
      try {
        const res = await fetch(imageHostingApi, {
          method: "POST",
          body: formDataImage,
        });
        const data = await res.json();
        if (data.success) {
          photoURL = data.data.display_url;
        } else {
          toast.warning("Failed to upload image, using default avatar.");
        }
      } catch (err) {
        toast.warning("Image upload error, using default avatar.");
      }
    }

    try {
      const userData = {
        ...formData,
        photoURL,
      };

      const result = await dispatch(createUser(userData)).unwrap();

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
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const passwordError =
    formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-12 bg-gradient-to-br from-purple-100 via-orange-100 to-pink-100">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left image section */}
        <div
          className="h-60 md:h-auto bg-cover bg-center relative z-20"
          style={{ backgroundImage: `url(${logo})` }}
        ></div>

        {/* Right form section */}
        <div className="p-6 md:p-10 bg-gradient-to-r from-purple-100 via-orange-100 to-pink-100">
          <div className="flex mb-6 gap-2">
            <NavLink
              to="/login"
              className="w-1/2 py-2 border border-purple-600 text-purple-600 font-semibold text-center rounded-lg hover:bg-purple-600 hover:text-white transition"
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className={`w-1/2 py-2 border border-orange-500 text-orange-500 font-semibold text-center rounded-lg hover:bg-orange-500 hover:text-white transition ${
                isRegister ? "bg-orange-500 text-white" : ""
              }`}
            >
              Register
            </NavLink>
          </div>

          <form onSubmit={handleRegister}>
            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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

              <div>
                <label className="text-sm font-medium text-black">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black font-semibold focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black font-semibold focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-black">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black font-semibold focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-black font-semibold focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                    passwordError ? "border-red-400" : "border-gray-300"
                  } bg-white text-black font-semibold focus:ring-2 focus:ring-purple-400 outline-none`}
                  required
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mb-3">
                Passwords do not match
              </p>
            )}

            {formData.password && (
              <div className="text-xs mb-3">
                {passwordCriteria.map((c, i) => (
                  <p
                    key={i}
                    className={`flex items-center gap-2 ${
                      c.test.test(formData.password)
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {c.test.test(formData.password) ? "✔" : "✘"} {c.message}
                  </p>
                ))}
              </div>
            )}

            {isError && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              type="submit"
              disabled={
                isLoading ||
                passwordError ||
                !!validatePassword(formData.password)
              }
              className={`w-full py-3 ${
                isLoading ||
                passwordError ||
                !!validatePassword(formData.password)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-orange-500 hover:opacity-90"
              } text-white font-semibold rounded-lg transition duration-200`}
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6">
            <SocialLogin />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
