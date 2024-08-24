import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getregisterController = async (req, res) => {
  try {
    console.log(" Register Page is Showing ");
    res.render("register");
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
      res.status(500).send({
        message: "User Already Available!! Please Login",
        success: false,
      });
      res.redirect("api/v1/login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber: mobileNumber, // Set to null if not provided
      image: "images/" + file.filename, // Set to null if not provided
    });

    const userData = {
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      image: user.image,
    };
    // Create Token
    const token = user.createJWT();
    return res.render("login", {
      message: " ",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Register",
      success: false,
    });
  }
};
