"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import auth from "../../firebase/firebase.init"
import io from "socket.io-client"

export default function ChatSidebar({
  isDarkMode,
  onSelectUser,
  unreadMessages = {},
  selectedUserEmail,
  recentMessages = {},
}) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const socketRef = useRef(null)

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      })
    }

    const fetchUsers = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) return

        setLoading(true)

        const usersResponse = await axios.get("http://localhost:5000/users", {
          withCredentials: true,
        })

        const filteredUsers = usersResponse.data.filter((user) => user.email !== currentUser.email)

        setUsers(filteredUsers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchUsers()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!users.length) return

    setUsers((prevUsers) => {
      const sortedUsers = [...prevUsers].sort((a, b) => {
        const lastMessageA = recentMessages[a.email]
        const lastMessageB = recentMessages[b.email]

        const hasUnreadA = unreadMessages[a.email] > 0
        const hasUnreadB = unreadMessages[b.email] > 0

        if (hasUnreadA && !hasUnreadB) return -1
        if (!hasUnreadA && hasUnreadB) return 1

        const timestampA = lastMessageA ? new Date(lastMessageA.createdAt).getTime() : 0
        const timestampB = lastMessageB ? new Date(lastMessageB.createdAt).getTime() : 0

        return timestampB - timestampA
      })

      return sortedUsers
    })
  }, [recentMessages, unreadMessages, users])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div
      className={`h-full border-r ${
        isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"
      } overflow-y-auto w-full md:w-80`}
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
          filteredUsers.map((user) => {
            const lastMessage = recentMessages[user.email]
            const messageSnippet = lastMessage
              ? lastMessage.text.length > 20
                ? `${lastMessage.text.substring(0, 20)}...`
                : lastMessage.text
              : "No messages yet"

            return (
              <div
                key={user._id || user.email}
                onClick={() => onSelectUser(user)}
                className={`p-4 cursor-pointer hover:bg-opacity-10 ${
                  selectedUserEmail === user.email ? (isDarkMode ? "bg-purple-900 bg-opacity-30" : "bg-purple-100") : ""
                } ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    {user.photo ? (
                      <img
                        src={user.photo || "/placeholder.svg"}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://via.placeholder.com/40?text=User"
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

                    {unreadMessages[user.email] > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessages[user.email] > 9 ? "9+" : unreadMessages[user.email]}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{user.name || "No name"}</p>
                      {lastMessage && (
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                    <p
                      className={`text-sm truncate ${
                        unreadMessages[user.email] > 0
                          ? "font-semibold text-purple-500"
                          : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                    >
                      {messageSnippet}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-4 text-center">No users found</div>
        )}
      </div>
    </div>
  )
}
