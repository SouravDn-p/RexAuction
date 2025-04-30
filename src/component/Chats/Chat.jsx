import { useState, useEffect, useRef, useContext } from "react";
import ChatSidebar from "./ChatSidebar";
import io from "socket.io-client";
import axios from "axios";
import auth from "../../firebase/firebase.init";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ThemeContext from "../Context/ThemeContext";
import {
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Mic,
  ImageIcon,
  Check,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

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
  const { isMobile, setIsMobile, selectedUser, setSelectedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [setIsMobile]);

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
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(
        "https://rex-auction-server-side-jzyx.onrender.com",
        {
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
        }
      );
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
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
      }
    });

    socket.on("connect_error", (error) => {
      setSocketConnected(false);
      setConnectionError(`Connection error: ${error.message}`);
    });

    socket.on("disconnect", (reason) => {
      setSocketConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("messageStatus", ({ messageId, status }) => {
      setMessageStatuses((prev) => ({
        ...prev,
        [messageId]: status,
      }));

      const storedStatuses = JSON.parse(
        localStorage.getItem("messageStatuses") || "{}"
      );
      localStorage.setItem(
        "messageStatuses",
        JSON.stringify({
          ...storedStatuses,
          [messageId]: status,
        })
      );
    });

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      setIsPageVisible(isVisible);

      if (isVisible && selectedUser) {
        refreshMessages(selectedUser);

        if (selectedUser && messages.length > 0) {
          const unreadMessageIds = messages
            .filter(
              (msg) =>
                !msg.sent &&
                (!messageStatuses[msg.messageId] ||
                  messageStatuses[msg.messageId] !== "read")
            )
            .map((msg) => msg.messageId);

          if (unreadMessageIds.length > 0) {
            socket.emit("markAsRead", {
              messageIds: unreadMessageIds,
              reader: auth.currentUser?.email,
              sender: selectedUser.email,
            });
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (socketRef.current) {
        socket.off("connect");
        socket.off("connect_error");
        socket.off("disconnect");
        socket.off("messageStatus");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [selectedUser, messages, messageStatuses]);

  useEffect(() => {
    const storedStatuses = localStorage.getItem("messageStatuses");
    if (storedStatuses) {
      try {
        setMessageStatuses(JSON.parse(storedStatuses));
      } catch (error) {
        console.error("Error parsing stored message statuses:", error);
      }
    }
  }, []);

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
  }, []);

  useEffect(() => {
    const storedUnreadMessages = localStorage.getItem("unreadMessages");
    if (storedUnreadMessages) {
      try {
        setUnreadMessages(JSON.parse(storedUnreadMessages));
      } catch (error) {
        console.error("Error parsing stored unread messages:", error);
      }
    }
  }, []);

  const refreshMessages = async (user) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !user) return;

    try {
      const since = lastMessageTimestamp
        ? new Date(lastMessageTimestamp).toISOString()
        : null;
      const url = `https://rex-auction-server-side-jzyx.onrender.com/messages/email/${
        currentUser.email
      }/${user.email}${since ? `?since=${since}` : ""}`;

      const response = await axios.get(url, { withCredentials: true });

      if (response.data.length > 0) {
        const fetchedMessages = response.data.map((msg) => ({
          ...msg,
          sent: msg.senderId === currentUser.email,
        }));

        setMessages((prevMessages) => {
          const messageIds = new Set(prevMessages.map((msg) => msg.messageId));
          const newMessages = fetchedMessages.filter(
            (msg) => !messageIds.has(msg.messageId)
          );
          return [...prevMessages, ...newMessages];
        });

        const latestMessage = response.data.reduce((latest, msg) => {
          const msgTime = new Date(msg.createdAt).getTime();
          return msgTime > latest ? msgTime : latest;
        }, lastMessageTimestamp || 0);
        setLastMessageTimestamp(latestMessage);

        const messagesToMarkAsDelivered = fetchedMessages
          .filter(
            (msg) =>
              !msg.sent &&
              (!messageStatuses[msg.messageId] ||
                messageStatuses[msg.messageId] === "sent")
          )
          .map((msg) => msg.messageId);

        if (messagesToMarkAsDelivered.length > 0 && socketRef.current) {
          socketRef.current.emit("markAsDelivered", {
            messageIds: messagesToMarkAsDelivered,
            recipient: currentUser.email,
            sender: user.email,
          });
        }

        if (isPageVisible) {
          const messagesToMarkAsRead = fetchedMessages
            .filter(
              (msg) =>
                !msg.sent &&
                (!messageStatuses[msg.messageId] ||
                  messageStatuses[msg.messageId] !== "read")
            )
            .map((msg) => msg.messageId);

          if (messagesToMarkAsRead.length > 0 && socketRef.current) {
            socketRef.current.emit("markAsRead", {
              messageIds: messagesToMarkAsRead,
              reader: currentUser.email,
              sender: user.email,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  };

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

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !socketRef.current) return;

    const socket = socketRef.current;

    const handleGlobalMessage = (message) => {
      const otherUserId =
        message.senderId === user.email ? message.receiverId : message.senderId;

      setRecentMessages((prev) => {
        const updated = {
          ...prev,
          [otherUserId]: message,
        };
        localStorage.setItem("recentMessages", JSON.stringify(updated));
        return updated;
      });

      if (message.receiverId === user.email) {
        setMessageStatuses((prev) => ({
          ...prev,
          [message.messageId]: "delivered",
        }));

        const storedStatuses = JSON.parse(
          localStorage.getItem("messageStatuses") || "{}"
        );
        localStorage.setItem(
          "messageStatuses",
          JSON.stringify({
            ...storedStatuses,
            [message.messageId]: "delivered",
          })
        );

        socket.emit("markAsDelivered", {
          messageIds: [message.messageId],
          recipient: user.email,
          sender: message.senderId,
        });

        if (selectedUser && message.senderId === selectedUser.email) {
          setMessages((prev) => {
            const messageExists = prev.some(
              (msg) => msg.messageId === message.messageId
            );
            if (messageExists) return prev;
            return [...prev, { ...message, sent: false }];
          });

          const msgTime = new Date(message.createdAt).getTime();
          if (!lastMessageTimestamp || msgTime > lastMessageTimestamp) {
            setLastMessageTimestamp(msgTime);
          }

          if (isPageVisible) {
            socket.emit("markAsRead", {
              messageIds: [message.messageId],
              reader: user.email,
              sender: message.senderId,
            });
          }
        } else {
          setUnreadMessages((prev) => {
            const updated = {
              ...prev,
              [message.senderId]: (prev[message.senderId] || 0) + 1,
            };
            localStorage.setItem("unreadMessages", JSON.stringify(updated));
            return updated;
          });

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
  }, [selectedUser, isPageVisible, lastMessageTimestamp]);

  const showNotification = (message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const sender = message.senderId.split("@")[0];
      new Notification("New Message", {
        body: `${sender}: ${message.text.substring(0, 50)}${
          message.text.length > 50 ? "..." : ""
        }`,
      });
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !selectedUser || !socketRef.current) return;

    const socket = socketRef.current;

    const fetchMessages = async () => {
      try {
        const response = await axiosPublic.get(
          `/messages/email/${user.email}/${selectedUser.email}`,
          { withCredentials: true }
        );

        const fetchedMessages = response.data.map((msg) => ({
          ...msg,
          sent: msg.senderId === user.email,
        }));

        setMessages(fetchedMessages);

        if (fetchedMessages.length > 0) {
          const latestMessage = fetchedMessages.reduce((latest, msg) => {
            const msgTime = new Date(msg.createdAt).getTime();
            return msgTime > latest ? msgTime : latest;
          }, 0);
          setLastMessageTimestamp(latestMessage);

          const messagesToMarkAsDelivered = fetchedMessages
            .filter(
              (msg) =>
                !msg.sent &&
                (!messageStatuses[msg.messageId] ||
                  messageStatuses[msg.messageId] === "sent")
            )
            .map((msg) => msg.messageId);

          if (messagesToMarkAsDelivered.length > 0) {
            socket.emit("markAsDelivered", {
              messageIds: messagesToMarkAsDelivered,
              recipient: user.email,
              sender: selectedUser.email,
            });
          }

          if (isPageVisible) {
            const messagesToMarkAsRead = fetchedMessages
              .filter(
                (msg) =>
                  !msg.sent &&
                  (!messageStatuses[msg.messageId] ||
                    messageStatuses[msg.messageId] !== "read")
              )
              .map((msg) => msg.messageId);

            if (messagesToMarkAsRead.length > 0) {
              socket.emit("markAsRead", {
                messageIds: messagesToMarkAsRead,
                reader: user.email,
                sender: selectedUser.email,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.emit("leaveAllRooms");

    const chatRoomId = [user.email, selectedUser.email].sort().join("_");
    socket.emit("joinChat", {
      userId: user.email,
      selectedUserId: selectedUser.email,
      roomId: chatRoomId,
    });

    setUnreadMessages((prev) => ({
      ...prev,
      [selectedUser.email]: 0,
    }));

    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping");
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const user = auth.currentUser;
    if (!newMessage.trim() || !selectedUser || !user) return;

    if (!socketRef.current || !socketConnected) {
      console.error("Socket not connected. Cannot send message.");
      if (socketRef.current) {
        socketRef.current.connect();
      }
      return;
    }

    const tempMessageId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const messageData = {
      messageId: tempMessageId,
      senderId: user.email,
      receiverId: selectedUser.email,
      text: newMessage,
      createdAt: new Date(),
      roomId: [user.email, selectedUser.email].sort().join("_"),
      status: "sent",
    };

    setMessages((prev) => [...prev, { ...messageData, sent: true }]);

    setRecentMessages((prev) => {
      const updated = {
        ...prev,
        [selectedUser.email]: messageData,
      };
      localStorage.setItem("recentMessages", JSON.stringify(updated));
      return updated;
    });

    setMessageStatuses((prev) => ({
      ...prev,
      [tempMessageId]: "sent",
    }));

    const storedStatuses = JSON.parse(
      localStorage.getItem("messageStatuses") || "{}"
    );
    localStorage.setItem(
      "messageStatuses",
      JSON.stringify({
        ...storedStatuses,
        [tempMessageId]: "sent",
      })
    );

    const msgTime = new Date(messageData.createdAt).getTime();
    if (!lastMessageTimestamp || msgTime > lastMessageTimestamp) {
      setLastMessageTimestamp(msgTime);
    }

    socketRef.current.emit("sendMessage", messageData, (acknowledgement) => {
      if (!acknowledgement || !acknowledgement.success) {
        console.error(
          "Failed to send message:",
          acknowledgement?.error || "Unknown error"
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === tempMessageId
              ? { ...msg, messageId: acknowledgement.messageId }
              : msg
          )
        );

        setRecentMessages((prev) => {
          if (prev[selectedUser.email]?.messageId === tempMessageId) {
            const updated = {
              ...prev,
              [selectedUser.email]: {
                ...prev[selectedUser.email],
                messageId: acknowledgement.messageId,
              },
            };
            localStorage.setItem("recentMessages", JSON.stringify(updated));
            return updated;
          }
          return prev;
        });

        setMessageStatuses((prev) => {
          const status = prev[tempMessageId] || "sent";
          const updated = { ...prev };
          delete updated[tempMessageId];
          updated[acknowledgement.messageId] = status;

          const storedStatuses = JSON.parse(
            localStorage.getItem("messageStatuses") || "{}"
          );
          delete storedStatuses[tempMessageId];
          storedStatuses[acknowledgement.messageId] = status;
          localStorage.setItem(
            "messageStatuses",
            JSON.stringify(storedStatuses)
          );

          return updated;
        });
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
  };

  const handleBackToSidebar = () => {
    setSelectedUser(null);
    setMessages([]);
    localStorage.removeItem("selectedUser"); // Clear selectedUser from localStorage
    if (isMobile) {
      document
        .querySelector(".chat-sidebar-container")
        ?.classList.remove("hidden");
    }
  };

  const renderMessageStatus = (messageId) => {
    const status = messageStatuses[messageId] || "sent";

    switch (status) {
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
      default:
        return null;
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "✨",
    "🙏",
    "👏",
    "🤔",
    "😍",
    "🥰",
    "😎",
    "🤩",
    "😇",
  ];

  useEffect(() => {
    const storedSeenMessages = localStorage.getItem("seenMessages");
    if (storedSeenMessages) {
      try {
        setSeenMessages(JSON.parse(storedSeenMessages));
      } catch (error) {
        console.error("Error parsing stored seen messages:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      setSeenMessages((prev) => {
        const updated = { ...prev, [selectedUser.email]: true };
        localStorage.setItem("seenMessages", JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedUser, messages, messageStatuses]);

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
      className={`flex flex-col max-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile when a chat is selected */}
        <div
          className={`chat-sidebar-container ${
            isMobile && selectedUser ? "hidden" : "flex"
          } ${
            isMobile ? "w-full" : "w-80"
          } flex-shrink-0 shadow-lg max-h-screen overflow-y-auto`}
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

        {/* Chat area - full width on mobile when a chat is selected */}
        <div
          className={`flex-1 flex flex-col ${
            isMobile && !selectedUser ? "hidden" : "flex"
          } max-h-screen overflow-y-auto`}
        >
          {/* Connection status indicator */}
          {!socketConnected && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 text-center text-sm font-medium animate-pulse">
              {connectionError ||
                "Disconnected from chat server. Trying to reconnect..."}
            </div>
          )}

          {selectedUser ? (
            <div className="h-screen">
              <div
                className={`border-b sticky top-0 z-50   ${
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
                        className="mr-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
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
                            e.target.src =
                              "/placeholder.svg?height=40&width=40&text=User";
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
                      <div className="flex items-center">
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {selectedUser.email || "No email"}
                        </span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
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

              <div
                className={`flex-1 overflow-y-auto h-screen p-4 ${
                  isDarkMode
                    ? "bg-gradient-to-b from-gray-900 to-gray-800"
                    : "bg-gradient-to-b from-gray-50 to-white"
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
                      const showDateSeparator =
                        index === 0 ||
                        new Date(message.createdAt).toDateString() !==
                          new Date(
                            messages[index - 1].createdAt
                          ).toDateString();

                      return (
                        <div key={message.messageId || `msg-${index}`}>
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
                                    src={
                                      selectedUser.photo || "/placeholder.svg"
                                    }
                                    alt={selectedUser.name || "User"}
                                    className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "/placeholder.svg?height=32&width=32&text=User";
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
                              }`}
                            >
                              <p className="leading-relaxed">{message.text}</p>
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
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleTimeString([], {
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
                            </div>

                            {message.sent && currentUser && (
                              <div className="flex-shrink-0 ml-2 self-end">
                                {currentUser.photoURL ? (
                                  <img
                                    src={
                                      currentUser.photoURL || "/placeholder.svg"
                                    }
                                    alt="You"
                                    className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "/placeholder.svg?height=32&width=32&text=You";
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
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div
                className={`p-4 border-t sticky bottom-0 z-10 ${
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
                    className={`p-2 mb-2 rounded-lg flex space-x-2 flex-1 overflow-y-auto ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <button
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      aria-label="Attach image"
                    >
                      <ImageIcon className="h-6 w-6 text-blue-500" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-6 w-6 text-green-500" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      aria-label="Record audio"
                    >
                      <Mic className="h-6 w-6 text-red-500" />
                    </button>
                  </div>
                )}

                <div className="flex items-center space-x-2 sticky bottom-0">
                  <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className={`p-3 rounded-full ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                    aria-label="Toggle attachment menu"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className={`w-full p-3 pr-10 rounded-full focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                          : "bg-gray-100 border-gray-300 text-gray-800 focus:ring-purple-500"
                      } border`}
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
                        : ""
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
              </div>
            </div>
          ) : (
            <div
              className={`flex-1 flex flex-col items-center justify-center ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } ${isMobile ? "hidden" : "flex"} max-h-screen overflow-y-auto`}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
