import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { Server } from "socket.io";
import { verifyAccessToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

const app = express();
const httpServer = http.createServer(app);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.NEXT_PUBLIC_APP_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
  });
});

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: process.env.NEXT_PUBLIC_APP_URL, credentials: true },
  pingTimeout: 60000,
  pingInterval: 25000,
});

interface OnlineUser {
  userId: string;
  socketId: string;
  role: string;
  joinedAt: Date;
}

const onlineUsers = new Map<string, OnlineUser>();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized: No token"));
  try {
    const payload = verifyAccessToken(token) as any;
    socket.data.userId = payload.userId;
    socket.data.role = payload.role;
    next();
  } catch {
    next(new Error("Unauthorized: Invalid token"));
  }
});

io.on("connection", async (socket) => {
  const { userId, role } = socket.data;

  // Track online
  onlineUsers.set(userId, { userId, socketId: socket.id, role, joinedAt: new Date() });
  socket.join(`user:${userId}`);

  // Broadcast online status
  socket.broadcast.emit("user:online", { userId });

  // ── Send Message ─────────────────────────────────────────────────────────
  socket.on("message:send", async ({ chatRoomId, content, type = "TEXT" }) => {
    try {
      // Verify user is member of this room
      const membership = await prisma.chatRoomMember.findUnique({
        where: { chatRoomId_userId: { chatRoomId, userId } },
      });
      if (!membership) return socket.emit("error", { message: "Not a member of this room" });

      const message = await prisma.message.create({
        data: { chatRoomId, senderId: userId, content, type },
        include: {
          sender: {
            select: {
              id: true,
              studentProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
              alumniProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
          },
        },
      });

      // Get other members
      const members = await prisma.chatRoomMember.findMany({
        where: { chatRoomId, userId: { not: userId } },
        select: { userId: true },
      });

      // Emit to members
      for (const { userId: memberId } of members) {
        io.to(`user:${memberId}`).emit("message:received", { ...message, chatRoomId });

        // Push notification for offline users
        if (!onlineUsers.has(memberId)) {
          await prisma.notification.create({
            data: {
              userId: memberId,
              type: "MESSAGE_RECEIVED",
              title: "New Message",
              body: content?.slice(0, 80) || "New media message",
              data: { chatRoomId },
            },
          }).catch(() => {});
        }
      }

      socket.emit("message:sent", { messageId: message.id, chatRoomId, createdAt: message.createdAt });
    } catch (err) {
      console.error("[Socket:message:send]", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // ── Typing ───────────────────────────────────────────────────────────────
  socket.on("typing:start", ({ chatRoomId, recipientId }) => {
    io.to(`user:${recipientId}`).emit("typing:start", { userId, chatRoomId });
  });

  socket.on("typing:stop", ({ chatRoomId, recipientId }) => {
    io.to(`user:${recipientId}`).emit("typing:stop", { userId, chatRoomId });
  });

  // ── Read Receipt ─────────────────────────────────────────────────────────
  socket.on("message:read", async ({ chatRoomId }) => {
    await prisma.chatRoomMember
      .updateMany({ where: { chatRoomId, userId }, data: { lastReadAt: new Date() } })
      .catch(() => {});
    socket.to(`room:${chatRoomId}`).emit("message:seen", { userId, chatRoomId });
  });

  // ── Admin Broadcast ──────────────────────────────────────────────────────
  socket.on("admin:broadcast", ({ message, targetRoles }) => {
    if (!["ADMIN", "DEVELOPER"].includes(role)) return;
    onlineUsers.forEach((user) => {
      if (!targetRoles || targetRoles.includes(user.role)) {
        io.to(`user:${user.userId}`).emit("broadcast", { message });
      }
    });
  });

  // ── Stats (for developer panel) ──────────────────────────────────────────
  socket.on("dev:stats", (cb) => {
    if (role !== "DEVELOPER") return;
    cb({
      onlineUsers: onlineUsers.size,
      connections: io.engine.clientsCount,
      rooms: io.sockets.adapter.rooms.size,
    });
  });

  // ── Activity Feed ─────────────────────────────────────────────────────────
  socket.on("activity:join", () => socket.join("activity-feed"));

  // ── Disconnect ───────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    socket.broadcast.emit("user:offline", { userId });
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🔌 Socket.IO server running on port ${PORT}`);
});

export { io };
