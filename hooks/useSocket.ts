"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/stores";
import { useNotificationStore } from "@/store/stores";

let socketInstance: Socket | null = null;

export function useSocket() {
  const { accessToken, user } = useAuthStore();
  const { addMessage, setTyping, setOnline } = useChatStore();
  const { addNotification } = useNotificationStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!accessToken || !user || initialized.current) return;
    initialized.current = true;

    socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("[Socket] Connected:", socketInstance?.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    // Chat events
    socketInstance.on("message:received", (data) => {
      addMessage(data.chatRoomId, data);
    });

    socketInstance.on("typing:start", ({ userId, chatRoomId }: any) => {
      setTyping(chatRoomId, userId, true);
    });

    socketInstance.on("typing:stop", ({ userId, chatRoomId }: any) => {
      setTyping(chatRoomId, userId, false);
    });

    // Online status
    socketInstance.on("user:online", ({ userId }: any) => setOnline(userId, true));
    socketInstance.on("user:offline", ({ userId }: any) => setOnline(userId, false));

    // Notifications
    socketInstance.on("notification:new", (notif: any) => {
      addNotification(notif);
    });

    socketInstance.on("broadcast", ({ message }: any) => {
      addNotification({
        id: `broadcast-${Date.now()}`,
        type: "ANNOUNCEMENT",
        title: "Admin Broadcast",
        body: message,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
      initialized.current = false;
    };
  }, [accessToken, user?.id]);

  return {
    socket: socketInstance,

    sendMessage: (roomId: string, content: string, type = "TEXT") => {
      socketInstance?.emit("message:send", { chatRoomId: roomId, content, type });
    },

    startTyping: (roomId: string, recipientId: string) => {
      socketInstance?.emit("typing:start", { chatRoomId: roomId, recipientId });
    },

    stopTyping: (roomId: string, recipientId: string) => {
      socketInstance?.emit("typing:stop", { chatRoomId: roomId, recipientId });
    },

    markRead: (roomId: string) => {
      socketInstance?.emit("message:read", { chatRoomId: roomId });
    },

    joinActivityFeed: () => {
      socketInstance?.emit("activity:join");
    },

    isConnected: () => socketInstance?.connected ?? false,
  };
}
