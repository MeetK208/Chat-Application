import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import session from "express-session";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser"; // Optional, if using older versions of Express
import { Server } from "socket.io";

// Fun Import
import { mongoConnect } from "./utils/db-connect.js";
import { upload } from "./utils/storeImage.js"; // Import the upload function
import { register } from "module";
import userModel from "./models/userModel.js";
import registerRoutes from "./routes/registerRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
mongoConnect();
const app = express();

// Middelware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Set Template Engine to Render HTML
app.set("view engine", "ejs");
app.set("views", "./views");

// To Store Static Data
app.use(express.static("./public"));

// session
app.use(session({ secret: process.env.SESSION_SECRET }));

console.log("server.js");
app.use("/api/v1/register/", registerRoutes);
app.use("/api/v1/chat/", chatRoutes);
// const { Server } = require("socket.io");

const io = new Server({ cors: "*" });

const newNsv = io.of("/user-namespace");

newNsv.on("connection", async (socket) => {
  // ...
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

  // BroadCast Online Offline to All so that they get to know that user is currently is offline
  socket.broadcast.emit("sendOnlineBroadcast", { user_id: userId });

  socket.on("disconnect", async () => {
    console.log(" Disconnected");
    // Set User Offline
    await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          is_online: "0",
        },
      },
      { new: true }
    );
    // BroadCast for offline user
    socket.broadcast.emit("sendOfflineBroadcast", { user_id: userId });
  });
});

io.listen(3000);

app.get("*", function (req, res) {
  res.redirect(process.env.BASE_URL + "register/login");
});

// Define Port and MODE
const PORT = process.env.PORT || 8080; //Port No from Config File
const DEV_MODE = process.env.DEV_MODE || "Development"; // DEV_MODE from Config File

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Node Server Running in ${DEV_MODE} Mode on Port No ${PORT}`);
});
