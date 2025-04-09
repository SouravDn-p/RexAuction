"use client"

import { useState, useEffect, useRef, useContext } from "react"
import ChatSidebar from "./ChatSidebar"
import io from "socket.io-client"
import axios from "axios"
import auth from "../../firebase/firebase.init"
import { useLocation } from "react-router-dom"
import ThemeContext from "../Context/ThemeContext"
import { ArrowLeft, Send, Smile, Paperclip, Mic, ImageIcon, MoreVertical, Search, Phone, Video } from "lucide-react"

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)

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
    setShowEmojiPicker(false)
    setShowAttachMenu(false)
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
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white"
      case "seller":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "buyer":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-black"
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

  // Mock emoji picker functionality
  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Sample emojis for the picker
  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "✨", "🙏", "👏", "🤔", "😍", "🥰", "😎", "🤩", "😇"]

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile when a chat is selected */}
        <div className={`${isMobile && selectedUser ? "hidden" : "block"} ${isMobile ? "w-full" : "w-80"} shadow-lg`}>
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
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 text-center text-sm font-medium animate-pulse">
              {connectionError || "Disconnected from chat server. Trying to reconnect..."}
            </div>
          )}

          {selectedUser ? (
            <>
              <div
                className={`border-b ${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 text-gray-200"
                    : "bg-gradient-to-r from-white to-gray-50 border-gray-200 text-gray-800"
                } shadow-sm`}
              >
                <div className="flex justify-between items-center p-4">
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
                    <div className="mr-3 relative">
                      {selectedUser.photo ? (
                        <img
                          src={selectedUser.photo || "/placeholder.svg"}
                          alt={selectedUser.name || "User"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=40&width=40&text=User"
                          }}
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold border-2 border-white shadow-md ${
                            isDarkMode
                              ? "bg-gradient-to-br from-gray-700 to-gray-800"
                              : "bg-gradient-to-br from-gray-100 to-gray-200"
                          }`}
                        >
                          {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "?"}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                          socketConnected ? "bg-green-500" : "bg-red-500"
                        } border-2 border-white`}
                      ></span>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                      <div className="flex items-center">
                        <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {selectedUser.email}
                        </span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            getUserRole(selectedUser),
                          )}`}
                        >
                          {getUserRole(selectedUser)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-3">
                    <button className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                      <Search className="h-5 w-5" />
                    </button>
                    <button className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                      <Video className="h-5 w-5" />
                    </button>
                    <button className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 overflow-y-auto p-4 ${
                  isDarkMode ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white"
                }`}
                style={{
                  backgroundImage: isDarkMode
                    ? "radial-gradient(circle at 25% 25%, rgba(74, 85, 104, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(74, 85, 104, 0.2) 0%, transparent 50%)"
                    : "radial-gradient(circle at 25% 25%, rgba(226, 232, 240, 0.5) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(226, 232, 240, 0.5) 0%, transparent 50%)",
                }}
              >
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.length > 0 ? (
                    messages.map((message, index) => {
                      // Check if this is the first message of a new day
                      const showDateSeparator =
                        index === 0 ||
                        new Date(message.createdAt).toDateString() !==
                          new Date(messages[index - 1].createdAt).toDateString()

                      return (
                        <div key={message.messageId || `msg-${index}`}>
                          {showDateSeparator && (
                            <div className="flex justify-center my-6">
                              <div
                                className={`px-4 py-1 rounded-full text-xs font-medium ${
                                  isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleDateString(undefined, {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          )}

                          <div className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
                            {/* Show user avatar for received messages */}
                            {!message.sent && (
                              <div className="flex-shrink-0 mr-2 self-end">
                                {selectedUser.photo ? (
                                  <img
                                    src={selectedUser.photo || "/placeholder.svg"}
                                    alt={selectedUser.name || "User"}
                                    className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = "/placeholder.svg?height=32&width=32&text=User"
                                    }}
                                  />
                                ) : (
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border border-white shadow-sm ${
                                      isDarkMode
                                        ? "bg-gradient-to-br from-gray-700 to-gray-800"
                                        : "bg-gradient-to-br from-gray-100 to-gray-200"
                                    }`}
                                  >
                                    {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "?"}
                                  </div>
                                )}
                              </div>
                            )}

                            <div
                              className={`max-w-xs md:max-w-md rounded-2xl p-3 shadow-sm ${
                                message.sent
                                  ? isDarkMode
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                    : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                  : isDarkMode
                                    ? "bg-gray-700 text-gray-200"
                                    : "bg-white text-gray-800 border border-gray-200"
                              }`}
                            >
                              <p className="leading-relaxed">{message.text}</p>
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
                              <div className="flex-shrink-0 ml-2 self-end">
                                {currentUser.photoURL ? (
                                  <img
                                    src={currentUser.photoURL || "/placeholder.svg"}
                                    alt="You"
                                    className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = "/placeholder.svg?height=32&width=32&text=You"
                                    }}
                                  />
                                ) : (
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border border-white shadow-sm ${
                                      isDarkMode
                                        ? "bg-gradient-to-br from-indigo-700 to-purple-700"
                                        : "bg-gradient-to-br from-indigo-100 to-purple-200"
                                    }`}
                                  >
                                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "Y"}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <Send className={`h-10 w-10 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                      </div>
                      <p
                        className={`text-center text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        No messages yet
                      </p>
                      <p className={`text-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Start the conversation with {selectedUser.name}!
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div
                className={`p-4 border-t ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                {/* Emoji picker */}
                {showEmojiPicker && (
                  <div
                    className={`p-2 mb-2 rounded-lg grid grid-cols-5 gap-2 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="text-xl hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Attachment menu */}
                {showAttachMenu && (
                  <div className={`p-2 mb-2 rounded-lg flex space-x-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                      <ImageIcon className="h-6 w-6 text-blue-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Paperclip className="h-6 w-6 text-green-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                      <Mic className="h-6 w-6 text-red-500" />
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className={`p-3 rounded-full ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className={`w-full p-3 pr-10 rounded-full focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                          : "bg-gray-100 border-gray-300 text-gray-800 focus:ring-purple-500"
                      } border`}
                    />

                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!socketConnected || !newMessage.trim()}
                    className={`p-3 rounded-full ${
                      !socketConnected || !newMessage.trim() ? "opacity-50 cursor-not-allowed" : ""
                    } ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    } text-white shadow-md`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                {/* Typing indicator (mock) */}
                {false && (
                  <div className="mt-2 flex items-center">
                    <div className="flex space-x-1 ml-2">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">User is typing...</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              className={`flex-1 flex flex-col items-center justify-center ${isDarkMode ? "text-gray-400" : "text-gray-500"} ${isMobile ? "hidden" : "flex"}`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <Send className={`h-10 w-10 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-center max-w-md">Select a conversation from the sidebar to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
