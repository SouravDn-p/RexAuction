import React, { useState } from "react";
import { motion } from "framer-motion";

const NewAnnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    image: null,
    status: "draft",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter announcement content..."
              rows={5}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Publication Date */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Publication Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Upload Image (Optional)
            </label>
            <div className="border border-dashed border-purple-300 rounded-lg p-4 text-center text-purple-500">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-center file:bg-purple-100 file:border-none file:text-purple-700 file:rounded-md file:py-2 file:px-4"
              />
              <p className="text-sm mt-2">SVG, PNG, JPG or GIF (max. 2MB)</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md transition w-full sm:w-auto"
            >
              Save
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition w-full sm:w-auto"
            >
              Cancel
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewAnnouncementForm;
