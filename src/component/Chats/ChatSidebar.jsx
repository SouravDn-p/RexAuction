"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import auth from "../../firebase/firebase.init"

export default function ChatSidebar({ isDarkMode, onSelectUser, unreadMessages = {}, selectedUserEmail }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          withCredentials: true,
        })

        // Filter out the current user
        const currentUser = auth.currentUser
        const filteredUsers = response.data.filter((user) => user.email !== currentUser?.email)

        setUsers(filteredUsers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div
      className={`w-80 border-r ${
        isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"
      } overflow-y-auto`}
    >
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 rounded-md ${
            isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-800"
          } border`}
        />
      </div>

      <div className="divide-y">
        {loading ? (
          <div className="p-4 text-center">Loading users...</div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id || user.email}
              onClick={() => onSelectUser(user)}
              className={`p-4 cursor-pointer hover:bg-opacity-10 ${
                selectedUserEmail === user.email ? (isDarkMode ? "bg-purple-900 bg-opacity-30" : "bg-purple-100") : ""
              } ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <div className="flex items-center">
                <div className="relative">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL || "/placeholder.svg"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/40"
                      }}
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                    </div>
                  )}

                  {/* Unread message indicator */}
                  {unreadMessages[user.email] > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessages[user.email] > 9 ? "9+" : unreadMessages[user.email]}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{user.name || "No name"}</p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center">No users found</div>
        )}
      </div>
    </div>
  )
}

