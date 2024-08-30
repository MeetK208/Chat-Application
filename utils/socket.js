import { Server } from "socket.io";
import userModel from "../models/userModel.js"; // Adjust the import path as needed
import chatModel from "../models/chatModel.js";

export const initSocket = (server) => {
  const io = new Server(server, { cors: "*" });
  const newNsv = io.of("/user-namespace");

  newNsv.on("connection", async (socket) => {
    console.log("new user connected !!!");

    // Set User Online
    const userId = socket.handshake.auth.token;
    console.log(userId);
    await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          is_online: "1",
        },
      },
      { new: true }
    );

    // Broadcast Online Offline to All
    socket.broadcast.emit("sendOnlineBroadcast", { user_id: userId });

    socket.on("disconnect", async () => {
      console.log("Disconnected");
      // Set User Offline
      await userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            is_online: "0",
            lastseen: Date.now(),
          },
        },
        { new: true }
      );
      // Broadcast for offline user
      socket.broadcast.emit("sendOfflineBroadcast", { user_id: userId });
    });

    socket.on("newChat", (data) => {
      console.log("Broadcasting new chat:", data);
      socket.broadcast.emit("loadNewChat", data);
    });

    // Load Old Chats
    socket.on("existChat", async (data) => {
      console.log("Extracting Old Chat:", data);
      const userChat = await chatModel.find({
        $or: [
          {
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
          },
          {
            sender_id: data.receiver_id,
            receiver_id: data.sender_id,
          },
        ],
      });
      socket.emit("loadCHats", { chats: userChat });
    });
  });
};
