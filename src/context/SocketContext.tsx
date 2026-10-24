"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getSocket,
  joinOrganizerRoom,
  joinVolunteerRoom,
  joinUserRoom,
} from "../services/socket";
import { api } from "../services/api";

export interface RealtimeNotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  type: "info" | "success" | "warning" | "alert";
  isRead: boolean;
  relatedEvent?: {
    _id: string;
    title: string;
    date?: string;
    location?: string;
  };
}

interface SocketContextType {
  notifications: RealtimeNotification[];
  unreadCount: number;
  activeToast: RealtimeNotification | null;
  dismissToast: () => void;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  pushPermission: NotificationPermission;
  requestPushPermission: () => Promise<NotificationPermission>;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeToast, setActiveToast] = useState<RealtimeNotification | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  // Check initial browser notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  // Request native Desktop Push Notification permission
  const requestPushPermission = async (): Promise<NotificationPermission> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      return permission;
    } catch {
      return "denied";
    }
  };

  // Trigger native Desktop Push notification if permitted
  const triggerDesktopNotification = (notif: RealtimeNotification) => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        const desktopNotif = new Notification(notif.title, {
          body: notif.message,
          icon: "/favicon.ico",
        });

        desktopNotif.onclick = () => {
          window.focus();
          if (notif.relatedEvent?._id) {
            window.location.href = `/events/${notif.relatedEvent._id}`;
          }
        };
      } catch (err) {
        console.warn("Could not fire native desktop notification:", err);
      }
    }
  };

  // Fetch initial persisted notifications from backend
  const fetchPersistedNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getNotifications(1, 30);
      if (res && res.success) {
        const formatted: RealtimeNotification[] = (res.notifications || []).map((n: any) => ({
          _id: n._id || n.id || String(Date.now()),
          title: n.title,
          message: n.message,
          createdAt: n.createdAt || new Date().toISOString(),
          type: n.type || "info",
          isRead: Boolean(n.isRead),
          relatedEvent: n.relatedEvent,
        }));
        setNotifications(formatted);
        setUnreadCount(res.unreadCount ?? formatted.filter((x) => !x.isRead).length);
      }
    } catch (err) {
      console.warn("Failed to fetch notifications from backend:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPersistedNotifications();
  }, [fetchPersistedNotifications]);

  // Handle incoming real-time notifications
  const handleIncomingNotification = useCallback(
    (notif: any) => {
      const formatted: RealtimeNotification = {
        _id: notif._id || notif.id || String(Date.now()),
        title: notif.title || "New Notification",
        message: notif.message || "",
        createdAt: notif.createdAt || new Date().toISOString(),
        type: notif.type || "info",
        isRead: false,
        relatedEvent: notif.relatedEvent,
      };

      setNotifications((prev) => {
        // Prevent duplicate IDs
        if (prev.some((item) => item._id === formatted._id)) {
          return prev;
        }
        return [formatted, ...prev];
      });

      setUnreadCount((prev) => prev + 1);

      // Show in-app popup toast
      setActiveToast(formatted);

      // Trigger native OS/Browser push notification
      triggerDesktopNotification(formatted);
    },
    []
  );

  // Auto-dismiss in-app toast after 5 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeToast]);

  const dismissToast = () => setActiveToast(null);

  // Socket connection and room subscriptions
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    if (isAuthenticated && user) {
      const userIdStr = String(user._id);

      // Join individual user room
      joinUserRoom(userIdStr);

      if (user.role === "organizer") {
        joinOrganizerRoom(userIdStr);
      } else if (user.role === "volunteer") {
        joinVolunteerRoom(userIdStr);
      }

      // Listen for dedicated backend push notifications
      socket.on("notification:push", handleIncomingNotification);

      // Listen for legacy socket events as fallback
      socket.on("registration:new", (reg: any) => {
        // If not already handled by notification:push
        if (user.role === "organizer") {
          handleIncomingNotification({
            _id: `reg_${Date.now()}`,
            title: "New Volunteer Registered! 🎉",
            message: `${reg.volunteer?.name || "A volunteer"} registered for "${reg.event?.title || "your event"}" (${reg.selectedSkill || "general"})`,
            type: "success",
            createdAt: new Date().toISOString(),
            relatedEvent: reg.event,
          });
        }
      });

      socket.on("registration:cancelled", (data: any) => {
        if (user.role === "organizer") {
          handleIncomingNotification({
            _id: `cancel_${Date.now()}`,
            title: "Registration Cancelled ℹ️",
            message: `A volunteer cancelled their registration. A slot has freed up.`,
            type: "warning",
            createdAt: new Date().toISOString(),
          });
        }
      });

      socket.on("registration:statusChanged", (reg: any) => {
        if (user.role === "volunteer") {
          const statusText =
            reg.status === "confirmed"
              ? "Confirmed! ✅"
              : reg.status === "attended"
              ? "Marked as Attended! 🌟"
              : reg.status === "cancelled"
              ? "Cancelled ❌"
              : reg.status;

          handleIncomingNotification({
            _id: `status_${Date.now()}`,
            title: `Status Update: ${statusText}`,
            message: `Your registration for "${reg.event?.title || "event"}" is now ${reg.status}.`,
            type: reg.status === "cancelled" ? "warning" : "success",
            createdAt: new Date().toISOString(),
            relatedEvent: reg.event,
          });
        }
      });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification:push");
      socket.off("registration:new");
      socket.off("registration:cancelled");
      socket.off("registration:statusChanged");
    };
  }, [user, isAuthenticated, handleIncomingNotification]);

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      if (isAuthenticated) {
        await api.markNotificationsAsRead();
      }
    } catch (err) {
      console.warn("Error marking notifications as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const target = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      if (isAuthenticated && !id.startsWith("reg_") && !id.startsWith("status_") && !id.startsWith("cancel_")) {
        await api.deleteNotification(id);
      }
    } catch (err) {
      console.warn("Error deleting notification:", err);
    }
  };

  const clearNotifications = async () => {
    try {
      setNotifications([]);
      setUnreadCount(0);
      if (isAuthenticated) {
        await api.clearAllNotifications();
      }
    } catch (err) {
      console.warn("Error clearing notifications:", err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        dismissToast,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
        pushPermission,
        requestPushPermission,
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
