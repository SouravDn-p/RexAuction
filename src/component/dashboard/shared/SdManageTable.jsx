"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

function ManageTable() {
  const axiosSecure = useAxiosSecure();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        // Close the modal after successful update
        setIsModalOpen(false);
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

  const openDetailsModal = (auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Manage Auctions</h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">Photo</th>
              {/* <th className="py-3 px-6 text-left">Email</th> */}
              <th className="py-3 px-6 text-left">Auction Title</th>
              <th className="py-3 px-6 text-left">Start Time</th>
              <th className="py-3 px-6 text-left">End Time</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr
                key={auction?._id}
                className="hover:bg-gray-600 transition-colors"
              >
                <td><img src={auction?.images[0]} className="h-20 w-24 p-2 rounded" alt="" /></td>
                {/* <td className="py-4 px-6">{auction?.images || "N/A"}</td> */}
                {/* <td className="py-4 px-6">{auction?.sellerEmail}</td> */}
                <td className="py-4 px-6">{auction.name}</td>
                <td className="py-4 px-6">
                  {new Date(auction.startTime).toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  {new Date(auction.endTime).toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => openDetailsModal(auction)}
                    className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 text-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-700 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  Auction Details: {selectedAuction.name}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <img
                      src={selectedAuction.images?.[0] || "/placeholder.svg"}
                      alt={selectedAuction.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>

                  <div className="grid gap-2">
                    <p>
                      <span className="font-semibold">Category:</span>{" "}
                      {selectedAuction.category}
                    </p>
                    <p>
                      <span className="font-semibold">Starting Price:</span> $
                      {selectedAuction.startingPrice}
                    </p>
                    <p>
                      <span className="font-semibold">Current Status:</span>{" "}
                      {selectedAuction.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Seller Information
                    </h3>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {selectedAuction?.sellerDisplayName || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedAuction?.sellerEmail}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Auction Timing
                    </h3>
                    <p>
                      <span className="font-semibold">Start Time:</span>{" "}
                      {new Date(selectedAuction.startTime).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">End Time:</span>{" "}
                      {new Date(selectedAuction.endTime).toLocaleString()}
                    </p>
                  </div>

                  {selectedAuction.description && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Description
                      </h3>
                      <p className="text-gray-300">
                        {selectedAuction.description}
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <h3 className="font-semibold text-lg mb-2">Actions</h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          updateAuctionStatus(selectedAuction._id, "Accepted")
                        }
                        className={`px-4 py-2 rounded ${
                          selectedAuction.status === "Accepted"
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                        disabled={selectedAuction.status === "Accepted"}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          updateAuctionStatus(selectedAuction._id, "Rejected")
                        }
                        className={`px-4 py-2 rounded ${
                          selectedAuction.status === "Rejected"
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                        disabled={selectedAuction.status === "Rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTable;
