import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const BecomeSeller = () => {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (!data.termsAccepted) return;

    setIsSubmitting(true);

    try {
      // Image Upload to imgbb (multiple files)
      const uploadedImages = [];
      for (const file of data.documents) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          uploadedImages.push(result.data.url);
        }
      }

      const requestData = {
        name: data.name,
        email: data.email,
        address: data.address,
        documentType: data.documentType,
        documents: uploadedImages,
      };

      // Send request data to the server
      const res = await axiosPublic.post("become_seller", requestData);

      if (res.data.success) {
        toast.success("Seller request submitted successfully!");
        reset();
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
    <div className="bg-purple-50 min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-8"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6 text-center sm:text-left"
        >
          Verification Request Form
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("name", { required: "Full Name is required" })}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
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
              className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              {...register("address", { required: "Address is required" })}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Dropdown */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Select Verification Document{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              {...register("documentType", {
                required: "Please select a document type",
              })}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
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

          {/* Multiple Image Upload */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Upload Document Images (Multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("documents", {
                required: "Please upload at least one document",
              })}
              multiple
              className="w-full text-center file:bg-purple-100 file:border-none file:text-purple-700 file:rounded-md file:py-2 file:px-4"
            />
            {errors.documents && (
              <p className="text-red-500 text-sm">{errors.documents.message}</p>
            )}
            <p className="text-sm mt-2 text-gray-500">
              You can upload multiple images (Max 5MB each)
            </p>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("termsAccepted", {
                required: "You must accept the terms",
              })}
              className="mt-1"
            />
            <label className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-purple-600 underline">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm">
              {errors.termsAccepted.message}
            </p>
          )}

          {/* Submit Button */}
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
