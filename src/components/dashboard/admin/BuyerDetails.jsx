import { useContext, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaEnvelope, FaPhone, FaStar } from "react-icons/fa";
import ThemeContext from "../../Context/ThemeContext";

const BuyerDetails = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    // will have to place API in the place of hard-coded data->
    //     fetch("/api/buyers") // 🔁 Replace with your real backend API
    //       .then((res) => res.json())
    //       .then((data) => setBuyers(data))
    //       .catch((err) => console.error("Error fetching buyers:", err));
    //   }, []);

    // 👇 Hardcoded buyers data for now->
    const mockBuyers = [
      {
        _id: "123",
        name: "John Doe",
        email: "john@example.com",
        contact: "1234567890",
        auctionsParticipated: ["Antique Clock", "Rare Painting"],
        bidsWon: ["Vintage Lamp"],
        payments: [
          { item: "Vintage Lamp", status: "done" },
          { item: "Antique Clock", status: "pending" },
        ],
        rating: 4,
        itemsSold: [
          { productName: "Old Radio" },
          { productName: "Classic Guitar" },
        ],
      },
      {
        _id: "1",
        name: "Alice Smith",
        email: "alice@example.com",
        contact: "9876543210",
        auctionsParticipated: ["Vintage Car", "Antique Vase"],
        bidsWon: ["Antique Vase"],
        payments: [
          { item: "Antique Vase", status: "done" },
          { item: "Vintage Car", status: "pending" },
        ],
        rating: 5,
        itemsSold: [
          { productName: "Old Coins" },
          { productName: "Historic Book" },
        ],
      },
      {
        _id: "2",
        name: "Bob Johnson",
        email: "bob@example.com",
        contact: "9123456780",
        auctionsParticipated: ["Classic Watch", "Rare Stamp"],
        bidsWon: [],
        payments: [],
        rating: 3,
        itemsSold: [],
      },
      {
        _id: "3",
        name: "Carla Davis",
        email: "carla@example.com",
        contact: "9988776655",
        auctionsParticipated: ["Antique Mirror", "Gold Necklace"],
        bidsWon: ["Gold Necklace"],
        payments: [{ item: "Gold Necklace", status: "done" }],
        rating: 4,
        itemsSold: [{ productName: "Jewelry Box" }],
      },
      {
        _id: "4",
        name: "David Lee",
        email: "david@example.com",
        contact: "8877665544",
        auctionsParticipated: ["Art Sculpture", "Painting"],
        bidsWon: ["Painting"],
        payments: [{ item: "Painting", status: "done" }],
        rating: 5,
        itemsSold: [{ productName: "Mini Statue" }],
      },
      {
        _id: "5",
        name: "Eva Miller",
        email: "eva@example.com",
        contact: "9001122334",
        auctionsParticipated: ["Ancient Coin", "Retro Bike"],
        bidsWon: ["Ancient Coin"],
        payments: [{ item: "Ancient Coin", status: "pending" }],
        rating: 2,
        itemsSold: [],
      },
      {
        _id: "6",
        name: "Franklin Moore",
        email: "franklin@example.com",
        contact: "9112233445",
        auctionsParticipated: ["Vintage Camera", "Rare Pen"],
        bidsWon: ["Vintage Camera", "Rare Pen"],
        payments: [
          { item: "Vintage Camera", status: "done" },
          { item: "Rare Pen", status: "done" },
        ],
        rating: 4,
        itemsSold: [{ productName: "Classic Pen Set" }],
      },
      {
        _id: "7",
        name: "Grace Wilson",
        email: "grace@example.com",
        contact: "9334455667",
        auctionsParticipated: ["Old Comic", "Music Album"],
        bidsWon: ["Music Album"],
        payments: [{ item: "Music Album", status: "done" }],
        rating: 5,
        itemsSold: [
          { productName: "Vinyl Record" },
          { productName: "Cassette Player" },
        ],
      },
      {
        _id: "8",
        name: "Henry Brown",
        email: "henry@example.com",
        contact: "9223344556",
        auctionsParticipated: ["Antique Phone", "Wooden Table"],
        bidsWon: ["Wooden Table"],
        payments: [{ item: "Wooden Table", status: "pending" }],
        rating: 3,
        itemsSold: [],
      },
      {
        _id: "9",
        name: "Ivy Clark",
        email: "ivy@example.com",
        contact: "9445566778",
        auctionsParticipated: ["Silk Painting", "Crystal Vase"],
        bidsWon: ["Crystal Vase"],
        payments: [{ item: "Crystal Vase", status: "done" }],
        rating: 4,
        itemsSold: [{ productName: "Decorative Plate" }],
      },
      {
        _id: "10",
        name: "Jack Turner",
        email: "jack@example.com",
        contact: "9667788990",
        auctionsParticipated: ["Porcelain Doll", "Marble Clock"],
        bidsWon: ["Marble Clock"],
        payments: [{ item: "Marble Clock", status: "done" }],
        rating: 5,
        itemsSold: [
          { productName: "Porcelain Bowl" },
          { productName: "Glass Figurine" },
        ],
      },
    ];

    setBuyers(mockBuyers);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-50 py-10 px-4 md:px-8">
      {/* <h2 className="text-4xl font-bold text-center text-purple-800 mb-10">
        Buyer Details
      </h2> */}
      <h2
        className={`${
          isDarkMode
            ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800"
            : "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"
        }`}
      >
        Buyer Details
      </h2>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {buyers.map((buyer) => (
          <div
            key={buyer._id}
            className="bg-white shadow-xl rounded-2xl p-6 border border-purple-200 hover:shadow-purple-300 transition duration-300"
            data-aos="fade-up"
          >
            <h3 className="text-2xl font-semibold text-purple-700 mb-2">
              {buyer.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FaEnvelope className="text-purple-500" /> {buyer.email}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2 mb-4">
              <FaPhone className="text-purple-500" /> {buyer.contact}
            </p>

            {/* buying details of the user */}
            <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              {/* Auctions Participated */}
              <div className="mb-3">
                <h4 className="font-medium text-purple-600 mb-1">
                  Participated Auctions:
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {buyer.auctionsParticipated?.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>

              {/* Bidding Won */}
              <div className="mb-3">
                <h4 className="font-medium text-purple-600 mb-1">Bids Won:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {buyer.bidsWon?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Payment Status */}
              <div className="mb-3">
                <h4 className="font-medium text-purple-600 mb-1">
                  Payment Status:
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {buyer.payments?.map((payment, idx) => (
                    <li
                      key={idx}
                      className={`${
                        payment.status === "done"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {payment.item} - {payment.status}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Seller Ratings */}
              <div className="mb-3">
                <h4 className="font-medium text-purple-600 mb-1">
                  Seller Ratings:
                </h4>
                <div className="flex items-center gap-2">
                  {[...Array(buyer.rating || 0)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Items Sold */}
              <div>
                <h4 className="font-medium text-purple-600 mb-1">
                  Items Sold:
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {buyer.itemsSold?.map((item, idx) => (
                    <li key={idx}>{item.productName}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDetails;
