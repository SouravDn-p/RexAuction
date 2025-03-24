import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ManageCard() {
    const { dbUser } = useAuth();
    const email = dbUser?.email; // Ensure dbUser is available
    console.log(email);

    const axiosSecure = useAxiosSecure();

    // Fetch data filtered by email
    const { data: auctions = [], refetch } = useQuery({
        queryKey: ["auctionData", email],
        queryFn: async () => {
            if (!email) return [];
            const res = await axiosSecure.get(`/auctions/${email}`);
            return res.data || [];
        },
        enabled: !!email,
    });

    // console.log(auctions);

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Render your data here */}
            {auctions.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">No data available</p>
            ) : (
                auctions.map((auction) => (
                    <div
                        key={auction._id}
                        className="bg-white shadow-lg rounded-2xl overflow-hidden p-6 flex flex-col justify-between transition-transform transform hover:scale-105"
                    >
                        {/* Image Section */}
                        <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                            <img
                                src={auction.images[0]} // Use the first image in the array
                                alt={auction.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold mb-2 text-gray-800">{auction.title}</h2>
                            <p className="text-gray-600 mb-4">{auction.description}</p>
                            <div className="flex flex-col space-y-2 text-sm text-gray-600">
                                <p>
                                    <span className="font-semibold">Category:</span> {auction.category}
                                </p>
                                <p>
                                    <span className="font-semibold">Starting Price:</span> ${auction.startingPrice}
                                </p>
                                <p>
                                    <span className="font-semibold">Start Time:</span>{" "}
                                    {new Date(auction.startTime).toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-semibold">End Time:</span>{" "}
                                    {new Date(auction.endTime).toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span
                                        className={`${auction.status === "Rejected" ? "text-red-500" : "text-green-500"}`}
                                    >
                                        {auction.status}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex justify-between mt-6">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                Update
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}