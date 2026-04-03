const { Server } = require("socket.io");
const Message = require("../models/Message");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* =========================
       JOIN GLOBAL CHAT
    ========================== */
    socket.on("join_global", () => {
      socket.join("global_room");
      console.log("User joined global_room:", socket.id);
    });

    /* =========================
       SEND MESSAGE
    ========================== */
    socket.on("send_message", async (data) => {
      try {
        // 🔒 BASIC VALIDATION
        if (!data) return;

        const { user, message, avatar, time } = data;

        // check required fields
        if (!user || typeof user !== "string" || user.trim().length < 2) {
          return console.log("Invalid user");
        }

        if (
          !message ||
          typeof message !== "string" ||
          message.trim().length === 0
        ) {
          return console.log("Invalid message");
        }

        // optional limits (prevents spam)
        if (message.length > 500) {
          return console.log("Message too long");
        }

        // sanitize
        const cleanMessage = message.trim();

        // 💾 SAVE TO DB
        const savedMessage = await Message.create({
          room: "global_room", // 🔥 ADD THIS LINE
          user: user.trim(),
          message: cleanMessage,
          avatar: avatar || "",
          time: time || "",
        });

        // 📡 SEND TO OTHERS
        socket.to("global_room").emit("receive_message", savedMessage);

        // 📡 SEND BACK TO SENDER
        socket.emit("receive_message", savedMessage);
      } catch (err) {
        console.log("Socket error:", err);
      }
    });

    /* =========================
       🔥 ROOM CHAT (NEW)
    ========================== */

    // JOIN ROOM
    socket.on("join_room", (roomId) => {
      if (!roomId) return;

      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // SEND ROOM MESSAGE
    socket.on("send_room_message", async (data) => {
      try {
        const { room, user, message, avatar, time } = data;

        if (!room || !user || !message) return;

        const savedMessage = await Message.create({
          room, // 🔥 important
          user,
          message: message.trim(),
          avatar: avatar || "",
          time: time || "",
        });

        socket.to(room).emit("receive_room_message", savedMessage);
        socket.emit("receive_room_message", savedMessage);
      } catch (err) {
        console.log(err);
      }
    });

    // LEAVE ROOM (optional)
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`User left room ${roomId}`);
    });

    /* =========================
       DISCONNECT
    ========================== */
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
