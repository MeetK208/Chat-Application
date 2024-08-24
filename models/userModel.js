import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: [true, "email is Required"],
    },
    mobileNumber: {
      type: Number,
      required: [true, "Phone Number is Required"],
    },
    image: {
      type: String,
      required: [true, "Profile Photo is Required"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    is_online: {
      type: String,
      default: "0",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

export default mongoose.model("User", userSchema);
