"use client";

import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";
import ThemeContext from "../../Context/ThemeContext";
import useAuth from "../../../hooks/useAuth";

const NotificationHandler = () => {
  const { user } = useAuth();
  const { isDarkMode } = useContext(ThemeContext);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Initialize socket connection
  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io("https://un-aux.onrender.com", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      // Listen for notifications
      socketRef.current.on("receiveNotification", (notification) => {
        console.log(
          "New notification received in NotificationHandler:",
          notification
        );

        // Show toast notification
        toast.success(notification.title, {
          description: notification.message,
          position: "top-right",
          duration: 5000,
        });

        // Special handling for auction win notifications
        if (notification.type === "auction-win" && notification.auctionData) {
          handleAuctionWinNotification(notification);
        } else if (
          notification.type === "announcement" &&
          notification.announcementData
        ) {
          handleAnnouncementNotification(notification);
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user, navigate]);

  const handleAnnouncementNotification = (notification) => {
    // You can implement special handling for announcement notifications here
    console.log("Handling announcement notification:", notification);
  };

  const handleAuctionWinNotification = (notification) => {
    // Special handling for auction win notifications
    console.log("Handling auction win notification:", notification);

    // Show a more prominent toast for auction wins
    toast.success("🏆 Congratulations! You won an auction!", {
      description: "Click to view details and complete your purchase.",
      duration: 10000,
      position: "top-center",
      onClick: () => viewNotificationDetails(notification),
    });
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Update in database
      await axios.put(
        `https://un-aux.onrender.com/notifications/mark-read/${user.email}`,
        { notificationId },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const viewNotificationDetails = (notification) => {
    // Mark as read
    markNotificationAsRead(notification._id);

    // Navigate based on notification type - ALWAYS go to announcement page for all notifications
    if (
      notification.type === "announcement" &&
      notification.announcementData?._id
    ) {
      // Navigate to announcement details with the notification data
      navigate(`/announcementDetails/${notification.announcementData._id}`, {
        state: { notificationDetails: notification },
      });
    } else if (
      notification.type === "auction-win" &&
      notification.auctionData?._id
    ) {
      // For auction win notifications, navigate to announcement page with notification data
      navigate("/dashboard/announcement", {
        state: { notificationDetails: notification },
      });
    } else {
      // For any other notification type, go to announcement page
      navigate("/dashboard/announcement", {
        state: { notificationDetails: notification },
      });
    }
  };

  return null;
};

export default NotificationHandler;
