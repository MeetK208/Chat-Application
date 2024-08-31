import userModel from "../models/userModel.js";
import fs from "fs";

export const getLoginController = async (req, res) => {
  try {
    res.render("login", {
      message: "Login Page",
      success: true,
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        message: "Please Provide All Feild",
        success: false,
      });
    }

    // Find USerAvailable or not
    const isAvai = await userModel.findOne({ email });
    if (!isAvai) {
      return res.render("login", {
        message: "Invalid Username or Password",
        success: false,
        logoutRoute: process.env.BASE_URL + "register/logout",
        homeRoute: process.env.BASE_URL + "register/home",
        baseurl: process.env.BASE_URL,
      });
    }

    // comparePassword
    const isMatch = await isAvai.comparePassword(password);
    if (!isMatch) {
      return res.render("login", {
        message: "Invalid Username or Password",
        success: false,
        logoutRoute: process.env.BASE_URL + "register/logout",
        homeRoute: process.env.BASE_URL + "register/home",
        baseurl: process.env.BASE_URL,
      });
    }

    isAvai.password = undefined;
    // const token = isAvai.createJWT();
    // To Store Data in Session
    req.session.user = isAvai;

    res.redirect(process.env.BASE_URL + "register/home");
  } catch (error) {
    console.log(error);
  }
};

export const logoutController = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect(process.env.BASE_URL + "register/login");
  } catch (error) {
    console.log(error);
  }
};

export const homePageController = async (req, res) => {
  try {
    console.log("Here I am HOME");
    if (req.session.user) {
      console.log(req.session.user.name); // Should now correctly log the user's name
      var userS = await userModel.find({
        _id: { $nin: [req.session.user._id] },
      });
      return res.render("home", {
        currentUser: req.session.user,
        logoutRoute: process.env.BASE_URL + "register/logout",
        homeRoute: process.env.BASE_URL + "register/home",
        users: userS,
        success: true,
      });
    } else {
      return res.redirect(process.env.BASE_URL + "register/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const editUserProfile = async (req, res) => {
  console.log("Request body: ", req.body);
  console.log("Uploaded file: ", req.file);

  const { name, mobileNumber } = req.body;
  const { file } = req;
  const userId = req.session.user._id;

  // Initialize updateValues object
  const updateValues = {};

  if (name) {
    updateValues.name = name;
  }

  if (mobileNumber) {
    updateValues.mobileNumber = mobileNumber;
  }

  if (file) {
    updateValues.image = "images/" + file.filename;
    console.log(" Old " + req.session.user.image);
    console.log("New" + updateValues.image);
    deleteFile(req.session.user.image);
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateValues,
      { new: true }
    );
    console.log("Updated user: ", updatedUser);
    req.session.user = updatedUser; // re update session with new value
    res.redirect(process.env.BASE_URL + "register/home");
  } catch (error) {
    console.error("Error updating user profile: ", error);
    res.status(500).send("Error updating profile");
  }
};

export const geteditUserProfile = async (req, res) => {
  try {
    res.render("edit", {
      message: "Edit Page",
      success: true,
      currentUser: req.session.user,
      logoutRoute: process.env.BASE_URL + "register/logout",
      homeRoute: process.env.BASE_URL + "register/home",
      baseurl: process.env.BASE_URL,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteFile = (filename) => {
  var filePath = "public\\"; // Replace with the actual path to your file
  console.log(filename);
  filePath += filename;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return;
    }

    console.log(`File ${filePath} has been successfully removed.`);
  });
};
