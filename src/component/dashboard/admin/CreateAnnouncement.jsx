import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import ThemeContext from "../../Context/ThemeContext";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const CreateAnnouncement = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Handle Image Upload
      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const response = await axios.post(image_hosting_api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          imageUrl = response.data.data.url;
        }
      }

      // Prepare Announcement Data
      const announcementData = {
        title: data.title,
        content: data.content,
        date: data.date,
        status: data.status,
        image: imageUrl,
      };

      // Send POST Request
      const res = await axios.post(
        "http://localhost:5000/announcement",
        announcementData
      );

      if (res.data.success) {
        toast.success("Announcement created successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-purple-100 via-white to-purple-50 text-black"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div
          className={`max-w-xl p-8 mx-auto ${
            isDarkMode
              ? "bg-gray-800"
              : "bg-gradient-to-b from-white via-purple-50 to-white"
          } shadow-xl rounded-xl mt-20`}
        >
          <h2
            className={`text-2xl sm:text-3xl font-bold ${
              isDarkMode ? "text-purple-300" : "text-purple-700"
            } mb-6 text-center sm:text-left`}
          >
            Create New Announcement
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4">
              {/* Title */}
              <div className="w-1/2">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  } mb-1`}
                >
                  Title *
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter title"
                  className={`w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-500 text-white"
                      : "border-gray-300 bg-gray-300 text-black"
                  } rounded-lg px-4 py-2`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Image */}
              <div className="w-1/2">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  } mb-1`}
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  {...register("image")}
                  accept="image/*"
                  className={`w-full rounded-lg border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-500 file:bg-purple-600 file:text-white"
                      : "border-gray-300 bg-gray-300"
                  } file:border-none file:py-2 file:px-4 file:bg-purple-100 file:text-purple-700`}
                />
              </div>
            </div>

            <div className="flex gap-4">
              {/* Date */}
              <div className="w-1/2">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  } mb-1`}
                >
                  Date *
                </label>
                <input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className={`w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-500 text-white"
                      : "border-gray-300 bg-gray-300 text-black"
                  } rounded-lg px-4 py-2`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="w-1/2">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  } mb-1`}
                >
                  Status *
                </label>
                <select
                  {...register("status", { required: "Status is required" })}
                  className={`w-full border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-500 text-white"
                      : "border-gray-300 bg-gray-300 text-black"
                  } rounded-lg px-4 py-2`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-purple-300" : "text-purple-700"
                } mb-1`}
              >
                Content *
              </label>
              <textarea
                {...register("content", { required: "Content is required" })}
                placeholder="Enter content"
                rows={5}
                className={`w-full border ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-500 text-white"
                    : "border-gray-300 bg-gray-300 text-black"
                } rounded-lg px-4 py-2`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => reset()}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
