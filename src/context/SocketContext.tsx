"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getSocket,
  joinOrganizerRoom,
  joinVolunteerRoom,
} from "../services/socket";

export interface RealtimeNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

interface SocketContextType {
  notifications: RealtimeNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    if (isAuthenticated && user) {
      if (user.role === "organizer") {
        joinOrganizerRoom(user._id);

        // New volunteer registration alert
        socket.on("registration:new", (reg: any) => {
          const newNotif: RealtimeNotification = {
            id: Date.now().toString(),
            title: "New Volunteer Registered! 🎉",
            message: `${reg.volunteer?.name || "A volunteer"} registered for "${reg.event?.title || "your event"}" (${reg.selectedSkill})`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "success",
            read: false,
          };
          setNotifications((prev) => [newNotif, ...prev]);
        });

        // Volunteer cancellation alert
        socket.on("registration:cancelled", (data: any) => {
          const newNotif: RealtimeNotification = {
            id: Date.now().toString(),
            title: "Registration Cancelled ℹ️",
            message: `A volunteer cancelled their registration. A slot has freed up.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "warning",
            read: false,
          };
          setNotifications((prev) => [newNotif, ...prev]);
        });
      } else if (user.role === "volunteer") {
        joinVolunteerRoom(user._id);

        // Volunteer status update alert
        socket.on("registration:statusChanged", (reg: any) => {
          const statusText =
            reg.status === "confirmed"
              ? "Confirmed! ✅"
              : reg.status === "attended"
              ? "Marked as Attended! 🌟"
              : reg.status === "cancelled"
              ? "Cancelled ❌"
              : reg.status;

          const newNotif: RealtimeNotification = {
            id: Date.now().toString(),
            title: `Status Update: ${statusText}`,
            message: `Your registration for "${reg.event?.title || "event"}" is now ${reg.status}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: reg.status === "cancelled" ? "warning" : "success",
            read: false,
          };
          setNotifications((prev) => [newNotif, ...prev]);
        });
      }
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("registration:new");
      socket.off("registration:cancelled");
      socket.off("registration:statusChanged");
    };
  }, [user, isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        clearNotifications,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
