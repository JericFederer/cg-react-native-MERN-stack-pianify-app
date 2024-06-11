import { RequestHandler } from "express";
import nodemailer from 'nodemailer';
import path from "path";

import { CreateUser } from "../@types/user";
import User from "../models/user";
import EmailVerificationToken from "../models/emailVerificationToken";
import { MAILTRAP_PASSWORD, MAILTRAP_USER } from "../utils/variable";
import { generateOtpToken } from "../utils/helper";
import { generateTemplate } from "../mail/template";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({
    name,
    email,
    password
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD
    }
  });

  const otpToken = generateOtpToken();

  await EmailVerificationToken.create({
    owner: newUser._id,
    token: otpToken,
  })

  const welcomeMessage = `Hi ${ name }, welcome to Pianify! Use the given OTP to verify your email.`

  transport.sendMail({
    to: newUser.email,
    from: "authThisEmail@pianify.com",
    subject: "Welcome message",
    html: generateTemplate({
      title: "Welcome to Pianify",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: otpToken,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });

  res.status(201).json({ newUser });
}