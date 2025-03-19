import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const CreateAnnouncement = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      //  Handle Image Upload
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

      //  Send POST Request
      const res = await axios.post(
        "http://localhost:5000/announcement",
        announcementData
      );

      if (res.data.success) {
        toast.success(" Announcement created successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(" Something went wrong!");
    }
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
          Create New Announcement
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter title"
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Content *
            </label>
            <textarea
              {...register("content", { required: "Content is required" })}
              placeholder="Enter content"
              rows={5}
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              {...register("image")}
              accept="image/*"
              className="w-full file:border-none file:py-2 file:px-4 file:bg-purple-100 file:text-purple-700"
            />
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Status *
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              Save
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => reset()}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateAnnouncement;
