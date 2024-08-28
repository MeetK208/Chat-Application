import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import session from "express-session";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import bodyParser from "body-parser"; // Optional, if using older versions of Express
// Fun Import
import { mongoConnect } from "./utils/db-connect.js";
import { upload } from "./utils/storeImage.js"; // Import the upload function
import { register } from "module";
import registerRoutes from "./routes/registerRoutes.js";
// import userRoutes from "./routes/userRoutes.js";

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

import { Server } from "socket.io";
// const { Server } = require("socket.io");

const io = new Server({ cors: "*" });

const newNsv = io.of("/user-namespace");

newNsv.on("connection", async (socket) => {
  // ...
  console.log("new user connected !!!");

  socket.on("disconnect", () => {
    console.log(" Disconnected");
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
