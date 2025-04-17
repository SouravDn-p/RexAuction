import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { AuthContexts } from "../../../providers/AuthProvider";
import ThemeContext from "../../Context/ThemeContext";
import { Link } from "react-router-dom";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const countryCodes = [
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
];

const BecomeSeller = () => {
  const { dbUser, user } = useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+880");
  const { isDarkMode } = useContext(ThemeContext);
  const [sellerStatus, setSellerStatus] = useState(null);

  // Fetch seller status every time the component mounts or user changes
  useEffect(() => {
    if (user?.email) {
      const fetchSellerStatus = async () => {
        try {
          const res = await axiosPublic.get(
            "http://localhost:5000/sellerRequest",
            {
              params: { email: user.email },
            }
          );
          if (res.data && res.data.email) {
            setSellerStatus(res.data); // Set status if data exists
          } else {
            setSellerStatus(null); // No request found
          }
        } catch (error) {
          console.error("Error fetching seller status:", error);
          setSellerStatus(null); // Default to null on error
        }
      };
      fetchSellerStatus();
    }
  }, [axiosPublic, user?.email]);

  // Reset form with user data
  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        name: user.displayName || dbUser?.name || "",
        phoneNumber: dbUser?.phoneNumber
          ? dbUser.phoneNumber.split(" ").slice(1).join("")
          : "",
      });
      if (dbUser?.phoneNumber) {
        const phoneParts = dbUser.phoneNumber.split(" ");
        if (phoneParts.length > 1) {
          setSelectedCountryCode(phoneParts[0]);
        }
      }
    }
  }, [user, dbUser, reset]);

  const handleFrontImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      const newPreview = URL.createObjectURL(file);
      setFrontPreview(newPreview);
      setFrontFile(file);
    }
  };

  const handleBackImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (backPreview) URL.revokeObjectURL(backPreview);
      const newPreview = URL.createObjectURL(file);
      setBackPreview(newPreview);
      setBackFile(file);
    }
  };

  const onSubmit = async (data) => {
    if (!data.termsAccepted) return;
    setIsSubmitting(true);

    try {
      let frontUrl = null;
      let backUrl = null;

      if (!frontFile) {
        throw new Error("Front document is required");
      }
      const frontFormData = new FormData();
      frontFormData.append("image", frontFile);
      const frontResponse = await axiosPublic.post(
        image_hosting_api,
        frontFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (frontResponse.data.success) {
        frontUrl =
          frontResponse.data.data.display_url || frontResponse.data.data.url;
      } else {
        throw new Error(
          frontResponse.data.message || "Front image upload failed"
        );
      }

      if (backFile) {
        const backFormData = new FormData();
        backFormData.append("image", backFile);
        const backResponse = await axiosPublic.post(
          image_hosting_api,
          backFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (backResponse.data.success) {
          backUrl =
            backResponse.data.data.display_url || backResponse.data.data.url;
        } else {
          throw new Error(
            backResponse.data.message || "Back image upload failed"
          );
        }
      }

      const fullPhoneNumber = `${selectedCountryCode} ${data.phoneNumber}`;
      const requestData = {
        name: data.name,
        email: user.email,
        phoneNumber: fullPhoneNumber,
        address: data.address,
        documentType: data.documentType,
        uid: dbUser.uid,
        dbUserId: dbUser._id,
        frontDocument: frontUrl,
        backDocument: backUrl,
        becomeSellerStatus: "pending",
        requestDate: new Date().toString(),
      };

      const res = await axiosPublic.post("/become_seller", requestData);

      if (res.data.success) {
        toast.success("Seller request submitted successfully!");
        // Refetch seller status instead of setting it locally
        const updatedStatus = await axiosPublic.get(
          "http://localhost:5000/sellerRequest",
          {
            params: { email: user.email },
          }
        );
        if (updatedStatus.data && updatedStatus.data.email) {
          setSellerStatus(updatedStatus.data);
        } else {
          setSellerStatus(requestData); // Fallback if refetch fails
        }
        resetForm();
      } else {
        throw new Error(res.data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Something went wrong! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    if (frontPreview) URL.revokeObjectURL(frontPreview);
    if (backPreview) URL.revokeObjectURL(backPreview);
    setFrontPreview(null);
    setBackPreview(null);
    setFrontFile(null);
    setBackFile(null);
    setSelectedCountryCode("+880");
  };

  const termsAccepted = watch("termsAccepted");
  const isPending = sellerStatus?.becomeSellerStatus === "pending";

  return (
    <div
      className={`min-h-screen px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`max-w-4xl mx-auto shadow-xl rounded-xl p-6 sm:p-8 transition-all ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left ${
            isDarkMode ? "text-purple-300" : "text-purple-700"
          }`}
        >
          Verification Request Form
        </motion.h2>

        {isPending ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold text-yellow-500">
              Your request is pending.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while your request is being reviewed. You cannot
              submit another request at this time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name", { required: "Full Name is required" })}
                  className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
                  readOnly
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
                  readOnly
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2">
                  <label className="block text-sm font-medium mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className="w-24 border border-purple-300 rounded-l-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Invalid phone number format (10-15 digits)",
                        },
                      })}
                      className="flex-1 border border-purple-300 rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="w-full lg:w-1/2">
                  <label className="block text-sm font-medium mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Select Verification <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("documentType", {
                    required: "Please select a document type",
                  })}
                  className="w-full border text-gray-400 border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
                >
                  <option value="">Select Document Type</option>
                  <option value="NID">NID</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
                {errors.documentType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.documentType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Front of Document <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                    isDarkMode
                      ? "border-gray-600 hover:border-purple-400"
                      : "border-purple-300 hover:border-purple-500"
                  } transition-colors`}
                >
                  {frontPreview ? (
                    <div className="relative">
                      <img
                        src={frontPreview}
                        alt="Front document preview"
                        className="w-full h-48 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (frontPreview) URL.revokeObjectURL(frontPreview);
                          setFrontPreview(null);
                          setFrontFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-purple-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="frontDocument"
                        accept="image/jpeg,image/png"
                        {...register("frontDocument", {
                          required: "Front document is required",
                          validate: {
                            lessThan5MB: () =>
                              (frontFile && frontFile.size <= 5000000) ||
                              "Max 5MB file size",
                            acceptedFormats: () =>
                              (frontFile &&
                                ["image/jpeg", "image/png"].includes(
                                  frontFile.type
                                )) ||
                              "Only JPG/PNG files allowed",
                          },
                        })}
                        onChange={handleFrontImagePreview}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
                {errors.frontDocument && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.frontDocument.message}
                  </p>
                )}
                {frontFile && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {frontFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Back of Document
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                    isDarkMode
                      ? "border-gray-600 hover:border-purple-400"
                      : "border-purple-300 hover:border-purple-500"
                  } transition-colors`}
                >
                  {backPreview ? (
                    <div className="relative">
                      <img
                        src={backPreview}
                        alt="Back document preview"
                        className="w-full h-48 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (backPreview) URL.revokeObjectURL(backPreview);
                          setBackPreview(null);
                          setBackFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-purple-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="backDocument"
                        accept="image/jpeg,image/png"
                        {...register("backDocument", {
                          validate: {
                            lessThan5MB: () =>
                              !backFile ||
                              backFile.size <= 5000000 ||
                              "Max 5MB file size",
                            acceptedFormats: () =>
                              !backFile ||
                              ["image/jpeg", "image/png"].includes(
                                backFile.type
                              ) ||
                              "Only JPG/PNG files allowed",
                          },
                        })}
                        onChange={handleBackImagePreview}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
                {errors.backDocument && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.backDocument.message}
                  </p>
                )}
                {backFile && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {backFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register("termsAccepted", {
                  required: "You must accept the terms",
                })}
                className="mt-1"
              />
              <label className="text-sm">
                I agree to the{" "}
                <Link to={`/terms`} className="text-purple-600 underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm">
                {errors.termsAccepted.message}
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="pt-4 text-center"
            >
              <motion.button
                whileHover={{
                  scale: termsAccepted && !isSubmitting ? 1.05 : 1,
                }}
                whileTap={{ scale: termsAccepted && !isSubmitting ? 0.95 : 1 }}
                type="submit"
                disabled={!termsAccepted || isSubmitting}
                className={`px-8 py-3 rounded-lg shadow-md text-white w-full sm:w-auto flex justify-center items-center ${
                  termsAccepted && !isSubmitting
                    ? "bg-purple-600 hover:bg-purple-700 transition"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </motion.button>
            </motion.div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default BecomeSeller;
