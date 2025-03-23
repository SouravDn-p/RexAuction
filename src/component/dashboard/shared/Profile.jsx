"use client"

import { useState } from "react"

// JSON data for dynamic content
const profileData = {
  user: {
    name: "Sourav Debnath",
    location: "Dhaka, BD",
    memberSince: "2024",
    profilePicture: "https://i.ibb.co/BmxHqZm/Screenshot-2025-03-23-164850.png",
    coverImage: "https://i.ibb.co/HDLKt1VF/Green-and-Purple-Line-Tech-Action-Adventure-Facebook-Cover-1.jpg",
  },
  stats: {
    auctionsWon: 127,
    activeBids: 15,
    successRate: "94%",
    totalSpent: "$45,280",
  },
  accountBalance: "$12,450",
  paymentMethods: [
    { id: 1, cardNumber: "•••• 4385", provider: "Visa" },
    { id: 2, cardNumber: "•••• 1234", provider: "Mastercard" },
  ],
  recentActivity: [
    {
      id: 1,
      item: "Vintage Rolex Submariner",
      price: "$8,500",
      time: "1 hour ago",
      status: "Won",
      image: "https://i.ibb.co.com/gZ2qhXjs/images-1.jpg",
    },
    {
      id: 2,
      item: "Nike Air Jordan 1 Retro",
      price: "$2,800",
      time: "3 hours ago",
      status: "Active",
      image: "https://i.ibb.co.com/V0Yxw7Mg/download.jpg",
    },
    {
      id: 3,
      item: "Leica M6 Classic",
      price: "$4,200",
      time: "6 hours ago",
      status: "Outbid",
      image: "https://i.ibb.co.com/N6rH502K/download-1.jpg",
    },
  ],
  watchingNow: [
    {
      id: 1,
      item: "Antique Pocket Watch",
      timeLeft: "3h 25m",
      image: "https://i.ibb.co.com/KSCtW5n/download-2.jpg",
    },
    {
      id: 2,
      item: "Art Deco Vase",
      timeLeft: "2d 4h",
      image: "https://i.ibb.co.com/60Q0GGYP/download-3.jpg",
    },
    {
      id: 3,
      item: "Vintage Camera",
      timeLeft: "5d 12h",
      image: "https://i.ibb.co.com/RGwFXk1S/download-4.jpg",
    },
  ],
  biddingHistory: [
    {
      id: 1,
      item: "Vintage Rolex Submariner",
      auction: "Luxury Watches",
      bidAmount: "$8,500",
      date: "Jan 15, 2024",
      status: "Won",
    },
    {
      id: 2,
      item: "Nike Air Jordan 1 Retro",
      auction: "Rare Sneakers",
      bidAmount: "$2,800",
      date: "Jan 14, 2024",
      status: "Active",
    },
    {
      id: 3,
      item: "Leica M6 Classic",
      auction: "Vintage Cameras",
      bidAmount: "$4,200",
      date: "Jan 13, 2024",
      status: "Outbid",
    },
    {
      id: 4,
      item: "Art Deco Vase",
      auction: "Antique Collection",
      bidAmount: "$1,900",
      date: "Jan 12, 2024",
      status: "Won",
    },
  ],
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("All")

  // Function to render status badge with appropriate styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Won":
        return <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-md">Won</span>
      case "Active":
        return <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-md">Active</span>
      case "Outbid":
        return <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-md text-black bg-white">Outbid</span>
      default:
        return (
          <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-md text-black bg-white">{status}</span>
        )
    }
  }

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Profile Banner */}
      <div
        className="relative h-[200px] bg-cover bg-center"
        style={{
          backgroundImage: `url('${profileData.user.coverImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <button className="absolute right-4 top-4 bg-white text-black hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Edit Cover
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-6">
        <div className="flex flex-col md:flex-row items-center gap-6 -mt-16 mb-6">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
              <img
                src={profileData.user.profilePicture || "/placeholder.svg"}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div>
          {/* Profile Information */}
          <div className="lg:text-left text-center">
            <h1 className="text-2xl font-bold text-black">{profileData.user.name}</h1>
            <p className="text-gray-500">
              Location : {profileData.user.location} . Member since {profileData.user.memberSince}
            </p>
            <button className="px-3 py-1 mt-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-black bg-white">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid mt-5 grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{profileData.stats.auctionsWon}</div>
              <div className="text-sm text-black">Auctions Won</div>
            </div>
          </div>
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{profileData.stats.activeBids}</div>
              <div className="text-sm text-black">Active Bids</div>
            </div>
          </div>
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{profileData.stats.successRate}</div>
              <div className="text-sm text-black">Success Rate</div>
            </div>
          </div>
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{profileData.stats.totalSpent}</div>
              <div className="text-sm text-black">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Main Content here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Balance */}
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-base font-medium text-black">Account Balance</h2>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold mb-3 text-black">{profileData.accountBalance}</div>
                <button className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5v14m-7-7h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add Funds
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-base font-medium text-black">Payment Methods</h2>
              </div>
              <div className="p-4 space-y-3">
                {profileData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-2 border rounded-md bg-white">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="text-sm text-black">{method.cardNumber}</span>
                    </div>
                    <span className="text-xs border px-2 py-0.5 rounded-md text-black">{method.provider}</span>
                  </div>
                ))}
                <button className="w-full text-sm border border-gray-300 rounded-md py-1.5 hover:bg-gray-50 bg-white text-black">
                  Add New Card
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-base font-medium text-black">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {["All", "Bids", "Wins", "Watching"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`h-8 text-xs rounded-md ${
                        activeTab === tab
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border border-gray-300 hover:bg-gray-50 bg-white text-black"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {profileData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-md overflow-hidden border">
                        <img
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.item}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm font-medium text-black">{activity.item}</div>
                        <div className="text-sm text-black">
                          {activity.price} • {activity.time}
                        </div>
                      </div>
                      {renderStatusBadge(activity.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Watching Now */}
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-base font-medium text-black">Watching Now</h2>
              </div>
              <div className="p-4 space-y-3">
                {profileData.watchingNow.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-md overflow-hidden border">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.item}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">{item.item}</div>
                      <div className="text-xs text-black">{item.timeLeft}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bidding History */}
        <div className="bg-white border rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-base font-medium text-black">Bidding History</h2>
            <button className="h-8 px-2 text-black flex items-center text-sm bg-white">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 6h18M6 12h12M9 18h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Filter
            </button>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-black">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium text-black">Item</th>
                    <th className="pb-2 font-medium text-black">Auction</th>
                    <th className="pb-2 font-medium text-black">Bid Amount</th>
                    <th className="pb-2 font-medium text-black">Date</th>
                    <th className="pb-2 font-medium text-black">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.biddingHistory.map((bid) => (
                    <tr key={bid.id} className="border-b">
                      <td className="py-3 text-black">{bid.item}</td>
                      <td className="py-3 text-black">{bid.auction}</td>
                      <td className="py-3 text-black">{bid.bidAmount}</td>
                      <td className="py-3 text-black">{bid.date}</td>
                      <td className="py-3">{renderStatusBadge(bid.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between text-sm text-black mt-3">
                <div>Showing 1-{profileData.biddingHistory.length} of 127 items</div>
                <div className="flex items-center gap-2">
                  <button className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 bg-white text-black">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 bg-white text-black">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

