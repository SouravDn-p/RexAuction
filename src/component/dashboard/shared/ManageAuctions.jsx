import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

function ManageAuctions() {
  const axiosSecure = useAxiosSecure();
  const { data: auctions = [], refetch } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/auctions");
      return res.data || [];
    },
  });

  // Function to handle status update with confirmation
  const updateAuctionStatus = async (id, status) => {
    try {
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You want to ${status.toLowerCase()} this auction?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${status}`,
        cancelButtonText: "Cancel",
        confirmButtonColor: status === "Accepted" ? "#22c55e" : "#ef4444",
      });

      if (result.isConfirmed) {
        // Update auction status
        await axiosSecure.patch(`/auctions/${id}`, { status });
        await refetch();

        Swal.fire({
          title: "Success!",
          text: `Auction ${status.toLowerCase()} successfully.`,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `Failed to ${status.toLowerCase()} auction.`,
        icon: "error",
      });
      console.error(`Error updating auction status to ${status}:`, error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Manage Auctions</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4 border border-gray-600">Image</th>
              <th className="py-2 px-4 border border-gray-600">Auction Name</th>
              <th className="py-2 px-4 border border-gray-600">Category</th>
              <th className="py-2 px-4 border border-gray-600">Starting Price</th>
              <th className="py-2 px-4 border border-gray-600">Start Time</th>
              <th className="py-2 px-4 border border-gray-600">Status</th>
              <th className="py-2 px-4 border border-gray-600">User Email</th>
              <th className="py-2 px-4 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr key={auction._id} className="text-center">
                <td className="py-2 px-4 border border-gray-600">
                  <img
                    src={auction.images?.[0]}
                    alt={auction.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4 border border-gray-600">{auction.name}</td>
                <td className="py-2 px-4 border border-gray-600">{auction.category}</td>
                <td className="py-2 px-4 border border-gray-600">${auction.startingPrice}</td>
                <td className="py-2 px-4 border border-gray-600">
                  {new Date(auction.startTime).toLocaleString()}
                </td>
                <td className="py-2 px-4 border border-gray-600">{auction.status}</td>
                <td className="py-2 px-4 border border-gray-600">{auction.sellerEmail}</td>
                <td className="py-2 px-4 border border-gray-600">
                  <div className="flex space-x-4 justify-center">
                    {/* Accept Button */}
                    <button
                      onClick={() => updateAuctionStatus(auction._id, "Accepted")}
                      className={`px-4 py-2 rounded ${
                        auction.status === "Accepted"
                          ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                      disabled={auction.status === "Accepted"}
                    >
                      Accept
                    </button>
                    {/* Reject Button */}
                    <button
                      onClick={() => updateAuctionStatus(auction._id, "Rejected")}
                      className={`px-4 py-2 rounded ${
                        auction.status === "Rejected"
                          ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                      disabled={auction.status === "Rejected"}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageAuctions;
