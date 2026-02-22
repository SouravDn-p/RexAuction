import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create the context
const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(apiUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance.close();
      }
    };
  }, [apiUrl]);

  // Reconnect function
  const reconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  // Join room function
  const joinRoom = (roomId) => {
    if (socket && roomId) {
      socket.emit("joinChat", { roomId });
    }
  };

  // Leave room function
  const leaveRoom = (roomId) => {
    if (socket && roomId) {
      socket.emit("leaveAllRooms");
    }
  };

  // Send message function
  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit("sendMessage", messageData);
    }
  };

  // Send notification function
  const sendNotification = (notificationData) => {
    if (socket) {
      socket.emit("sendNotification", notificationData);
    }
  };

  // Join auction room
  const joinAuction = (auctionId) => {
    if (socket && auctionId) {
      socket.emit("joinAuction", { auctionId });
    }
  };

  // Leave auction room
  const leaveAuction = (auctionId) => {
    if (socket && auctionId) {
      socket.emit("leaveAuction", { auctionId });
    }
  };

  // Place bid
  const placeBid = (bidData) => {
    if (socket) {
      socket.emit("placeBid", bidData);
    }
  };

  const value = {
    socket,
    isConnected,
    reconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendNotification,
    joinAuction,
    leaveAuction,
    placeBid,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Also export the context itself if needed
export default SocketContext;