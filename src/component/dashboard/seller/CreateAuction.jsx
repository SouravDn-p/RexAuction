import Swal from "sweetalert2";
import { useState, useContext } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";
import ThemeContext from "../../Context/ThemeContext";
import { motion } from "framer-motion";
import SellerLandingPage from "../buyer/SellerLandingPage";

const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${apiKey}`;

export default function CreateAuction() {
  const axiosSecure = useAxiosSecure();
  const { user, dbUser } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Electronics",
    "Antiques",
    "Vehicles",
    "Furniture",
    "Jewelry",
    "Others",
  ];
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5 MB

    const validImages = files.filter((file) => file.size <= maxSize);
    const invalidImages = files.filter((file) => file.size > maxSize);

    if (invalidImages.length > 0) {
      Swal.fire({
        title: "Error",
        text: "Some images exceed 5MB and were not added.",
        icon: "warning",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      });
    }

    if (validImages.length === 0) return;

    if (selectedImages.length < 4) {
      if (validImages.length + selectedImages.length < 4) {
        Swal.fire({
          title: "Error",
          text: `You need to upload at least ${
            4 - selectedImages.length
          } more image(s).`,
          icon: "error",
          background: isDarkMode ? "#1f2937" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        });
        return;
      }

      setSelectedImages((prev) => [...prev, ...validImages]);
    } else {
      setSelectedImages((prev) => [...prev, ...validImages]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate images again on submit
    if (selectedImages.length < 3) {
      Swal.fire({
        title: "Error",
        text: "Please upload at least 3 images.",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      });
      setIsSubmitting(false);
      return;
    }

    // Show progress popup
    const swalInstance = Swal.fire({
      title: "Creating Auction",
      html: `
        <div class="text-left">
          <p>Uploading images and creating your auction...</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
            <div id="progress-bar" class="bg-purple-600 h-2.5 rounded-full" style="width: 0%"></div>
          </div>
          <p id="progress-text" class="text-sm mt-1">0/${selectedImages.length} images uploaded</p>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      background: isDarkMode ? "#1f2937" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    });

    const form = new FormData(e.target);
    const startTime = new Date(form.get("startTime"));
    const endTime = new Date(form.get("endTime"));

    if (endTime <= startTime) {
      Swal.fire({
        title: "Error",
        text: "End time must be after the start time.",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      });
      setIsSubmitting(false);
      return;
    }

    const auctionData = {
      name: form.get("name"),
      category: form.get("category"),
      startingPrice: form.get("startingPrice"),
      startTime,
      endTime,
      description: form.get("description"),
      condition: form.get("condition"),
      itemYear: form.get("itemYear"),
      status: "pending",
      sellerDisplayName: user?.displayName,
      sellerEmail: user?.email,
      sellerPhotoUrl: dbUser?.photo,
      images: [],
      topBidders: [],
      history: form.get("history"),
      bids: 0,
      currentBid: 0,
    };

    try {
      // Update progress bar function
      const updateProgress = (completed, total) => {
        const progress = Math.round((completed / total) * 100);
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText)
          progressText.textContent = `${completed}/${total} images uploaded`;
      };

      const uploadPromises = selectedImages.map((file, index) => {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        return axios
          .post(imageHostingApi, imageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            updateProgress(index + 1, selectedImages.length);
            return response;
          });
      });

      const responses = await Promise.all(uploadPromises);
      auctionData.images = responses.map((res) => res.data.data.display_url);

      const { data } = await axiosSecure.post("/auctions", auctionData);

      Swal.fire({
        title: "Success!",
        text: "Auction Created Successfully!",
        icon: "success",
        confirmButtonText: "OK",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      });

      e.target.reset();
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating auction:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to create auction. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        background: isDarkMode ? "#1f2937" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {dbUser.role == "seller" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex justify-center min-h-screen items-center ${
            isDarkMode
              ? "bg-gray-900 text-white"
              : "bg-gradient-to-b from-purple-100 via-white to-purple-50 text-black"
          }`}
        >
          <div
            className={`max-w-4xl p-6 md:p-8 mx-auto w-11/12 md:w-full rounded-xl shadow-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl sm:text-3xl font-bold ${
                isDarkMode ? "text-purple-300" : "text-purple-700"
              } mb-6 text-center`}
            >
              Create New Auction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    } mb-1`}
                  >
                    Auction Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter auction name"
                    className={`w-full border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                        : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    } mb-1`}
                  >
                    Category:
                  </label>
                  <select
                    name="category"
                    className={`w-full border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                        : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
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
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    } mb-1`}
                  >
                    Condition:
                  </label>
                  <select
                    name="condition"
                    className={`w-full border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                        : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
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
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    } mb-1`}
                  >
                    Item Year:
                  </label>
                  <input
                    type="number"
                    name="itemYear"
                    min="1000"
                    placeholder="Enter manufacturing year"
                    max={new Date().getFullYear()}
                    className={`w-full border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                        : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  } mb-1`}
                >
                  Upload Images (Minimum 4 required):
                </label>
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                    isDarkMode
                      ? "border-gray-600 hover:bg-gray-700"
                      : "border-gray-300 hover:bg-gray-50"
                  } transition`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4"
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
                    <p
                      className={`mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      PNG, JPG, JPEG (MAX. 5MB each)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {selectedImages.length > 0 && (
                  <div className="mt-3">
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Selected images: {selectedImages.length}/4
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="w-20 h-20 object-cover rounded border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedImages.length < 4 && (
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-red-300" : "text-red-500"
                    }`}
                  >
                    {selectedImages.length === 0
                      ? "Please upload at least 4 images"
                      : `Please upload ${
                          4 - selectedImages.length
                        } more image(s)`}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    } mb-1`}
                  >
                    Starting Price ($):
                  </label>
                  <input
                    type="number"
                    name="startingPrice"
                    placeholder="Enter starting price"
                    min="0"
                    step="0.01"
                    className={`w-full border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                        : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    } mb-1`}
                  >
                    Start Time:
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    className={`w-full border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                        : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    } mb-1`}
                  >
                    End Time:
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    className={`w-full border ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-700 text-white focus:ring-purple-500 focus:border-purple-500"
                        : "border-gray-300 bg-white text-black focus:ring-purple-500 focus:border-purple-500"
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  } mb-1`}
                >
                  Description:
                </label>
                <textarea
                  name="description"
                  placeholder="Enter detailed description of the item"
                  className={`w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                      : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  } mb-1`}
                >
                  History/Provenance:
                </label>
                <textarea
                  name="history"
                  placeholder="Enter item history or provenance"
                  className={`w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
                      : "border-gray-300 bg-white text-black placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2`}
                  rows="3"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedImages.length < 3}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : selectedImages.length < 3
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                    Creating...
                  </span>
                ) : (
                  "Create Auction"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <SellerLandingPage />
      )}
    </>
  );
}
