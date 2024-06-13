import nodemailer from 'nodemailer';
import path from "path";

import EmailVerificationToken from "../models/emailVerificationToken";
import {
  MAILTRAP_PASSWORD,
  MAILTRAP_USER,
  VERIFICATION_EMAIL,
  SIGN_IN_URL
} from "../utils/variable";
import { generateOtpToken } from "../utils/helper";
import { generateTemplate } from "../mail/template";

interface Profile {
  name: string;
  email: string;
  userId: string;
}

interface Options {
  email: string;
  link: string;
}

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD
    }
  });

  return transport;
}

export const sendVerificationMail = async (
  token: string,
  profile: Profile
) => {
  const transport = generateMailTransporter();
  const otpToken = generateOtpToken();
  const { name, email, userId } = profile;

  await EmailVerificationToken.create({
    owner: userId,
    token: otpToken,
  })

  const welcomeMessage = `Hi ${ name }, welcome to Pianify! Use the given OTP to verify your email.`

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
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
}

export const sendPasswordResetLink = async (
  options: Options
) => {
  const transport = generateMailTransporter();
  const { email, link } = options;
  const message = "Password reset link has been sent."

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Reset Link",
    html: generateTemplate({
      title: "Password Reset",
      message,
      logo: "cid:logo",
      banner: "cid:forgot_password",
      link,
      btnTitle: "Password Reset",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forgot_password.png",
        path: path.join(__dirname, "../mail/forgot_password.png"),
        cid: "forgot_password",
      },
    ],
  });
}

export const sendPasswordResetSuccessEmail = async (
  name: string,
  email: string,
) => {
  const transport = generateMailTransporter();
  const message = `Dear ${ name } your password has been successfully updated.`

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Update Successful",
    html: generateTemplate({
      title: "Password Update Successful",
      message,
      logo: "cid:logo",
      banner: "cid:forgot_password",
      link: SIGN_IN_URL,
      btnTitle: "Sign in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forgot_password.png",
        path: path.join(__dirname, "../mail/forgot_password.png"),
        cid: "forgot_password",
      },
    ],
  });
}