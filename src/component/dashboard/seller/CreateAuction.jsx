import React, { useState } from "react";

export default function CreateAuction() {
  const [auctionData, setAuctionData] = useState({
    name: "",
    category: "",
    imageUrl: "",
    startingPrice: "",
    bidIncrement: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const categories = ["Electronics", "Antiques", "Vehicles", "Furniture", "Jewelry"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuctionData({ ...auctionData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Auction Created:", auctionData);
    alert("Auction Created Successfully!");
  };

  return (
    <div className="  flex justify-center items-center">
      <div className="bg-purple-100 mt-10 p-6 mb-10 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Auction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Auction Name:</label>
              <input
                type="text"
                name="name"
                value={auctionData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Category:</label>
              <select
                name="category"
                value={auctionData.category}
                onChange={handleChange}
                className="w-full p-2 text-gray-500 border rounded bg-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Auction Image URL:</label>
            <input
              type="text"
              name="imageUrl"
              value={auctionData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full p-2 border rounded bg-white"
              required
            />
          </div>

          {auctionData.imageUrl && (
            <div className="flex justify-center">
              <img
                src={auctionData.imageUrl}
                alt="Auction Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Starting Price ($):</label>
              <input
                type="number"
                name="startingPrice"
                value={auctionData.startingPrice}
                onChange={handleChange}
                className="w-full text-gray-500 p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Bid Increment ($):</label>
              <input
                type="number"
                name="bidIncrement"
                value={auctionData.bidIncrement}
                onChange={handleChange}
                className="w-full p-2 text-gray-500 border rounded bg-white"
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
                value={auctionData.startTime}
                onChange={handleChange}
                className="w-full text-gray-500 p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">End Time:</label>
              <input
                type="datetime-local"
                name="endTime"
                value={auctionData.endTime}
                onChange={handleChange}
                className="w-full p-2 text-gray-500 border rounded bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Description:</label>
            <textarea
              name="description"
              value={auctionData.description}
              onChange={handleChange}
              className="w-full p-2 text-gray-500 border rounded bg-white"
              rows="3"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Create Auction
          </button>
        </form>
      </div>
    </div>
  );
}
