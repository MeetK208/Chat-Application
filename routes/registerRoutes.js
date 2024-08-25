import express from "express";
import bcrypt from "bcryptjs";

import {
  getregisterController,
  postregisterController,
} from "../controllers/registerController.js";
import { upload } from "../utils/storeImage.js";
import {
  getLoginController,
  loginController,
  logoutController,
} from "../controllers/userController.js";
import { isLogin, isLogout } from "../middlewares/auth.js";

const router = express.Router();
// routes register Post
router.get("/", isLogout, getregisterController);
router.post("/", upload.single("image"), postregisterController);
router.get("/login/", isLogin, getLoginController);
router.post("/login/", loginController);
router.get("/logout/", logoutController);
router.get("/home/");
router.get("*", function (req, res) {
  res.redirect(process.env.BASE_URL + "register/login");
});
// export
export default router;
