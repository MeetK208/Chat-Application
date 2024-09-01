import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/mailtrap/email.js";
export const getregisterController = async (req, res) => {
  try {
    console.log(" Register Page is Showing ");
    res.render("register", {
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in System",
      success: false,
    });
  }
};

export const postregisterController = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;
    const { file } = req;
    if (!name || !file || !email || !password || !mobileNumber) {
      return res.status(500).send({
        message: "Please Provide Required Feild",
        success: false,
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        message: "User Already Available!! Please Login",
        success: false,
      });
      res.redirect("api/v1/login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber: mobileNumber, // Set to null if not provided
      image: "images/" + file.filename, // Set to null if not provided
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    sendVerificationEmail(user.email, verificationToken);
    const userData = {
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      image: user.image,
    };
    // Create Token
    const token = user.createJWT();
    return res.render("varificationCode", {
      message: " ",
      success: true,
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await userModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.render("login", {
      message: "Please Long-in",
      success: true,
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getVerifyController = async (req, res) => {
  try {
    console.log(" Register Page is Showing ");
    res.render("varificationCode", {
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in System",
      success: false,
    });
  }
};

export const VerifyController = async (req, res) => {
  const { email, code } = req.body;
  console.log({ code, email });
  try {
    const isAval = await userModel.findOne({
      email: email,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    console.log(isAval);
    // If no matching user is found or the email is already verified
    if (!isAval || isAval.isVerified) {
      return res.render("login", {
        message: isAval
          ? "Your Email is Already Verified. Please Log-in!!"
          : "No user found or token expired.",
        success: !!isAval,
        logoutRoute: process.env.BASE_URL + "register/logout",
        homeRoute: process.env.BASE_URL + "register/home",
        baseurl: process.env.BASE_URL,
      });
    }

    // Check if the provided code matches the stored verification token
    if (isAval.verificationToken !== code) {
      return res.render("verificationCode", {
        message: "Registered E-mail or Code is incorrect",
        success: false,
        logoutRoute: process.env.BASE_URL + "register/logout",
        homeRoute: process.env.BASE_URL + "register/home",
        baseurl: process.env.BASE_URL,
      });
    }

    // If the code matches, update the user's verification status
    isAval.isVerified = true;
    await isAval.save();

    return res.render("login", {
      message: "Your Account is Verified",
      success: true,
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.render("verificationCode", {
      message: "An error occurred during verification. Please try again.",
      success: false,
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  }
};
