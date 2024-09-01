import { MailtrapClient } from "mailtrap";
// import http from "http";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const mailtrapClient = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.MAILTRAP_PORT,
  secure: true, // Must be true, false will fail
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sender = {
  email: process.env.MAILTRAP_USER,
  name: "Chat Application",
};
