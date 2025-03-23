import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";

const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${apiKey}`;

export default function CreateAuction() {
  const axiosSecure = useAxiosSecure();
  const auth = useAuth();
  const categories = ["Electronics", "Antiques", "Vehicles", "Furniture", "Jewelry"];

  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      });
    }

    setSelectedImages((prev) => [...prev, ...validImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.target);

    const startTime = new Date(form.get("startTime"));
    const endTime = new Date(form.get("endTime"));

    if (endTime <= startTime) {
      Swal.fire({
        title: "Error",
        text: "End time must be after the start time.",
        icon: "error",
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
      status: "pending",
      sellerEmail: auth?.user?.email,
      images: [],
    };

    try {
      const uploadPromises = selectedImages.map((file) => {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        return axios.post(imageHostingApi, imageFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      const responses = await Promise.all(uploadPromises);
      auctionData.images = responses.map((res) => res.data.data.display_url);

      const { data } = await axiosSecure.post("/auctions", auctionData);
      console.log("Auction Created:", data);

      Swal.fire({
        title: "Success!",
        text: "Auction Created Successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      e.target.reset();
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating auction:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create auction. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-purple-100 mt-10 p-6 mb-10 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Auction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Auction Name:</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Category:</label>
              <select name="category" className="w-full p-2 border rounded bg-white" required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Upload Images (Multiple):</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 rounded-xl border border-gray-300"
              required
            />
          </div>

          {selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Starting Price ($):</label>
              <input
                type="number"
                name="startingPrice"
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Start Time:</label>
              <input
                type="datetime-local"
                name="startTime"
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">End Time:</label>
              <input
                type="datetime-local"
                name="endTime"
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Description:</label>
            <textarea
              name="description"
              className="w-full p-2 border rounded bg-white"
              rows="3"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg transition ${isSubmitting ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
          >
            {isSubmitting ? "Creating..." : "Create Auction"}
          </button>
        </form>
      </div>
    </div>
  );
}
