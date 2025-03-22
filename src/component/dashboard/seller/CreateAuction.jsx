import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function CreateAuction() {
  const axiosSecure = useAxiosSecure();
  const auth = useAuth();
  console.log(auth);

  const categories = ["Electronics", "Antiques", "Vehicles", "Furniture", "Jewelry"];


  const handleSubmit = async(e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    const category = form.get("category");
    const imageUrl = form.get("imageUrl");
    const startingPrice = form.get("startingPrice");
    const bidIncrement = form.get("bidIncrement");
    const startTime = form.get("startTime");
    const endTime = form.get("endTime");
    const description = form.get("description");
    const status = "pending";
    const sellerEmail = auth?.user?.email;
    const auctionData = {name, category, imageUrl, startingPrice, bidIncrement, startTime, endTime, description, status, sellerEmail};

    try {
      const { data } = await axiosSecure.post("/auctions", auctionData);
      console.log("Auction Created:", auctionData);
  
      // Success alert
      Swal.fire({
        title: "Success!",
        text: "Auction Created Successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error creating auction:", error);
  
      // Error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to create auction. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    
 
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
                className="w-full p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Category:</label>
              <select
                name="category"
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
              placeholder="Enter image URL"
              className="w-full p-2 border rounded bg-white"
              required
            />
          </div>

          {/* {auctionData.imageUrl && (
            <div className="flex justify-center">
              <img
                src={auctionData.imageUrl}
                alt="Auction Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )} */}

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Starting Price ($):</label>
              <input
                type="number"
                name="startingPrice"
                className="w-full text-gray-500 p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Bid Increment ($):</label>
              <input
                type="number"
                name="bidIncrement"
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
                className="w-full text-gray-500 p-2 border rounded bg-white"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">End Time:</label>
              <input
                type="datetime-local"
                name="endTime"
                className="w-full p-2 text-gray-500 border rounded bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Description:</label>
            <textarea
              name="description"
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
