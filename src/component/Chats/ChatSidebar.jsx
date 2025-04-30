import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import auth from "../../firebase/firebase.init";
import io from "socket.io-client";
import LoadingSpinner from "../LoadingSpinner";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function ChatSidebar({
  isDarkMode,
  onSelectUser,
  unreadMessages = {},
  selectedUserEmail,
  recentMessages = {},
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const socketRef = useRef(null);
  const hasSelectedInitialUser = useRef(false);
  const [localRecentMessages, setLocalRecentMessages] = useState({});
  const [preloadedImages, setPreloadedImages] = useState({});
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (Object.keys(recentMessages).length > 0) {
      // Merge with existing messages rather than replacing
      setLocalRecentMessages((prev) => {
        const merged = { ...prev, ...recentMessages };
        localStorage.setItem("recentMessages", JSON.stringify(merged));
        return merged;
      });
    }
  }, [recentMessages]);

  // Load recent messages from localStorage on initial render
  useEffect(() => {
    const storedMessages = localStorage.getItem("recentMessages");
    if (storedMessages && Object.keys(localRecentMessages).length === 0) {
      try {
        setLocalRecentMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error("Error parsing stored messages:", error);
      }
    }
  }, []);

  // Preload user images function
  const preloadUserImages = (users) => {
    if (!users || users.length === 0) return;

    users.forEach((user) => {
      if (user.photo) {
        const img = new Image();
        img.src = user.photo;
        img.onload = () => {
          setPreloadedImages((prev) => ({
            ...prev,
            [user.email]: true,
          }));
        };
      }
    });
  };

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

    const fetchUsers = async () => {
      try {
        const currentUser = await new Promise((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
          });
        });

        if (!currentUser) {
          console.warn("No authenticated user found");
          setLoading(false);
          return;
        }

        setLoading(true);

        // Fetch users
        const usersResponse = await axiosSecure.get("/users", {
          withCredentials: true,
        });

        const filteredUsers = usersResponse.data.filter(
          (user) => user.email !== currentUser.email
        );
        setUsers(filteredUsers);

        // Preload user images immediately
        preloadUserImages(filteredUsers);

        // Fetch recent messages if they're not already available
        if (Object.keys(localRecentMessages).length === 0) {
          try {
            const messagesResponse = await axiosPublic.get(
              `/recent-messages/${currentUser.email}`,
              {
                withCredentials: true,
              }
            );

            const recentMessagesMap = messagesResponse.data.reduce(
              (acc, { userEmail, lastMessage }) => {
                acc[userEmail] = lastMessage;
                return acc;
              },
              {}
            );

            setLocalRecentMessages(recentMessagesMap);
            localStorage.setItem(
              "recentMessages",
              JSON.stringify(recentMessagesMap)
            );
          } catch (error) {
            console.error("Error fetching recent messages:", error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();

    // Set up socket listener for new messages
    if (socketRef.current) {
      socketRef.current.on("receiveMessage", (message) => {
        const currentUserEmail = auth.currentUser?.email;
        if (!currentUserEmail) return;

        const otherUserEmail =
          message.senderId === currentUserEmail
            ? message.receiverId
            : message.senderId;

        // Update local state with the new message
        setLocalRecentMessages((prev) => {
          const updated = {
            ...prev,
            [otherUserEmail]: message,
          };
          // Store in localStorage for persistence
          localStorage.setItem("recentMessages", JSON.stringify(updated));
          return updated;
        });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage");
      }
    };
  }, []);

  // Update the sortedUsers useMemo to better prioritize recent messages
  const sortedUsers = useMemo(() => {
    if (!users.length) return [];

    return [...users].sort((a, b) => {
      // Use localRecentMessages instead of recentMessages prop
      const lastMessageA = localRecentMessages[a.email];
      const lastMessageB = localRecentMessages[b.email];

      // First priority: unread messages
      const hasUnreadA = unreadMessages[a.email] > 0;
      const hasUnreadB = unreadMessages[b.email] > 0;

      if (hasUnreadA && !hasUnreadB) return -1;
      if (!hasUnreadA && hasUnreadB) return 1;

      // Second priority: recent messages
      const hasRecentA = !!lastMessageA;
      const hasRecentB = !!lastMessageB;

      if (hasRecentA && !hasRecentB) return -1;
      if (!hasRecentA && hasRecentB) return 1;

      // Third priority: timestamp of recent messages
      const timestampA = lastMessageA
        ? new Date(lastMessageA.createdAt).getTime()
        : 0;
      const timestampB = lastMessageB
        ? new Date(lastMessageB.createdAt).getTime()
        : 0;

      return timestampB - timestampA;
    });
  }, [users, localRecentMessages, unreadMessages]);

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update the useEffect that handles initial user selection to respect navigation
  useEffect(() => {
    if (
      !loading &&
      filteredUsers.length > 0 &&
      !hasSelectedInitialUser.current
    ) {
      const storedUser = JSON.parse(localStorage.getItem("selectedUser"));

      // If a user is already selected (from navigation), don't override it
      if (selectedUserEmail) {
        console.log(
          "User already selected from navigation:",
          selectedUserEmail
        );
        hasSelectedInitialUser.current = true;
        return;
      }

      if (storedUser) {
        const storedUserInList = filteredUsers.find(
          (user) => user.email === storedUser.email
        );
        if (storedUserInList) {
          console.log(
            "Selecting stored user:",
            storedUserInList.name || storedUserInList.email
          );
          onSelectUser(storedUserInList);
        } else {
          const topUser = filteredUsers[0];
          console.log("Selecting top user:", topUser.name || topUser.email);
          onSelectUser(topUser);
          localStorage.setItem("selectedUser", JSON.stringify(topUser));
        }
      } else {
        const topUser = filteredUsers[0];
        console.log(
          "No stored user, selecting top user:",
          topUser.name || topUser.email
        );
        onSelectUser(topUser);
        localStorage.setItem("selectedUser", JSON.stringify(topUser));
      }

      hasSelectedInitialUser.current = true;
    }
  }, [loading, filteredUsers, selectedUserEmail, onSelectUser]);

  const handleSelectUser = (user) => {
    onSelectUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  return (
    <div
      className={`h-full border-r ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-800"
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
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-100 border-gray-300 text-gray-800"
          } border`}
        />
      </div>

      <div className="divide-y">
        {loading ? (
          <LoadingSpinner />
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            // Use localRecentMessages instead of recentMessages prop
            const lastMessage = localRecentMessages[user.email];
            const messageSnippet = lastMessage
              ? lastMessage.text.length > 25
                ? `${lastMessage.text.substring(0, 25)}...`
                : lastMessage.text
              : "No messages yet";

            const isUnread = unreadMessages[user.email] > 0;
            const isSentByCurrentUser =
              lastMessage && lastMessage.senderId === auth.currentUser?.email;
            const isRecent =
              lastMessage &&
              new Date().getTime() - new Date(lastMessage.createdAt).getTime() <
                3600000;

            return (
              <div
                key={user._id || user.email}
                onClick={() => handleSelectUser(user)}
                className={`p-4 cursor-pointer hover:bg-opacity-10 ${
                  selectedUserEmail === user.email
                    ? isDarkMode
                      ? "bg-purple-900 bg-opacity-30"
                      : "bg-purple-100"
                    : ""
                } ${
                  // Highlight background for users with unread messages
                  unreadMessages[user.email] > 0
                    ? isDarkMode
                      ? "bg-gray-700 bg-opacity-50"
                      : "bg-purple-50"
                    : ""
                } ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    {user.photo ? (
                      <img
                        src={
                          user.photo ||
                          "/placeholder.svg?height=40&width=40&text=User"
                        }
                        alt={user.name || "User"}
                        className={`w-10 h-10 rounded-full object-cover ${
                          // Add a subtle border for users with recent messages
                          localRecentMessages[user.email]
                            ? "border-2 border-purple-400"
                            : "border border-gray-300"
                        } ${isRecent ? "animate-pulse-once" : ""}`}
                        loading="eager"
                        fetchpriority="high"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src =
                            "/placeholder.svg?height=40&width=40&text=User"; // Local fallback image
                        }}
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } ${
                          // Add a subtle border for users with recent messages
                          localRecentMessages[user.email]
                            ? "border-2 border-purple-400"
                            : ""
                        }`}
                      >
                        {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                      </div>
                    )}

                    {unreadMessages[user.email] > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadMessages[user.email] > 9
                          ? "9+"
                          : unreadMessages[user.email]}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <p
                        className={`${
                          unreadMessages[user.email] > 0
                            ? "font-bold"
                            : "font-medium"
                        }`}
                      >
                        {user.name || "No name"}
                      </p>
                      {lastMessage && (
                        <p
                          className={`text-xs ${
                            unreadMessages[user.email] > 0
                              ? isDarkMode
                                ? "text-purple-300 font-semibold"
                                : "text-purple-600 font-semibold"
                              : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(lastMessage.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        isUnread
                          ? isDarkMode
                            ? "font-bold text-white"
                            : "font-bold text-purple-700"
                          : isSentByCurrentUser
                          ? isDarkMode
                            ? "text-gray-400 italic"
                            : "text-gray-500 italic"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {lastMessage &&
                        lastMessage.senderId === auth.currentUser?.email && (
                          <span className="mr-1">You:</span>
                        )}
                      {messageSnippet}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center">No users found</div>
        )}
      </div>
    </div>
  );
}
