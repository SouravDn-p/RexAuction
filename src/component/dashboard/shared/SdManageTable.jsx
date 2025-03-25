import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
} from "react-icons/fa";

function ManageTable() {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("startTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: auctionsData = { auctions: [], totalCount: 0 },
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "auctionData",
      currentPage,
      sortField,
      sortDirection,
      searchTerm,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get("/auctions", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          sort: sortField,
          order: sortDirection,
          search: searchTerm,
        },
      });
      return res.data || { auctions: [], totalCount: 0 };
    },
  });

  const auctions = auctionsData.auctions || [];
  const totalPages = Math.ceil((auctionsData.totalCount || 0) / itemsPerPage);

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="inline ml-1" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 text-white flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-gray-900 text-white">
        <div className="bg-red-900 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold">Error loading auctions</h2>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Manage Auctions</h2>

      {/* Search and filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left rounded-tl-lg">Image</th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Auction Name {getSortIcon("name")}
                  </th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    Category {getSortIcon("category")}
                  </th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => handleSort("startingPrice")}
                  >
                    Starting Price {getSortIcon("startingPrice")}
                  </th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => handleSort("startTime")}
                  >
                    Start Time {getSortIcon("startTime")}
                  </th>
                  <th
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th className="py-3 px-6 text-left">User Email</th>
                  <th className="py-3 px-6 text-left rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {auctions.map((auction) => (
                  <tr
                    key={auction._id}
                    className="hover:bg-gray-600 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <img
                        src={auction.images?.[0] || "/placeholder.svg"}
                        alt={auction.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-4 px-6">{auction.name}</td>
                    <td className="py-4 px-6">{auction.category}</td>
                    <td className="py-4 px-6">${auction.startingPrice}</td>
                    <td className="py-4 px-6">
                      {new Date(auction.startTime).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          auction.status === "Accepted"
                            ? "bg-green-900 text-green-300"
                            : auction.status === "Rejected"
                            ? "bg-red-900 text-red-300"
                            : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {auction.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">{auction.sellerEmail}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-4">
                        {/* Accept Button */}
                        <button
                          onClick={() =>
                            updateAuctionStatus(auction._id, "Accepted")
                          }
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
                          onClick={() =>
                            updateAuctionStatus(auction._id, "Rejected")
                          }
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {[...Array(totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => setCurrentPage(page + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManageTable;
