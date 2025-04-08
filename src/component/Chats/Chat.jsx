
import { useState, useEffect, useRef, useContext } from "react"
import ChatSidebar from "./ChatSidebar"
import io from "socket.io-client"
import axios from "axios"
import auth from "../../firebase/firebase.init"
import { useLocation } from "react-router-dom"
import ThemeContext from "../Context/ThemeContext"
import { ArrowLeft, Send } from "lucide-react"

export default function Chat() {
  const socketRef = useRef(null)
  const [socketConnected, setSocketConnected] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)
  const location = useLocation()
  const [connectionError, setConnectionError] = useState(null)
  const [unreadMessages, setUnreadMessages] = useState({})
  const [isPageVisible, setIsPageVisible] = useState(true)
  const { isDarkMode } = useContext(ThemeContext)
  const [recentMessages, setRecentMessages] = useState({})
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null)
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserRole, setCurrentUserRole] = useState("buyer")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser
      if (user) {
        setCurrentUser(user)
        try {
          const userResponse = await axios.get(`http://localhost:5000/user/${user.email}`, {
            withCredentials: true,
          })
          setCurrentUserRole(userResponse.data.role || "buyer")

          const usersResponse = await axios.get("http://localhost:5000/users", {
            withCredentials: true,
          })
          setUsers(usersResponse.data.filter((u) => u.email !== user.email))
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    fetchUserData()
  }, [])

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

    const socket = socketRef.current

    socket.on("connect", () => {
      setSocketConnected(true)
      setConnectionError(null)

      const user = auth.currentUser
      const storedUser = JSON.parse(localStorage.getItem("selectedUser"))

      if (user && storedUser) {
        const chatRoomId = [user.email, storedUser.email].sort().join("_")
        socket.emit("joinChat", {
          userId: user.email,
          selectedUserId: storedUser.email,
          roomId: chatRoomId,
        })
      }
    })

    socket.on("connect_error", (error) => {
      setSocketConnected(false)
      setConnectionError(`Connection error: ${error.message}`)
    })

    socket.on("disconnect", (reason) => {
      setSocketConnected(false)
      if (reason === "io server disconnect") {
        socket.connect()
      }
    })

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible"
      setIsPageVisible(isVisible)

      if (isVisible && selectedUser) {
        refreshMessages(selectedUser)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      if (socketRef.current) {
        socket.off("connect")
        socket.off("connect_error")
        socket.off("disconnect")
      }
    }
  }, [])

  useEffect(() => {
    const fetchRecentMessages = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        const response = await axios.get(`http://localhost:5000/recent-messages/${user.email}`, {
          withCredentials: true,
        })

        const recentMessagesMap = response.data.reduce((acc, { userEmail, lastMessage }) => {
          acc[userEmail] = lastMessage
          return acc
        }, {})

        setRecentMessages(recentMessagesMap)
      } catch (error) {
        console.error("Error fetching recent messages:", error)
      }
    }

    fetchRecentMessages()
  }, [])

  const refreshMessages = async (user) => {
    const currentUser = auth.currentUser
    if (!currentUser || !user) return

    try {
      const since = lastMessageTimestamp ? new Date(lastMessageTimestamp).toISOString() : null
      const url = `http://localhost:5000/messages/email/${currentUser.email}/${user.email}${
        since ? `?since=${since}` : ""
      }`

      const response = await axios.get(url, {
        withCredentials: true,
      })

      if (response.data.length > 0) {
        const fetchedMessages = response.data.map((msg) => ({
          ...msg,
          sent: msg.senderId === currentUser.email,
        }))

        setMessages((prevMessages) => {
          const messageIds = new Set(prevMessages.map((msg) => msg.messageId))
          const newMessages = fetchedMessages.filter((msg) => !messageIds.has(msg.messageId))
          return [...prevMessages, ...newMessages]
        })

        const latestMessage = response.data.reduce((latest, msg) => {
          const msgTime = new Date(msg.createdAt).getTime()
          return msgTime > latest ? msgTime : latest
        }, lastMessageTimestamp || 0)
        setLastMessageTimestamp(latestMessage)
      }
    } catch (error) {
      console.error("Error refreshing messages:", error)
    }
  }

  useEffect(() => {
    const { selectedUser: preSelectedUser } = location.state || {}
    const storedUser = JSON.parse(localStorage.getItem("selectedUser"))

    if (preSelectedUser) {
      setSelectedUser(preSelectedUser)
      localStorage.setItem("selectedUser", JSON.stringify(preSelectedUser))
    } else if (storedUser && !selectedUser) {
      setSelectedUser(storedUser)
    }
  }, [location.state])

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser))
    }
  }, [selectedUser])

  useEffect(() => {
    const user = auth.currentUser
    if (!user || !socketRef.current) return

    const socket = socketRef.current

    const handleGlobalMessage = (message) => {
      const otherUserId = message.senderId === user.email ? message.receiverId : message.senderId

      setRecentMessages((prev) => ({
        ...prev,
        [otherUserId]: message,
      }))

      if (message.receiverId === user.email) {
        if (selectedUser && message.senderId === selectedUser.email) {
          setMessages((prev) => {
            const messageExists = prev.some((msg) => msg.messageId === message.messageId)
            if (messageExists) return prev
            return [...prev, { ...message, sent: false }]
          })

          const msgTime = new Date(message.createdAt).getTime()
          if (!lastMessageTimestamp || msgTime > lastMessageTimestamp) {
            setLastMessageTimestamp(msgTime)
          }
        } else {
          setUnreadMessages((prev) => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
          }))

          if (!isPageVisible) {
            showNotification(message)
          }
        }
      }
    }

    socket.on("receiveMessage", handleGlobalMessage)

    return () => {
      socket.off("receiveMessage", handleGlobalMessage)
    }
  }, [selectedUser, isPageVisible, lastMessageTimestamp])

  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const sender = message.senderId.split("@")[0]
      new Notification("New Message", {
        body: `${sender}: ${message.text.substring(0, 50)}${message.text.length > 50 ? "..." : ""}`,
      })
    }
  }

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const user = auth.currentUser
    if (!user || !selectedUser || !socketRef.current) return

    const socket = socketRef.current

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/messages/email/${user.email}/${selectedUser.email}`, {
          withCredentials: true,
        })

        const fetchedMessages = response.data.map((msg) => ({
          ...msg,
          sent: msg.senderId === user.email,
        }))

        setMessages(fetchedMessages)

        if (fetchedMessages.length > 0) {
          const latestMessage = fetchedMessages.reduce((latest, msg) => {
            const msgTime = new Date(msg.createdAt).getTime()
            return msgTime > latest ? msgTime : latest
          }, 0)
          setLastMessageTimestamp(latestMessage)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()

    socket.emit("leaveAllRooms")

    const chatRoomId = [user.email, selectedUser.email].sort().join("_")
    socket.emit("joinChat", {
      userId: user.email,
      selectedUserId: selectedUser.email,
      roomId: chatRoomId,
    })

    setUnreadMessages((prev) => ({
      ...prev,
      [selectedUser.email]: 0,
    }))

    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping")
      }
    }, 30000)

    return () => {
      clearInterval(pingInterval)
    }
  }, [selectedUser])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    const user = auth.currentUser
    if (!newMessage.trim() || !selectedUser || !user) return

    if (!socketRef.current || !socketConnected) {
      console.error("Socket not connected. Cannot send message.")
      if (socketRef.current) {
        socketRef.current.connect()
      }
      return
    }

    const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    const messageData = {
      messageId: tempMessageId,
      senderId: user.email,
      receiverId: selectedUser.email,
      text: newMessage,
      createdAt: new Date(),
      roomId: [user.email, selectedUser.email].sort().join("_"),
    }

    setMessages((prev) => [...prev, { ...messageData, sent: true }])

    setRecentMessages((prev) => ({
      ...prev,
      [selectedUser.email]: messageData,
    }))

    const msgTime = new Date(messageData.createdAt).getTime()
    if (!lastMessageTimestamp || msgTime > lastMessageTimestamp) {
      setLastMessageTimestamp(msgTime)
    }

    socketRef.current.emit("sendMessage", messageData, (acknowledgement) => {
      if (!acknowledgement || !acknowledgement.success) {
        console.error("Failed to send message:", acknowledgement?.error || "Unknown error")
      } else {
        setMessages((prev) =>
          prev.map((msg) => (msg.messageId === tempMessageId ? { ...msg, messageId: acknowledgement.messageId } : msg)),
        )

        setRecentMessages((prev) => {
          if (prev[selectedUser.email]?.messageId === tempMessageId) {
            return {
              ...prev,
              [selectedUser.email]: {
                ...prev[selectedUser.email],
                messageId: acknowledgement.messageId,
              },
            }
          }
          return prev
        })
      }
    })

    setNewMessage("")
  }

  const getUserRole = (user) => {
    if (!user) return "User"

    if (user.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1)
    }

    const userEmail = user.email
    const foundUser = users.find((u) => u.email === userEmail)
    if (foundUser && foundUser.role) {
      return foundUser.role.charAt(0).toUpperCase() + foundUser.role.slice(1)
    }

    return "User"
  }

  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return isDarkMode ? "bg-red-700 text-white" : "bg-red-500 text-white"
      case "seller":
        return isDarkMode ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
      case "buyer":
        return isDarkMode ? "bg-yellow-600 text-black" : "bg-yellow-500 text-black"
      default:
        return isDarkMode ? "bg-gray-700 text-white" : "bg-gray-500 text-white"
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setUnreadMessages((prev) => ({
      ...prev,
      [user.email]: 0,
    }))
  }

  const handleBackToSidebar = () => {
    setSelectedUser(null)
  }

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile when a chat is selected */}
        <div className={`${isMobile && selectedUser ? "hidden" : "block"} ${isMobile ? "w-full" : "w-80"}`}>
          <ChatSidebar
            isDarkMode={isDarkMode}
            onSelectUser={handleSelectUser}
            unreadMessages={unreadMessages}
            selectedUserEmail={selectedUser?.email}
            recentMessages={recentMessages}
          />
        </div>

        {/* Chat area - full width on mobile when a chat is selected */}
        <div className={`flex-1 flex flex-col ${isMobile && !selectedUser ? "hidden" : "block"}`}>
          {/* Connection status indicator */}
          {!socketConnected && (
            <div className="bg-red-500 text-white p-2 text-center text-sm">
              {connectionError || "Disconnected from chat server. Trying to reconnect..."}
            </div>
          )}

          {selectedUser ? (
            <>
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex sticky  justify-between items-center">
                  <div className="flex items-center">
                    {/* Back button for mobile */}
                    {isMobile && (
                      <button
                        onClick={handleBackToSidebar}
                        className="mr-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                    )}

                    {/* User photo */}
                    <div className="mr-3">
                      {selectedUser.photo ? (
                        <img
                          src={selectedUser.photo || "/placeholder.svg"}
                          alt={selectedUser.name || "User"}
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
                          {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>

                  {/* User role badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      getUserRole(selectedUser),
                    )}`}
                  >
                    {getUserRole(selectedUser)}
                  </span>
                </div>

                <div className="flex items-center mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${socketConnected ? "bg-green-500" : "bg-red-500"} mr-2`}
                  ></span>
                  <span className="text-xs text-gray-500">{socketConnected ? "Online" : "Offline"}</span>
                </div>
              </div>

              <div className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div
                        key={message.messageId || index}
                        className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
                      >
                        {/* Show user avatar for received messages */}
                        {!message.sent && (
                          <div className="flex-shrink-0 mr-2">
                            {selectedUser.photoURL ? (
                              <img
                                src={selectedUser.photoURL || "/placeholder.svg"}
                                alt={selectedUser.name || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "https://via.placeholder.com/32?text=User"
                                }}
                              />
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                }`}
                              >
                                {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                        )}

                        <div
                          className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                            message.sent
                              ? isDarkMode
                                ? "bg-purple-600 text-white"
                                : "bg-purple-500 text-white"
                              : isDarkMode
                                ? "bg-gray-700 text-gray-200"
                                : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isDarkMode ? "text-gray-300" : message.sent ? "text-purple-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* Show current user avatar for sent messages */}
                        {message.sent && currentUser && (
                          <div className="flex-shrink-0 ml-2">
                            {currentUser.photoURL ? (
                              <img
                                src={currentUser.photoURL || "/placeholder.svg"}
                                alt="You"
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "https://via.placeholder.com/32?text=You"
                                }}
                              />
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                  isDarkMode ? "bg-purple-700" : "bg-purple-200"
                                }`}
                              >
                                {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "Y"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No messages yet. Start the conversation!
                    </p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div
                className={`p-4 border-t ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type something..."
                    className={`flex-1 p-3 rounded-l-lg focus:outline-none ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    } border`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage()
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!socketConnected}
                    className={`p-3 rounded-r-lg ${
                      isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"
                    } text-white ${!socketConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className={`flex-1 flex items-center justify-center ${isDarkMode ? "text-gray-400" : "text-gray-500"} ${isMobile ? "hidden" : "flex"}`}
            >
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
