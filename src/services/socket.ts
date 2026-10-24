import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("⚡ Realtime connected to Volunexa:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Realtime disconnected from Volunexa");
    });
  }
  return socket;
};

export const joinEventRoom = (eventId: string) => {
  const s = getSocket();
  if (s) s.emit("join:event", eventId);
};

export const leaveEventRoom = (eventId: string) => {
  const s = getSocket();
  if (s) s.emit("leave:event", eventId);
};

export const joinOrganizerRoom = (organizerId: string) => {
  const s = getSocket();
  if (s) s.emit("join:organizer", organizerId);
};

export const joinVolunteerRoom = (volunteerId: string) => {
  const s = getSocket();
  if (s) s.emit("join:volunteer", volunteerId);
};
