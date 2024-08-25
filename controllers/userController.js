import userModel from "../models/userModel.js";

export const getLoginController = async (req, res) => {
  try {
    res.render("login", {
      message: "Login Page",
      success: true,
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
      });
    }

    // comparePassword
    const isMatch = await isAvai.comparePassword(password);
    if (!isMatch) {
      return res.render("login", {
        message: "Invalid Username or Password",
        success: false,
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
        name: req.session.user.name,
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
