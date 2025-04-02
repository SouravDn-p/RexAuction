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

const BecomeSeller = () => {
  const { dbUser, user } = useContext(AuthContexts);
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setValue("name", user.displayName || dbUser?.name || "");
    }
  }, [user, dbUser, setValue]);

  const handleFrontImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleBackImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!data.termsAccepted) return;
    setIsSubmitting(true);

    try {
      // Upload front document image
      const frontFormData = new FormData();
      frontFormData.append("image", data.frontDocument[0]);
      const frontResponse = await fetch(image_hosting_api, {
        method: "POST",
        body: frontFormData,
      });
      const frontResult = await frontResponse.json();

      // Upload back document image
      const backFormData = new FormData();
      backFormData.append("image", data.backDocument[0]);
      const backResponse = await fetch(image_hosting_api, {
        method: "POST",
        body: backFormData,
      });
      const backResult = await backResponse.json();

      if (!frontResult.success || !backResult.success) {
        throw new Error("Image upload failed");
      }

      const requestData = {
        name: data.name,
        email: user.email,
        address: data.address,
        documentType: data.documentType,
        uid: dbUser.uid,
        frontDocument: frontResult.data.url,
        backDocument: backResult.data.url,
        becomeSellerStatus: "pending",
      };

      const res = await axiosPublic.post("become_seller", requestData);

      if (res.data.success) {
        toast.success("Seller request submitted successfully!");
        reset();
        setFrontPreview(null);
        setBackPreview(null);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const termsAccepted = watch("termsAccepted");

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

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your address"
                {...register("address", { required: "Address is required" })}
                className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">
                Select Verification <span className="text-red-500">*</span>
              </label>
              <select
                {...register("documentType", {
                  required: "Please select a document type",
                })}
                className="w-full border text-gray-400 border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
              >
                <option value="NID">NID</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
              {errors.documentType && (
                <p className="text-red-500 text-sm">
                  {errors.documentType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Front of Document <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("frontDocument", {
                  required: "Front document is required",
                })}
                onChange={handleFrontImagePreview}
                className="w-full rounded-lg p-1 border-dashed border-2 file:bg-purple-100 file:border-none file:text-purple-700 file:rounded-md file:py-2 file:px-4"
              />
              {errors.frontDocument && (
                <p className="text-red-500 text-sm">
                  {errors.frontDocument.message}
                </p>
              )}
              {frontPreview && (
                <div className="mt-4">
                  <img
                    src={frontPreview}
                    alt="Front document preview"
                    className="w-full h-48 object-contain rounded-lg border border-purple-300"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Back of Document <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("backDocument", {
                  required: "Back document is required",
                })}
                onChange={handleBackImagePreview}
                className="w-full rounded-lg p-1 border-dashed border-2 file:bg-purple-100 file:border-none file:text-purple-700 file:rounded-md file:py-2 file:px-4"
              />
              {errors.backDocument && (
                <p className="text-red-500 text-sm">
                  {errors.backDocument.message}
                </p>
              )}
              {backPreview && (
                <div className="mt-4">
                  <img
                    src={backPreview}
                    alt="Back document preview"
                    className="w-full h-48 object-contain rounded-lg border border-purple-300"
                  />
                </div>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!termsAccepted || isSubmitting}
              className={`px-8 py-3 rounded-lg shadow-md text-white w-full sm:w-auto ${
                termsAccepted && !isSubmitting
                  ? "bg-purple-600 hover:bg-purple-700 transition"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default BecomeSeller;
// just updated