import React, { useState } from "react";
import { motion } from "framer-motion";

const BecomeSeller = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    documentType: "NID",
    documents: [],
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "file") {
      setFormData({ ...formData, documents: [...files] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //   submission of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    console.log("Verification Request Submitted:", formData);
    // form submission logic
  };

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

        <form onSubmit={handleSubmit} className="space-y-6 ">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Dropdown */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Select Verification Document{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="NID">NID</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
            </select>
          </div>

          {/* Multiple Image Upload */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Upload Document Images (Multiple)
            </label>
            <div className="border border-dashed border-purple-300 rounded-lg p-4 text-center text-purple-500">
              <input
                type="file"
                name="documents"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="w-full text-center file:bg-purple-100 file:border-none file:text-purple-700 file:rounded-md file:py-2 file:px-4"
              />
              <p className="text-sm mt-2">
                You can upload multiple images (Max 5MB each)
              </p>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="mt-1"
              required
            />
            <label className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-purple-600 underline">
                Terms and Conditions
              </a>
            </label>
          </div>

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
              disabled={!formData.termsAccepted}
              className={`px-8 py-3 rounded-lg shadow-md text-white w-full sm:w-auto ${
                formData.termsAccepted
                  ? "bg-purple-600 hover:bg-purple-700 transition"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Request
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default BecomeSeller;
