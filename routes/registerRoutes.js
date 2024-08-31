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
  homePageController,
  geteditUserProfile,
  editUserProfile,
} from "../controllers/userController.js";
import { isLogin, isLogout, isOnWrongURL } from "../middlewares/auth.js";

const router = express.Router();
// routes register Post
router.get("/", isLogout, getregisterController);
router.post("/", upload.single("image"), postregisterController);

router.get("/login/", isLogout, getLoginController);
router.post("/login/", loginController);

router.get("/logout/", logoutController);
router.get("/home/", isLogin, homePageController);

router.get("/edit-profile/", isLogin, geteditUserProfile);
router.post("/edit-profile/", isLogin, upload.single("image"), editUserProfile);

router.get("*", isOnWrongURL, function (req, res) {
  res.redirect(process.env.BASE_URL + "register/login");
});
// export
export default router;
