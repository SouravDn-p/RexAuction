"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Upload,
  Loader,
  Check,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  ImageIcon,
  AlertCircle,
} from "lucide-react";

export default function CreateAuctionForm({ user, isDarkMode }) {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [loadingProgress, setLoadingProgress] = useState(0);

  const categories = [
    "Electronics",
    "Antiques",
    "Vehicles",
    "Furniture",
    "Jewelry",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  const handleFileChange = (e) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5 MB

    const validImages = files.filter((file) => file.size <= maxSize);
    const invalidImages = files.filter((file) => file.size > maxSize);

    if (invalidImages.length > 0) {
      setShowAlert({
        show: true,
        type: "warning",
        message: "Some images exceed 5MB and were not added.",
      });

      setTimeout(
        () => setShowAlert({ show: false, type: "", message: "" }),
        3000
      );
    }

    setSelectedImages((prev) => [...prev, ...validImages]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoadingProgress(10);

    const formData = new FormData(e.target);
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));

    if (endTime <= startTime) {
      setShowAlert({
        show: true,
        type: "error",
        message: "End time must be after the start time.",
      });
      setIsSubmitting(false);
      setTimeout(
        () => setShowAlert({ show: false, type: "", message: "" }),
        3000
      );
      return;
    }

    const auctionData = {
      name: formData.get("name"),
      category: formData.get("category"),
      condition: formData.get("condition"),
      itemYear: formData.get("itemYear"),
      startingPrice: formData.get("startingPrice"),
      startTime,
      endTime,
      description: formData.get("description"),
      status: "pending",
      sellerDisplayName: user?.displayName,
      sellerEmail: user?.email,
      images: [],
      topBidders: [],
    };

    try {
      setLoadingProgress(30);
      // Upload images
      const imageHostingApi = process.env.NEXT_PUBLIC_IMAGE_HOSTING_API;

      if (!imageHostingApi) {
        throw new Error("Image hosting API URL not configured");
      }

      const uploadPromises = selectedImages.map((file) => {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        return axios.post(imageHostingApi, imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      setLoadingProgress(60);
      const responses = await Promise.all(uploadPromises);
      auctionData.images = responses.map((res) => res.data.data.display_url);

      setLoadingProgress(80);
      // Create auction
      const response = await axios.post("/api/auctions", auctionData);
      setLoadingProgress(100);

      setShowAlert({
        show: true,
        type: "success",
        message: "Auction Created Successfully!",
      });

      // Reset form
      e.target.reset();
      setSelectedImages([]);

      setTimeout(() => {
        setShowAlert({ show: false, type: "", message: "" });
        // Optionally redirect to auctions page
        // router.push('/auctions')
      }, 2000);
    } catch (error) {
      console.error("Error creating auction:", error);
      setShowAlert({
        show: true,
        type: "error",
        message: "Failed to create auction. Please try again.",
      });
      setTimeout(
        () => setShowAlert({ show: false, type: "", message: "" }),
        3000
      );
    } finally {
      setIsSubmitting(false);
      setLoadingProgress(0);
    }
  };

  return (
    <div
      className={`flex justify-center min-h-screen items-center w-full px-4 sm:px-6 lg:px-8 py-12 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50"
      }`}
    >
      {/* Alert Message */}
      {showAlert.show && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            showAlert.type === "success"
              ? "bg-green-600 text-white"
              : showAlert.type === "error"
              ? "bg-red-600 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {showAlert.type === "success" ? (
            <Check size={20} />
          ) : showAlert.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <p>{showAlert.message}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-center mb-4">
              <Loader size={40} className="animate-spin text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2 dark:text-white">
              Creating Auction
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Please wait while we process your auction...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-full max-w-4xl p-6 sm:p-8 mx-auto ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } shadow-xl rounded-xl`}
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold ${
            isDarkMode ? "text-purple-300" : "text-purple-700"
          } mb-6 text-center sm:text-left flex items-center gap-2`}
        >
          <Tag className={isDarkMode ? "text-purple-300" : "text-purple-700"} />
          Create New Auction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-t ">
          {/* Basic Info Section */}
          <div className="bg-gray-50  dark:bg-gray-700 p-4 rounded-lg">
            <h3
              className={`text-lg font-medium mb-4 ${
                isDarkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  } mb-1`}
                >
                  Auction Name
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="Enter item name"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                      : "border-gray-300 bg-white text-black focus:border-purple-500"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  } mb-1`}
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                      : "border-gray-300 bg-white text-black focus:border-purple-500"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  } mb-1`}
                >
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                      : "border-gray-300 bg-white text-black focus:border-purple-500"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="itemYear"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  } mb-1`}
                >
                  Item Year
                </label>
                <input
                  id="itemYear"
                  name="itemYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Year of manufacture"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                      : "border-gray-300 bg-white text-black focus:border-purple-500"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3
              className={`text-lg font-medium mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              <ImageIcon size={20} />
              Images
            </h3>

            <div className="w-full">
              <label
                htmlFor="images"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2`}
              >
                Upload Images (Multiple)
              </label>
              <div
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer p-6 ${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700"
                    : "border-purple-300 hover:bg-purple-50"
                } transition`}
              >
                <Upload
                  size={32}
                  className={isDarkMode ? "text-purple-400" : "text-purple-500"}
                />
                <p className="mt-2 text-sm text-center">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
                  Maximum file size: 5MB
                </p>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  required={selectedImages.length === 0}
                />
              </div>

              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <h4
                    className={`text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Selected Images ({selectedImages.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Timing Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3
              className={`text-lg font-medium mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              <DollarSign size={20} />
              Pricing & Timing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="startingPrice"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  } mb-1`}
                >
                  Starting Price ($)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    $
                  </span>
                  <input
                    id="startingPrice"
                    name="startingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                        : "border-gray-300 bg-white text-black focus:border-purple-500"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="startTime"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  } mb-1`}
                >
                  Start Time
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Calendar size={16} />
                  </span>
                  <input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                        : "border-gray-300 bg-white text-black focus:border-purple-500"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  } mb-1`}
                >
                  End Time
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Calendar size={16} />
                  </span>
                  <input
                    id="endTime"
                    name="endTime"
                    type="datetime-local"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                        : "border-gray-300 bg-white text-black focus:border-purple-500"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3
              className={`text-lg font-medium mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              <FileText size={20} />
              Description
            </h3>

            <div>
              <label
                htmlFor="description"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-1`}
              >
                Item Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide detailed information about your item..."
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800 text-white focus:border-purple-500"
                    : "border-gray-300 bg-white text-black focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition`}
                rows={4}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg transition flex items-center justify-center text-lg font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader size={20} className="animate-spin mr-2" />
                Creating Auction...
              </>
            ) : (
              <>
                <Check size={20} className="mr-2" />
                Create Auction
              </>
            )}
          </button>

          {/* Seller Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Listing as: {user?.displayName || user?.email || "Anonymous"}
          </div>
        </form>
      </div>
    </div>
  );
}
