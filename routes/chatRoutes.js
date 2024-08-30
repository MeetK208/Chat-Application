import { saveController } from "../controllers/chatController.js";
import { isLogin, isLogout, isOnWrongURL } from "../middlewares/auth.js";
import express from "express";

console.log("saveController");
const router = express.Router();
router.post("/save-chat", saveController);

export default router;
