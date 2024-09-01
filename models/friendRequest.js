import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isFriend: {
      type: Boolean,
      default: false,
    },
    connectedTimestamp: { 
      type: Date,
    },
    requestSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
