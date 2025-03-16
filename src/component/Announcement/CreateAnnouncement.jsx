import React, { useEffect, useState } from "react";
import "./CreateAnnouncement.css";
import { Link } from "react-router-dom";

const CreateAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        //this will be replaced with actual API call later
        const data = [
          {
            id: 1,
            image:
              "https://images.unsplash.com/photo-1567427678698-2ac8defd07e3?w=600&auto=format&fit=crop&q=60",
            date: "March 15, 2025",
            title: "Exclusive Art Auction Coming Soon",
            description:
              "Get ready for our upcoming auction featuring rare art pieces from global artists. Don't miss this unique opportunity.",
          },
          {
            id: 2,
            image:
              "https://images.unsplash.com/photo-1729513393810-6cc8382e5b76?w=500&auto=format&fit=crop&q=60",
            date: "March 12, 2025",
            title: "Luxury Car Bidding Opens Next Week",
            description:
              "High-end cars will be available for bidding soon. Stay tuned for more details and get ready to place your bids!",
          },
          {
            id: 3,
            image:
              "https://images.unsplash.com/photo-1623503664086-475867ec20b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VmludGFnZSUyMENvbGxlY3RpYmxlcyUyMEF1Y3Rpb24lMjBBbGVydHxlbnwwfHwwfHx8MA%3D%3D",
            date: "March 10, 2025",
            title: "Vintage Collectibles Auction Alert",
            description:
              "From rare coins to antique gadgets, explore vintage collectibles and bid on your favorite items.",
          },
          {
            id: 4,
            image:
              "https://images.unsplash.com/photo-1562123406-5920f76f9be9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QW50aXF1ZSUyMEZ1cm5pdHVyZSUyMENvbGxlY3Rpb24lMjBCaWRkaW5nfGVufDB8fDB8fHww",
            date: "March 8, 2025",
            title: "Antique Furniture Collection Bidding",
            description:
              "Elegant and historical furniture pieces will be up for grabs. A must-see for collectors!",
          },
          {
            id: 5,
            image:
              "https://images.unsplash.com/photo-1551346261-e19dd7ae9587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8SmV3ZWxyeSUyMEF1Y3Rpb24lMjBFdmVudHxlbnwwfHwwfHx8MA%3D%3D",
            date: "March 5, 2025",
            title: "Jewelry Auction Event",
            description:
              "Bid on a stunning selection of fine jewelry. Diamonds, gold, and luxury watches await.",
          },
          {
            id: 6,
            image:
              "https://plus.unsplash.com/premium_photo-1664391984273-bcc6ee7dbdc1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGl0bGUlM0ElMjAlMjJUZWNoJTIwR2FkZ2V0cyUyMEJpZGRpbmclMjBCb25hbnphJTIyJTJDfGVufDB8fDB8fHww",
            date: "March 3, 2025",
            title: "Tech Gadgets Bidding Bonanza",
            description:
              "Latest gadgets and electronics will be available in our next auction event. Don’t miss out.",
          },
        ];

        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="px-4 md:px-16 py-10 bg-purple-50 min-h-screen">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-purple-800 mb-2 text-center">
        🗞 Announcements
      </h1>
      <p className="text-center text-slate-600 mb-10 max-w-xl mx-auto">
        Stay updated with the latest news and upcoming bidding events from
        <strong> RexAuction</strong>. Explore exciting opportunities!
      </p>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <input
          type="text"
          placeholder="Search announcements..."
          className="w-full md:w-1/2 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
        />
        <select className="w-full md:w-1/4 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm">
          <option>All Categories</option>
          <option>According to Country</option>
          <option>According to Value</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {announcements.map((item) => (
          <div key={item.id} className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front */}
              <div className="card-flip-front bg-white border border-purple-200 rounded-xl overflow-hidden shadow-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-purple-500 mb-1">{item.date}</p>
                  <h2 className="text-lg font-bold text-purple-800 mb-2">
                    {item.title}
                  </h2>
                </div>
              </div>
              {/* Back */}
              <div className="card-flip-back bg-purple-100 border border-purple-200 rounded-xl p-4 flex flex-col justify-between shadow-md">
                <p className="text-sm text-purple-700">{item.description}</p>
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700 transition">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Button */}
      <div className="mt-12 flex justify-center">
        <Link to="/create_announcement">
          <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl animate-bounce-slow">
            ➕ Create Announcement
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
