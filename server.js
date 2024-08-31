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
import chatModel from "./models/chatModel.js";
import registerRoutes from "./routes/registerRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initSocket } from "./utils/socket.js"; // Adjust the import path as needed

dotenv.config();
mongoConnect();
const app = express();

// Middelware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.set("view engine", "ejs"); // Set Template Engine to Render HTML
app.set("views", "./views");

app.use(express.static("./public")); // To Store Static Data
app.use(session({ secret: process.env.SESSION_SECRET })); // session

app.use("/api/v1/register/", registerRoutes);
app.use("/api/v1/chat/", chatRoutes);

import http from "http";
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Unwanted Routes
app.get("*", function (req, res) {
  res.redirect(process.env.BASE_URL + "register/login");
});

// Define Port and MODE
const PORT = process.env.PORT || 8080; //Port No from Config File
const DEV_MODE = process.env.DEV_MODE || "Development"; // DEV_MODE from Config File

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Node Server Running in ${DEV_MODE} Mode on Port No ${PORT}`);
});
