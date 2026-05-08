import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Chat Store ────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  type: string;
  content?: string | null;
  mediaUrl?: string | null;
  isDeleted: boolean;
  createdAt: string;
}

interface ChatState {
  rooms: any[];
  activeRoomId: string | null;
  messages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, string[]>;
  onlineUsers: Set<string>;
  setRooms: (rooms: any[]) => void;
  setActiveRoom: (id: string | null) => void;
  addMessage: (roomId: string, msg: ChatMessage) => void;
  setMessages: (roomId: string, msgs: ChatMessage[]) => void;
  setTyping: (roomId: string, userId: string, typing: boolean) => void;
  setOnline: (userId: string, online: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  setRooms: (rooms) => set({ rooms }),
  setActiveRoom: (id) => set({ activeRoomId: id }),
  addMessage: (roomId, msg) =>
    set((s) => ({ messages: { ...s.messages, [roomId]: [...(s.messages[roomId] || []), msg] } })),
  setMessages: (roomId, msgs) =>
    set((s) => ({ messages: { ...s.messages, [roomId]: msgs } })),
  setTyping: (roomId, userId, typing) =>
    set((s) => ({
      typingUsers: {
        ...s.typingUsers,
        [roomId]: typing
          ? [...new Set([...(s.typingUsers[roomId] || []), userId])]
          : (s.typingUsers[roomId] || []).filter((u) => u !== userId),
      },
    })),
  setOnline: (userId, online) =>
    set((s) => {
      const next = new Set(s.onlineUsers);
      online ? next.add(userId) : next.delete(userId);
      return { onlineUsers: next };
    }),
}));

// ── UI Store ──────────────────────────────────────────────────────────────────
interface UIState {
  sidebarCollapsed: boolean;
  activeSection: string;
  showAIAssistant: boolean;
  toggleSidebar: () => void;
  setSection: (s: string) => void;
  toggleAI: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeSection: "dashboard",
      showAIAssistant: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSection: (activeSection) => set({ activeSection }),
      toggleAI: () => set((s) => ({ showAIAssistant: !s.showAIAssistant })),
    }),
    {
      name: "alumniverse-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
);

// ── Notification Store ────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  setNotifications: (notifs: AppNotification[]) => void;
  addNotification: (notif: AppNotification) => void;
  markRead: (ids: string[]) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length }),
  addNotification: (notif) =>
    set((s) => ({
      notifications: [notif, ...s.notifications],
      unreadCount: s.unreadCount + (notif.isRead ? 0 : 1),
    })),
  markRead: (ids) =>
    set((s) => {
      const updated = s.notifications.map((n) =>
        ids.includes(n.id) ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      );
      return { notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));
