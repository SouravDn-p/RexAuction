import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

function ManageAuctions() {
  const axiosSecure = useAxiosSecure();
  const { data: auctions = [], refetch } = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/auctions");
      return res.data || [];
    },
  });

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
                <td className="py-2 px-4 border border-gray-600">{new Date(auction.startTime).toLocaleString()}</td>
                <td className="py-2 px-4 border border-gray-600">{auction.status}</td>
                <td className="py-2 px-4 border border-gray-600">{auction.sellerEmail}</td>
                <td className="py-2 px-4 border border-gray-600">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    onClick={() => alert(`Details for ${auction.name}`)}
                  >
                    Details
                  </button>
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
