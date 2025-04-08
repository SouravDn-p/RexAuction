import { useState, useEffect, useRef, useContext } from "react";
import ChatSidebar from "./ChatSidebar";
import io from "socket.io-client";
import axios from "axios";
import auth from "../../firebase/firebase.init";
import { useLocation } from "react-router-dom";
import ThemeContext from "../Context/ThemeContext";

export default function Chat() {
  // Create socket ref to maintain connection across renders
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const [connectionError, setConnectionError] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isPageVisible, setIsPageVisible] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);
  const [currentUserRole, setCurrentUserRole] = useState("buyer");
  const [users, setUsers] = useState([]);

  // Fetch current user's role and all users
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Fetch current user's role
          const userResponse = await axios.get(
            `http://localhost:5000/users/email/${user.email}`,
            { withCredentials: true }
          );
          setCurrentUserRole(userResponse.data.role || "buyer");

          // Fetch all users
          const usersResponse = await axios.get(
            "http://localhost:5000/users",
            { withCredentials: true }
          );
          setUsers(usersResponse.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      console.log("Socket initialized");
    }

    const socket = socketRef.current;

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setSocketConnected(true);
      setConnectionError(null);

      const user = auth.currentUser;
      const storedUser = JSON.parse(localStorage.getItem("selectedUser"));

      if (user && storedUser) {
        const chatRoomId = [user.email, storedUser.email].sort().join("_");
        socket.emit("joinChat", {
          userId: user.email,
          selectedUserId: storedUser.email,
          roomId: chatRoomId,
        });
        console.log(`Rejoining chat room after reconnect: ${chatRoomId}`);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setSocketConnected(false);
      setConnectionError(`Connection error: ${error.message}`);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocketConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      setIsPageVisible(isVisible);

      if (isVisible && selectedUser) {
        refreshMessages(selectedUser);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (socketRef.current) {
        console.log("Cleaning up socket listeners");
        socket.off("connect");
        socket.off("connect_error");
        socket.off("disconnect");
      }
    };
  }, []);

  // Function to refresh messages
  const refreshMessages = async (user) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !user) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/messages/email/${currentUser.email}/${user.email}`,
        { withCredentials: true }
      );

      setMessages(
        response.data.map((msg) => ({
          ...msg,
          sent: msg.senderId === currentUser.email,
        }))
      );
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  };

  // Restore selectedUser from localStorage or navigation state on mount
  useEffect(() => {
    const { selectedUser: preSelectedUser } = location.state || {};
    const storedUser = JSON.parse(localStorage.getItem("selectedUser"));

    if (preSelectedUser) {
      setSelectedUser(preSelectedUser);
      localStorage.setItem("selectedUser", JSON.stringify(preSelectedUser));
    } else if (storedUser && !selectedUser) {
      setSelectedUser(storedUser);
    }
  }, [location.state]);

  // Save selectedUser to localStorage when it changes
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);

  // Handle incoming messages
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !socketRef.current) return;

    const socket = socketRef.current;

    const handleGlobalMessage = (message) => {
      console.log("Global message received:", message);

      // If this message is for the current user
      if (message.receiverId === user.email) {
        if (selectedUser && message.senderId === selectedUser.email) {
          setMessages((prev) => [...prev, { ...message, sent: false }]);
        } else {
          setUnreadMessages((prev) => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
          }));

          if (!isPageVisible) {
            showNotification(message);
          }
        }
      }
    };

    socket.on("receiveMessage", handleGlobalMessage);

    return () => {
      socket.off("receiveMessage", handleGlobalMessage);
    };
  }, [selectedUser, isPageVisible]);

  // Show browser notification
  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const sender = message.senderId.split("@")[0]; // Extract name from email
      new Notification("New Message", {
        body: `${sender}: ${message.text.substring(0, 50)}${
          message.text.length > 50 ? "..." : ""
        }`,
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch messages and set up chat room when selected user changes
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !selectedUser || !socketRef.current) return;

    const socket = socketRef.current;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/email/${user.email}/${selectedUser.email}`,
          { withCredentials: true }
        );
        setMessages(
          response.data.map((msg) => ({
            ...msg,
            sent: msg.senderId === user.email,
          }))
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    // Leave any previous chat rooms
    socket.emit("leaveAllRooms");

    // Join chat room with emails - this creates a unique room for these two users
    const chatRoomId = [user.email, selectedUser.email].sort().join("_");
    socket.emit("joinChat", {
      userId: user.email,
      selectedUserId: selectedUser.email,
      roomId: chatRoomId,
    });

    console.log(`Joining chat room: ${chatRoomId}`);

    // Reset unread count for this user
    setUnreadMessages((prev) => ({
      ...prev,
      [selectedUser.email]: 0,
    }));

    // Set up ping interval to keep connection alive
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping", (response) => {
          console.log("Ping response:", response);
        });
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
    };
  }, [selectedUser]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const handleSendMessage = () => {
    const user = auth.currentUser;
    if (!newMessage.trim() || !selectedUser || !user) return;

    if (!socketRef.current || !socketConnected) {
      console.error("Socket not connected. Cannot send message.");
      // Try to reconnect
      if (socketRef.current) {
        socketRef.current.connect();
      }
      return;
    }

    const messageData = {
      senderId: user.email,
      receiverId: selectedUser.email,
      text: newMessage,
      createdAt: new Date(),
      roomId: [user.email, selectedUser.email].sort().join("_"),
    };

    setMessages((prev) => [...prev, { ...messageData, sent: true }]);

    // Send message through socket
    socketRef.current.emit("sendMessage", messageData, (acknowledgement) => {
      if (!acknowledgement || !acknowledgement.success) {
        console.error(
          "Failed to send message:",
          acknowledgement?.error || "Unknown error"
        );
      }
    });

    setNewMessage("");
  };

  // Get user role with proper formatting
  const getUserRole = (user) => {
    if (!user) return "User";
    
    // Check if user object has role property
    if (user.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    
    // Fallback for old data structure
    const userEmail = user.email;
    const foundUser = users.find((u) => u.email === userEmail);
    if (foundUser && foundUser.role) {
      return foundUser.role.charAt(0).toUpperCase() + foundUser.role.slice(1);
    }
    
    return "User";
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnreadMessages((prev) => ({
      ...prev,
      [user.email]: 0,
    }));
  };

  // Get role badge color based on role
  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return isDarkMode ? "bg-red-700 text-white" : "bg-red-500 text-white";
      case "seller":
        return isDarkMode ? "bg-blue-700 text-white" : "bg-blue-500 text-white";
      case "buyer":
        return isDarkMode ? "bg-green-700 text-white" : "bg-green-500 text-white";
      default:
        return isDarkMode ? "bg-gray-700 text-white" : "bg-gray-500 text-white";
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <ChatSidebar
        isDarkMode={isDarkMode}
        onSelectUser={handleSelectUser}
        unreadMessages={unreadMessages}
        selectedUserEmail={selectedUser?.email}
        currentUserRole={currentUserRole}
        users={users}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Connection status indicator */}
        {!socketConnected && (
          <div className="bg-red-500 text-white p-2 text-center text-sm">
            {connectionError || "Disconnected from chat server. Trying to reconnect..."}
          </div>
        )}

        {selectedUser ? (
          <>
            {/* Sticky Header */}
            <div
              className={`sticky h-[87px] top-0 z-10 p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedUser.email}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      getUserRole(selectedUser)
                    )}`}
                  >
                    {getUserRole(selectedUser)}
                  </span>
                  <div className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        socketConnected ? "bg-green-500" : "bg-red-500"
                      } mr-2`}
                    ></span>
                    <span className="text-xs text-gray-500">
                      {socketConnected ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
                    >
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
                            isDarkMode
                              ? "text-gray-300"
                              : message.sent
                              ? "text-purple-100"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()} -{" "}
                          {message.sent ? (
                            "You"
                          ) : (
                            <>
                              {selectedUser.name}
                              <span
                                className={`ml-2 px-2 py-0.5 rounded text-xs ${getRoleBadgeColor(
                                  getUserRole(selectedUser)
                                )}`}
                              >
                                {getUserRole(selectedUser)}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    className={`text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No messages yet. Start the conversation!
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div
              className={`sticky bottom-0 p-4 border-t ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
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
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!socketConnected}
                  className={`p-3 rounded-r-lg ${
                    isDarkMode
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-purple-500 hover:bg-purple-600"
                  } text-white ${!socketConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`flex-1 flex items-center justify-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}