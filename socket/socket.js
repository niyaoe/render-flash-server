const { Server } = require("socket.io");
const Message = require("../models/Message");
const Room = require("../models/Room"); // 🔥 NEW

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
       SEND MESSAGE (GLOBAL)
    ========================== */
    socket.on("send_message", async (data) => {
      try {
        if (!data) return;

        const { user, message, avatar, time } = data;

        

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

        if (message.length > 500) {
          return console.log("Message too long");
        }

        const savedMessage = await Message.create({
          room: "global_room",
          user: user.trim(),
          message: message.trim(),
          avatar: avatar || "",
          time: time || "",
        });

        socket.to("global_room").emit("receive_message", savedMessage);
        socket.emit("receive_message", savedMessage);
      } catch (err) {
        console.log("Socket error:", err);
      }
    });

    /* =========================
       🔥 ROOM CHAT (UPDATED)
    ========================== */

    // JOIN ROOM + STORE USERS IN DB
    socket.on("join_room", async ({ roomId, user }) => {
      if (!roomId || !user) return;

      socket.join(roomId);

      const updatedRoom = await Room.findOneAndUpdate(
        { roomId },
        {
          $pull: { users: { socketId: socket.id } }, // remove old if exists
        },
        { new: true, upsert: true },
      );

      const finalRoom = await Room.findOneAndUpdate(
        { roomId },
        {
          $push: {
            users: {
              socketId: socket.id,
              name: user.name,
              avatar: user.avatar,
            },
          },
          $setOnInsert: { createdBy: user.name },
        },
        { new: true },
      );

      io.to(roomId).emit("room_users", finalRoom.users);

      console.log(`User ${user.name} joined room ${roomId}`);
    });

    // SEND ROOM MESSAGE
    socket.on("send_room_message", async (data) => {
      try {
        const { room, user, message, avatar, time } = data;

        if (!room || !user || !message) return;

        const savedMessage = await Message.create({
          room,
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

    // LEAVE ROOM
    socket.on("leave_room", async (roomId) => {
      socket.leave(roomId);

      const room = await Room.findOneAndUpdate(
        { roomId },
        {
          $pull: { users: { socketId: socket.id } },
        },
        { new: true },
      );

      if (room) {
        io.to(roomId).emit("room_users", room.users);
      }
    });

    /* =========================
       DISCONNECT (REMOVE USER)
    ========================== */
    socket.on("disconnect", async () => {
      try {
        await Room.updateMany(
          { "users.socketId": socket.id },
          {
            $pull: { users: { socketId: socket.id } },
          },
        );

        const rooms = await Room.find({
          "users.socketId": { $exists: false },
        });

        for (const room of rooms) {
          io.to(room.roomId).emit("room_users", room.users);
        }

        console.log("User disconnected:", socket.id);
      } catch (err) {
        console.log(err);
      }
    });
  });

  return io;
};

module.exports = initSocket;
