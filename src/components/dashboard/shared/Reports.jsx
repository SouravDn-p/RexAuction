import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ThemeContext from "../../Context/ThemeContext";
import { FiUpload, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const Reports = () => {
  const axiosSecure = useAxiosSecure();
  const { isDarkMode } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const reportType = watch("reportAgainst");
  const selectedComplaint = watch("complaints");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      const uploadedProofs = [];
      const totalFiles = data.proofs.length;
      let processedFiles = 0;

      // Upload proofs to ImgBB
      for (const file of data.proofs) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await res.json();
        if (result.success) uploadedProofs.push(result.data.url);
        
        processedFiles++;
        setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
      }

      // Prepare report data
      const reportData = {
        name: data.name,
        email: data.email,
        reportAgainst: data.reportAgainst,
        personReported: data.personReported,
        product: data.product || null,
        complaints: data.complaints,
        otherReason: data.otherReason || null,
        proofs: uploadedProofs,
        createdAt: new Date().toISOString(),
      };

      await axiosSecure.post("/reports", reportData);

      Swal.fire({
        title: "Report Submitted Successfully!",
        text: "We've received your report and will review it shortly.",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#111827",
      });

      reset();
    } catch (error) {
      console.error("Report submission failed:", error);
      Swal.fire({
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#111827",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div
      className={`min-h-screen px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100"
          : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Report an Issue
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Help us maintain a safe marketplace by reporting any suspicious activities, 
            fraudulent sellers, or problematic buyers.
          </p>
        </div>

        {/* Form Container */}
        <div
          data-aos="fade-up"
          className={`max-w-5xl mx-auto rounded-xl p-6 sm:p-8 lg:p-10 transform transition-all duration-300 ${
            isDarkMode ? "" : "bg-white/90 backdrop-blur-sm"
          }`}
        >
          {/* Progress Indicator */}
          {isSubmitting && (
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Uploading files...</span>
                <span className="text-sm font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <FiAlertTriangle className="mr-2 text-purple-600" />
                Your Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="your name"
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                    })}
                    type="email"
                    placeholder="your email"
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Report Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <FiAlertTriangle className="mr-2 text-purple-600" />
                Report Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Report Against */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reporting Against *
                  </label>
                  <select
                    {...register("reportAgainst", { required: "Please select one" })}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                  </select>
                  {errors.reportAgainst && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.reportAgainst.message}
                    </p>
                  )}
                </div>

                {/* Name of Person Reported */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {reportType === "Buyer" ? "Buyer's Name *" : reportType === "Seller" ? "Seller's Name *" : "Person's Name *"}
                  </label>
                  <input
                    {...register("personReported", { required: "Name is required" })}
                    type="text"
                    placeholder={reportType === "Buyer" ? "Buyer name" : reportType === "Seller" ? "Seller name" : "Person name"}
                    className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {errors.personReported && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.personReported.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Involved (Optional)
                </label>
                <input
                  {...register("product")}
                  type="text"
                  placeholder="Enter product name if applicable"
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Complaint Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <FiAlertTriangle className="mr-2 text-purple-600" />
                Complaint Details
              </h3>
              
              {/* Complaint Types */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Complaint Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    "Product was forgery",
                    "Product was damaged",
                    "Product not received",
                    "Scammed with money",
                    "Won the bid but couldn't claim the product",
                    "Winner didn't complete the payment",
                    "Product bounced back due to wrong address",
                    "Other",
                  ].map((reason, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedComplaint === reason
                          ? isDarkMode
                            ? "bg-purple-900/50 border border-purple-600"
                            : "bg-purple-100 border border-purple-300"
                          : isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        value={reason}
                        {...register("complaints", {
                          required: "Please select a complaint type",
                        })}
                        className="mt-1 accent-purple-600 h-4 w-4"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                {errors.complaints && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.complaints.message}
                  </p>
                )}
              </div>

              {/* Other Reason */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  {...register("otherReason")}
                  rows={4}
                  placeholder="Please provide any additional details about your complaint..."
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Proof Upload Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <FiUpload className="mr-2 text-purple-600" />
                Supporting Evidence
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload Proofs *
                  <span className="ml-2 text-xs opacity-70">
                    (Images, screenshots, documents - max 5MB each)
                  </span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.proofs 
                    ? "border-red-500 bg-red-500/10" 
                    : isDarkMode 
                      ? "border-gray-600 hover:border-purple-500 bg-gray-700/50" 
                      : "border-gray-300 hover:border-purple-400 bg-gray-50"
                }`}>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    {...register("proofs", { required: "Please upload at least one proof" })}
                    multiple
                    className="hidden"
                    id="proof-upload"
                  />
                  <label
                    htmlFor="proof-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <FiUpload className="text-3xl text-purple-600" />
                    <p className="text-sm">
                      <span className="font-semibold text-purple-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs opacity-70">
                      PNG, JPG, PDF up to 5MB
                    </p>
                  </label>
                </div>
                {errors.proofs && (
                  <p className="mt-2 text-sm text-red-500">{errors.proofs.message}</p>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-6">
              <div className="flex items-center mb-4 text-sm p-3 text-purple-800 rounded-lg bg-purple-200 dark:bg-purple-900/30">
                <FiCheckCircle className="flex-shrink-0 mr-2 text-purple-600" />
                <span>
                  Your report will be reviewed within 24-48 hours. We take all reports seriously.
                </span>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                  isSubmitting
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reports;