import { useState, useEffect, useRef, useContext } from "react";
import ChatSidebar from "./ChatSidebar";
import io from "socket.io-client";
import axios from "axios";
import auth from "../../firebase/firebase.init";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeContext from "../Context/ThemeContext";
import {
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Mic,
  ImageIcon,
  Check,
  X,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

// Get the socket URL from environment variable or use default
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export default function Chat() {
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const [connectionError, setConnectionError] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isPageVisible, setIsPageVisible] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);
  const [recentMessages, setRecentMessages] = useState({});
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("buyer");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [messageStatuses, setMessageStatuses] = useState({});
  const [seenMessages, setSeenMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const { isMobile, setIsMobile, selectedUser, setSelectedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [setIsMobile]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        try {
          const userResponse = await axiosPublic.get(`/user/${user.email}`, {
            withCredentials: true,
          });
          setCurrentUserRole(userResponse.data.role || "buyer");

          const usersResponse = await axiosPublic.get("/users", {
            withCredentials: true,
          });
          setUsers(usersResponse.data.filter((u) => u.email !== user.email));
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
    setSelectedUser(null);
  }, [axiosPublic, setSelectedUser]);

  // Initialize socket connection
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        forceNew: true,
      });
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected successfully");
      setSocketConnected(true);
      setConnectionError(null);
      setReconnectAttempt(0);

      const user = auth.currentUser;
      if (user) {
        socket.emit("authenticate", { 
          userId: user.email,
          userName: user.displayName || user.email.split('@')[0],
          userRole: currentUserRole
        });

        // Join personal room for private messages
        socket.emit("joinPersonalRoom", user.email);
      }

      // Rejoin chat room if user is selected
      if (user && selectedUser) {
        const roomId = [user.email, selectedUser.email].sort().join("_");
        socket.emit("joinRoom", {
          roomId,
          userId: user.email
        });
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setSocketConnected(false);
      setConnectionError(`Connection error: ${error.message}`);
      setReconnectAttempt(prev => prev + 1);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocketConnected(false);
      
      if (reason === "io server disconnect") {
        setTimeout(() => {
          socket.connect();
        }, 1000);
      }
      
      if (reason === "transport close") {
        setConnectionError("Connection lost. Reconnecting...");
      } else if (reason === "ping timeout") {
        setConnectionError("Connection timeout. Reconnecting...");
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      setSocketConnected(true);
      setConnectionError(null);
      setReconnectAttempt(0);
      
      const user = auth.currentUser;
      if (user) {
        socket.emit("authenticate", { 
          userId: user.email,
          userName: user.displayName || user.email.split('@')[0],
          userRole: currentUserRole
        });
      }
    });

    socket.on("messageStatus", ({ messageId, status }) => {
      setMessageStatuses((prev) => ({
        ...prev,
        [messageId]: status,
      }));
    });

    socket.on("userTyping", ({ userId, isTyping }) => {
      if (selectedUser && userId === selectedUser.email) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      if (socketRef.current) {
        socket.off("connect");
        socket.off("connect_error");
        socket.off("disconnect");
        socket.off("reconnect");
        socket.off("messageStatus");
        socket.off("userTyping");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [selectedUser, currentUserRole]);

  // Handle incoming messages - FIXED VERSION
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !socketRef.current) return;

    const socket = socketRef.current;

    const handleReceiveMessage = (message) => {
      console.log("📩 Message received:", message);
      
      // Only process messages for current user
      if (message.receiverId !== user.email && message.senderId !== user.email) {
        console.log("Message not for current user, ignoring");
        return;
      }

      // Update messages state immediately
      setMessages((prevMessages) => {
        // Check for duplicates
        const messageExists = prevMessages.some(
          (msg) => msg.messageId === message.messageId || 
                   (msg.tempId && msg.tempId === message.tempId)
        );
        
        if (messageExists) {
          console.log("Message already exists, skipping");
          return prevMessages;
        }
        
        console.log("Adding new message to state");
        
        // Add the new message
        const newMessage = {
          ...message,
          sent: message.senderId === user.email,
          createdAt: message.createdAt || new Date().toISOString()
        };
        
        // Sort messages by date
        const updatedMessages = [...prevMessages, newMessage].sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        return updatedMessages;
      });

      // Update recent messages
      const otherUserId = message.senderId === user.email 
        ? message.receiverId 
        : message.senderId;
        
      setRecentMessages((prev) => {
        const updated = {
          ...prev,
          [otherUserId]: message
        };
        localStorage.setItem("recentMessages", JSON.stringify(updated));
        return updated;
      });

      // Update last message timestamp
      const msgTime = new Date(message.createdAt).getTime();
      setLastMessageTimestamp(prev => 
        !prev || msgTime > prev ? msgTime : prev
      );

      // Handle unread count if message is from someone else and not currently selected
      if (message.senderId !== user.email) {
        if (!selectedUser || message.senderId !== selectedUser.email) {
          setUnreadMessages((prev) => {
            const updated = {
              ...prev,
              [message.senderId]: (prev[message.senderId] || 0) + 1,
            };
            localStorage.setItem("unreadMessages", JSON.stringify(updated));
            return updated;
          });

          // Show notification if page is not visible
          if (!isPageVisible && Notification.permission === "granted") {
            showNotification(message);
          }
        } else {
          // If message is from selected user, mark as read
          socket.emit("markAsRead", {
            messageIds: [message.messageId],
            reader: user.email,
            sender: message.senderId,
          });
        }
      }

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedUser, isPageVisible]);

  // Load stored data from localStorage
  useEffect(() => {
    const storedStatuses = localStorage.getItem("messageStatuses");
    if (storedStatuses) {
      try {
        setMessageStatuses(JSON.parse(storedStatuses));
      } catch (error) {
        console.error("Error parsing stored message statuses:", error);
      }
    }

    const storedUnreadMessages = localStorage.getItem("unreadMessages");
    if (storedUnreadMessages) {
      try {
        setUnreadMessages(JSON.parse(storedUnreadMessages));
      } catch (error) {
        console.error("Error parsing stored unread messages:", error);
      }
    }

    const storedSeenMessages = localStorage.getItem("seenMessages");
    if (storedSeenMessages) {
      try {
        setSeenMessages(JSON.parse(storedSeenMessages));
      } catch (error) {
        console.error("Error parsing stored seen messages:", error);
      }
    }
  }, []);

  // Fetch recent messages
  useEffect(() => {
    const fetchRecentMessages = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const response = await axiosPublic.get(
          `/recent-messages/${user.email}`,
          { withCredentials: true }
        );

        const recentMessagesMap = response.data.reduce(
          (acc, { userEmail, lastMessage }) => {
            acc[userEmail] = lastMessage;
            return acc;
          },
          {}
        );

        setRecentMessages(recentMessagesMap);
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      }
    };

    fetchRecentMessages();
  }, [axiosPublic]);

  // Handle visibility change for read receipts
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      setIsPageVisible(isVisible);

      if (isVisible && selectedUser && messages.length > 0 && socketRef.current) {
        const unreadMessageIds = messages
          .filter(
            (msg) =>
              !msg.sent &&
              (!messageStatuses[msg.messageId] ||
                messageStatuses[msg.messageId] !== "read")
          )
          .map((msg) => msg.messageId);

        if (unreadMessageIds.length > 0) {
          socketRef.current.emit("markAsRead", {
            messageIds: unreadMessageIds,
            reader: auth.currentUser?.email,
            sender: selectedUser.email,
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedUser, messages, messageStatuses]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  // Handle selected user from location state
  useEffect(() => {
    const { selectedUser: preSelectedUser } = location.state || {};
    const storedUser = JSON.parse(localStorage.getItem("selectedUser"));

    if (preSelectedUser) {
      setSelectedUser(preSelectedUser);
      localStorage.setItem("selectedUser", JSON.stringify(preSelectedUser));
    } else if (storedUser && !selectedUser) {
      setSelectedUser(storedUser);
    }
  }, [location.state, selectedUser, setSelectedUser]);

  // Fetch messages and join room when selected user changes
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !selectedUser || !socketRef.current) return;

    const socket = socketRef.current;
    const roomId = [user.email, selectedUser.email].sort().join("_");

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for:", user.email, selectedUser.email);
        const response = await axiosPublic.get(
          `/messages/email/${user.email}/${selectedUser.email}`,
          { withCredentials: true }
        );

        const fetchedMessages = response.data.map((msg) => ({
          ...msg,
          sent: msg.senderId === user.email,
        }));

        console.log("Fetched messages:", fetchedMessages.length);
        setMessages(fetchedMessages);

        if (fetchedMessages.length > 0) {
          const latestMessage = fetchedMessages.reduce((latest, msg) => {
            const msgTime = new Date(msg.createdAt).getTime();
            return msgTime > latest ? msgTime : latest;
          }, 0);
          setLastMessageTimestamp(latestMessage);

          // Mark messages as read
          const messagesToMarkAsRead = fetchedMessages
            .filter(
              (msg) =>
                !msg.sent &&
                (!messageStatuses[msg.messageId] ||
                  messageStatuses[msg.messageId] !== "read")
            )
            .map((msg) => msg.messageId);

          if (messagesToMarkAsRead.length > 0 && isPageVisible) {
            socket.emit("markAsRead", {
              messageIds: messagesToMarkAsRead,
              reader: user.email,
              sender: selectedUser.email,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // Join the chat room
    console.log("Joining room:", roomId);
    socket.emit("joinRoom", {
      roomId,
      userId: user.email
    });

    fetchMessages();

    // Clear unread messages for selected user
    setUnreadMessages((prev) => ({
      ...prev,
      [selectedUser.email]: 0,
    }));

    return () => {
      console.log("Leaving room:", roomId);
    };
  }, [selectedUser, axiosPublic, isPageVisible]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const sender = message.senderId.split("@")[0];
      new Notification("New Message", {
        body: `${sender}: ${message.text.substring(0, 50)}${
          message.text.length > 50 ? "..." : ""
        }`,
        icon: "/logo192.png",
      });
    }
  };

  const handleSendMessage = () => {
    const user = auth.currentUser;
    if (!newMessage.trim() || !selectedUser || !user) return;

    if (!socketRef.current || !socketConnected) {
      console.error("Socket not connected. Attempting to reconnect...");
      if (socketRef.current) {
        socketRef.current.connect();
      }
      setConnectionError("Reconnecting to chat server...");
      setTimeout(() => setConnectionError(null), 3000);
      return;
    }

    // Generate temporary message ID
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const messageData = {
      messageId: tempId, // Will be replaced by server
      tempId: tempId, // Keep temp ID for tracking
      senderId: user.email,
      receiverId: selectedUser.email,
      text: newMessage,
      createdAt: new Date().toISOString(),
      roomId: [user.email, selectedUser.email].sort().join("_"),
      status: "sending",
    };

    console.log("Sending message:", messageData);

    // Optimistically add message to UI
    setMessages((prev) => {
      const newMessage = {
        ...messageData,
        sent: true,
        messageId: tempId // Use temp ID temporarily
      };
      return [...prev, newMessage];
    });

    // Update recent messages
    setRecentMessages((prev) => {
      const updated = {
        ...prev,
        [selectedUser.email]: messageData,
      };
      localStorage.setItem("recentMessages", JSON.stringify(updated));
      return updated;
    });

    // Set initial status
    setMessageStatuses((prev) => ({
      ...prev,
      [tempId]: "sending",
    }));

    // Send message with acknowledgement
    socketRef.current.emit("sendMessage", messageData, (response) => {
      console.log("Send message response:", response);
      
      if (response && response.success) {
        // Update temp message ID with real ID
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId || msg.messageId === tempId
              ? { 
                  ...msg, 
                  messageId: response.messageId,
                  tempId: undefined // Remove temp ID
                }
              : msg
          )
        );

        // Update recent messages with real ID
        setRecentMessages((prev) => {
          if (prev[selectedUser.email]?.tempId === tempId) {
            const updated = {
              ...prev,
              [selectedUser.email]: {
                ...prev[selectedUser.email],
                messageId: response.messageId,
                tempId: undefined
              },
            };
            localStorage.setItem("recentMessages", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });

        // Update message status
        setMessageStatuses((prev) => {
          const updated = { ...prev };
          delete updated[tempId];
          updated[response.messageId] = "sent";
          localStorage.setItem("messageStatuses", JSON.stringify(updated));
          return updated;
        });
      } else {
        // Handle failed message
        console.error("Failed to send message:", response?.error || "Unknown error");
        
        setMessageStatuses((prev) => ({
          ...prev,
          [tempId]: "failed",
        }));

        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId || msg.messageId === tempId
              ? { ...msg, failed: true }
              : msg
          )
        );

        setConnectionError("Failed to send message. Please try again.");
        setTimeout(() => setConnectionError(null), 3000);
      }
    });

    setNewMessage("");
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!selectedUser || !socketRef.current || !socketConnected) return;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    socketRef.current.emit("typing", {
      userId: auth.currentUser?.email,
      receiverId: selectedUser.email,
      isTyping: true,
    });

    const timeout = setTimeout(() => {
      socketRef.current.emit("typing", {
        userId: auth.currentUser?.email,
        receiverId: selectedUser.email,
        isTyping: false,
      });
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleFileUpload = (type) => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
    setShowAttachMenu(false);
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user || !selectedUser || !socketRef.current) return;

    const fileUrl = URL.createObjectURL(file);
    
    const messageData = {
      messageId: `temp-${Date.now()}`,
      senderId: user.email,
      receiverId: selectedUser.email,
      text: fileType === 'image' ? '📷 Image' : '📎 File',
      fileUrl: fileUrl,
      fileType: fileType,
      fileName: file.name,
      createdAt: new Date().toISOString(),
      roomId: [user.email, selectedUser.email].sort().join("_"),
    };

    setMessages((prev) => [...prev, { ...messageData, sent: true }]);
    socketRef.current.emit("sendMessage", messageData);
  };

  const handleRetryMessage = (messageId) => {
    const failedMessage = messages.find(msg => msg.messageId === messageId);
    if (!failedMessage) return;

    setMessages((prev) => prev.filter(msg => msg.messageId !== messageId));
    setNewMessage(failedMessage.text);
    
    setMessageStatuses((prev) => {
      const updated = { ...prev };
      delete updated[messageId];
      return updated;
    });
  };

  const getUserRole = (user) => {
    if (!user) return "User";
    if (user.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    const userEmail = user.email;
    const foundUser = users.find((u) => u.email === userEmail);
    if (foundUser && foundUser.role) {
      return foundUser.role.charAt(0).toUpperCase() + foundUser.role.slice(1);
    }
    return "User";
  };

  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "seller":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "buyer":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-black";
      default:
        return isDarkMode ? "bg-gray-700 text-white" : "bg-gray-500 text-white";
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnreadMessages((prev) => ({
      ...prev,
      [user.email]: 0,
    }));
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  const handleBackToSidebar = () => {
    setSelectedUser(null);
    setMessages([]);
    localStorage.removeItem("selectedUser");
  };

  const renderMessageStatus = (messageId) => {
    const status = messageStatuses[messageId] || "sent";

    switch (status) {
      case "sending":
        return <div className="h-3 w-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />;
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return (
          <div className="flex">
            <Check className="h-3 w-3 text-gray-400" />
            <Check className="h-3 w-3 -ml-1 text-gray-400" />
          </div>
        );
      case "read":
        return (
          <div className="flex">
            <Check className="h-3 w-3 text-blue-500" />
            <Check className="h-3 w-3 -ml-1 text-blue-500" />
          </div>
        );
      case "failed":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = [
    "😊", "😂", "❤️", "👍", "🎉", "🔥", "✨", "🙏", "👏", "🤔",
    "😍", "🥰", "😎", "🤩", "😇", "🥳", "😴", "🤯", "😱", "🥺"
  ];

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileChange(e, 'image')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, 'file')}
        className="hidden"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`chat-sidebar-container ${
            isMobile && selectedUser ? "hidden" : "flex"
          } ${
            isMobile ? "w-full" : "w-80"
          } flex-shrink-0 shadow-lg h-full overflow-y-auto`}
        >
          <ChatSidebar
            isDarkMode={isDarkMode}
            onSelectUser={handleSelectUser}
            unreadMessages={unreadMessages}
            selectedUserEmail={selectedUser?.email}
            recentMessages={recentMessages}
            messageStatuses={messageStatuses}
            seenMessages={seenMessages}
          />
        </div>

        {/* Chat area */}
        <div
          className={`flex-1 flex flex-col ${
            isMobile && !selectedUser ? "hidden" : "flex"
          } h-full overflow-hidden`}
        >
          {/* Connection status indicator */}
          {!socketConnected && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 text-center text-sm font-medium animate-pulse flex items-center justify-center space-x-2">
              <WifiOff className="h-4 w-4" />
              <span>
                {connectionError || 
                  (reconnectAttempt > 0 
                    ? `Disconnected. Reconnecting... (Attempt ${reconnectAttempt}/10)` 
                    : "Disconnected from chat server. Trying to reconnect...")}
              </span>
            </div>
          )}

          {selectedUser ? (
            <div className="h-full flex flex-col">
              {/* Chat header */}
              <div
                className={`border-b ${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 text-gray-200"
                    : "bg-gradient-to-r from-white to-gray-50 border-gray-200 text-gray-800"
                } shadow-sm`}
              >
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    {isMobile && (
                      <button
                        onClick={handleBackToSidebar}
                        className="mr-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Back to chat list"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                    )}

                    <div className="mr-3 relative">
                      {selectedUser.photo ? (
                        <img
                          src={selectedUser.photo || "/placeholder.svg"}
                          alt={selectedUser.name || "User"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg?height=48&width=48&text=User";
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
                          {selectedUser.name?.charAt(0) ||
                            selectedUser.email?.charAt(0) ||
                            "?"}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                          socketConnected ? "bg-green-500" : "bg-red-500"
                        } border-2 border-white`}
                      ></span>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        {selectedUser.name || "User"}
                      </h2>
                      <div className="flex items-center flex-wrap gap-2">
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {selectedUser.email || "No email"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            getUserRole(selectedUser)
                          )}`}
                        >
                          {getUserRole(selectedUser)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages area */}
              <div
                className={`flex-1 overflow-y-auto p-4 ${
                  isDarkMode
                    ? "bg-gradient-to-b from-gray-900 to-gray-800"
                    : "bg-gradient-to-b from-gray-50 to-white"
                }`}
              >
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.length > 0 ? (
                    messages.map((message, index) => {
                      const showDateSeparator =
                        index === 0 ||
                        new Date(message.createdAt).toDateString() !==
                          new Date(
                            messages[index - 1].createdAt
                          ).toDateString();

                      return (
                        <div key={message.messageId || message.tempId || `msg-${index}`}>
                          {showDateSeparator && (
                            <div className="flex justify-center my-6">
                              <div
                                className={`px-4 py-1 rounded-full text-xs font-medium ${
                                  isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          )}

                          <div
                            className={`flex ${
                              message.sent ? "justify-end" : "justify-start"
                            }`}
                          >
                            {!message.sent && (
                              <div className="flex-shrink-0 mr-2 self-end">
                                {selectedUser.photo ? (
                                  <img
                                    src={selectedUser.photo || "/placeholder.svg"}
                                    alt={selectedUser.name || "User"}
                                    className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/placeholder.svg?height=32&width=32&text=User";
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
                                    {selectedUser.name?.charAt(0) ||
                                      selectedUser.email?.charAt(0) ||
                                      "?"}
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
                              } ${message.failed ? "opacity-50" : ""}`}
                            >
                              {message.fileUrl && message.fileType === 'image' ? (
                                <div className="mb-2">
                                  <img 
                                    src={message.fileUrl} 
                                    alt={message.fileName || "Shared image"}
                                    className="max-w-full rounded-lg max-h-64 object-cover"
                                  />
                                </div>
                              ) : message.fileUrl ? (
                                <div className="mb-2 flex items-center space-x-2 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                                  <Paperclip className="h-4 w-4" />
                                  <span className="text-sm truncate">{message.fileName || "File"}</span>
                                </div>
                              ) : null}
                              
                              <p className="leading-relaxed break-words">{message.text}</p>
                              
                              <div className="flex items-center justify-end mt-1 space-x-1">
                                <p
                                  className={`text-xs ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : message.sent
                                      ? "text-purple-100"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {message.sent && (
                                  <span className="ml-1">
                                    {renderMessageStatus(message.messageId)}
                                  </span>
                                )}
                              </div>

                              {message.failed && (
                                <button
                                  onClick={() => handleRetryMessage(message.messageId)}
                                  className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center space-x-1"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  <span>Failed to send. Click to retry.</span>
                                </button>
                              )}
                            </div>

                            {message.sent && currentUser && (
                              <div className="flex-shrink-0 ml-2 self-end">
                                {currentUser.photoURL ? (
                                  <img
                                    src={currentUser.photoURL || "/placeholder.svg"}
                                    alt="You"
                                    className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/placeholder.svg?height=32&width=32&text=You";
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
                                    {currentUser.displayName?.charAt(0) ||
                                      currentUser.email?.charAt(0) ||
                                      "Y"}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-100"
                        }`}
                      >
                        <Send
                          className={`h-10 w-10 ${
                            isDarkMode ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-center text-lg font-medium ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No messages yet
                      </p>
                      <p
                        className={`text-center ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Start the conversation with{" "}
                        {selectedUser.name || "User"}!
                      </p>
                    </div>
                  )}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message input area */}
              <div
                className={`p-4 border-t ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
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
                        aria-label={`Add ${emoji} emoji`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {showAttachMenu && (
                  <div
                    className={`p-2 mb-2 rounded-lg flex space-x-2 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <button
                      onClick={() => handleFileUpload('image')}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Attach image"
                    >
                      <ImageIcon className="h-6 w-6 text-blue-500" />
                      <span className="text-xs block">Image</span>
                    </button>
                    <button
                      onClick={() => handleFileUpload('file')}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-6 w-6 text-green-500" />
                      <span className="text-xs block">File</span>
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-50 cursor-not-allowed"
                      aria-label="Record audio (coming soon)"
                      disabled
                    >
                      <Mic className="h-6 w-6 text-red-500" />
                      <span className="text-xs block">Audio</span>
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
                    } transition-colors`}
                    aria-label="Toggle attachment menu"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={socketConnected ? "Type a message..." : "Reconnecting..."}
                      disabled={!socketConnected}
                      className={`w-full p-3 pr-10 rounded-full focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                          : "bg-gray-100 border-gray-300 text-gray-800 focus:ring-purple-500"
                      } border ${!socketConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-label="Type your message"
                    />

                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      aria-label="Toggle emoji picker"
                    >
                      <Smile
                        className={`h-5 w-5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!socketConnected || !newMessage.trim()}
                    className={`p-3 rounded-full ${
                      !socketConnected || !newMessage.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 transition-transform"
                    } ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    } text-white shadow-md`}
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                {!socketConnected && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    You're offline. Messages will be sent when connection is restored.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`flex-1 flex flex-col items-center justify-center ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } ${isMobile ? "hidden" : "flex"} h-full overflow-y-auto p-8`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <Send
                  className={`h-10 w-10 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-center max-w-md">
                Select a conversation from the sidebar to start chatting
              </p>
              {!socketConnected && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-yellow-500">
                  <WifiOff className="h-4 w-4" />
                  <span>Connecting to chat server...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}