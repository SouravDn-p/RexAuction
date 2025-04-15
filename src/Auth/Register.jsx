"use client"

import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useDispatch, useSelector } from "react-redux"
import { createUser } from "../redux/features/user/userSlice"
import { useAddUserMutation } from "../redux/features/api/userApi"
import SocialLogin from "../component/SocialLogin"
import { FaUser, FaEnvelope, FaLock, FaImage, FaCheck, FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [newUser] = useAddUserMutation()
  const { isLoading, isError, error } = useSelector((state) => state.userSlice)

  const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY
  const imageHostingApi = `https://api.imgbb.com/1/upload?key=${apiKey}`

  const passwordCriteria = [
    { test: /[A-Z]/, message: "One uppercase letter" },
    { test: /[a-z]/, message: "One lowercase letter" },
    { test: /.{6,}/, message: "At least 6 characters" },
  ]

  const validatePassword = (password) => {
    const failedCriteria = passwordCriteria.filter((criterion) => !criterion.test.test(password))
    return failedCriteria.length ? failedCriteria.map((c) => c.message).join(", ") : null
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const validationError = validatePassword(formData.password)
    if (validationError) return toast.error(validationError)
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match")

    let photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`

    if (imageFile) {
      const formDataImage = new FormData()
      formDataImage.append("image", imageFile)
      try {
        const res = await fetch(imageHostingApi, {
          method: "POST",
          body: formDataImage,
        })
        const data = await res.json()
        if (data.success) {
          photoURL = data.data.display_url
        } else {
          toast.warning("Failed to upload image, using default avatar.")
        }
      } catch (err) {
        toast.warning("Image upload error, using default avatar.")
      }
    }

    try {
      const userData = {
        ...formData,
        photoURL,
      }

      const result = await dispatch(createUser(userData)).unwrap()

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
      })

      toast.success("Registration successful! Redirecting...")
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const passwordError = formData.confirmPassword && formData.password !== formData.confirmPassword

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden py-10">
      {/* Background shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-r from-blue-600 to-purple-900  rounded-bl-full opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-2/3 h-1/3 bg-gradient-to-r from-blue-900 to-purple-900  rounded-tr-full opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-r from-purple-900 to-purple-900  rounded-tl-full opacity-70"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl px-6 sm:px-10"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our community today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="pl-10 w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="pl-10 w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="pl-10 w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className={`pl-10 w-full px-4 py-3 rounded-full border ${
                      passwordError ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-purple-400"
                    } bg-white text-gray-800 focus:ring-2 focus:border-transparent outline-none transition`}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <FaTimes className="mr-1" /> Passwords do not match
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaImage className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="pl-10 w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition"
                  />
                </div>
                {imagePreview && (
                  <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-purple-400 shadow-md">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {formData.password && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {passwordCriteria.map((c, i) => (
                    <div
                      key={i}
                      className={`flex items-center text-sm p-2 rounded ${
                        c.test.test(formData.password) ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {c.test.test(formData.password) ? (
                        <FaCheck className="mr-2 text-green-500" />
                      ) : (
                        <FaTimes className="mr-2 text-red-500" />
                      )}
                      {c.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isError && <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-700">{error}</div>}

            <motion.button
              type="submit"
              disabled={isLoading || passwordError || !!validatePassword(formData.password)}
              className={`w-full py-3 px-4 flex justify-center items-center rounded-full text-white font-semibold text-lg transition duration-300 ${
                isLoading || passwordError || !!validatePassword(formData.password)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-900 to-purple-900  "
              }`}
              whileHover={{ scale: isLoading || passwordError || !!validatePassword(formData.password) ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || passwordError || !!validatePassword(formData.password) ? 1 : 0.98 }}
            >
              {isLoading ? (
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
                  Creating Account...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </motion.button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <NavLink to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
                  Sign in
                </NavLink>
              </p>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <SocialLogin />
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
