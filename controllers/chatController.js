import UserModel from "../models/userModel.js";
import ChatModel from "../models/chatModel.js";

export const saveController = async (req, res) => {
  try {
    const newChat = await ChatModel.create({
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
      message: req.body.message,
    });
    res.status(200).send({
      success: true,
      msg: "Chat Inserted",
      data: newChat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};
