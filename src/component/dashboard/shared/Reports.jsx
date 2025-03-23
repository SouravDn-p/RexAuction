import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import ThemeContext from "../../Context/ThemeContext";

const Reports = () => {
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // apply dark class
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

  const onSubmit = async (data) => {
    try {
      const uploadedProofs = [];

      for (const file of data.proofs) {
        const formData = new FormData();
        formData.append("image", file);

        // put the real fetching link here
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMAGE_HOSTING_KEY
          }`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await res.json();
        if (result.success) uploadedProofs.push(result.data.url);
      }

      const reportData = {
        name: data.name,
        email: data.email,
        reportAgainst: data.reportAgainst,
        personReported: data.personReported,
        product: data.product || null,
        complaints: data.complaints,
        otherReason: data.otherReason || null,
        proofs: uploadedProofs,
      };

      await axios.post("https://your-server-api-url/report", reportData);

      Swal.fire({
        title: "Report Submitted",
        text: "We will review and come back to you shortly.",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
      });

      reset();
    } catch (error) {
      console.error("Report submission failed:", error);
      Swal.fire("Oops!", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div
      className={`min-h-screen px-4 py-10 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-900"
      }`}
    >
      <div
        data-aos="fade-up"
        className={`max-w-4xl mx-auto rounded-xl p-6 sm:p-10 shadow-xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-8 text-center">
          Report a Buyer or Seller
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-purple-700">
              Name *
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Your name"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-purple-700">
              Email *
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
              type="email"
              placeholder="Your email"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          {/* Report Against */}
          <div>
            <label className="text-sm font-medium text-purple-700 dark:text-purple-200">
              Report Against *
            </label>
            <select
              {...register("reportAgainst", { required: "Please select one" })}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select...</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
            {errors.reportAgainst && (
              <p className="text-red-500 text-sm">
                {errors.reportAgainst.message}
              </p>
            )}
          </div>
          Name of Person Reported
          <div>
            <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Person's Name *
            </label>
            <input
              {...register("personReported", { required: "Name is required" })}
              type="text"
              placeholder="Reported person's name"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Product (if applicable)
            </label>
            <input
              {...register("product")}
              type="text"
              placeholder="Product name"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          {/* Complaint Types */}
          <div>
            <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Complaint Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-700 dark:text-gray-200">
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
                <label key={idx} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    value={reason}
                    {...register("complaints", {
                      required: "Please select a complaint type",
                    })}
                    className="accent-purple-500"
                    name="complaints"
                  />
                  {reason}
                </label>
              ))}
            </div>
            {errors.complaints && (
              <p className="text-red-500 text-sm mt-1">
                {errors.complaints.message}
              </p>
            )}
          </div>
          {/* Other Reason */}
          <div>
            <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Other Reasons (Explain your issue here)
            </label>
            <textarea
              {...register("otherReason")}
              rows={3}
              placeholder="Explain other reason here..."
              className="w-full border border-purple-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          {/* Upload Proof */}
          <div>
            <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Upload Proofs *
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("proofs", { required: "Please upload proof" })}
              multiple
              className="w-full text-center file:bg-purple-100 file:border-none file:text-purple-700 file:rounded-md file:py-2 file:px-4 mt-1 dark:file:bg-purple-900"
            />
            {errors.proofs && (
              <p className="text-red-500 text-sm">{errors.proofs.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Upload images or documents (Max size 5MB each)
            </p>
          </div>
          {/* Submit Button */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-3 rounded-lg w-full sm:w-auto shadow-md"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reports;
