import { RequestHandler } from "express";
import { isValidObjectId } from 'mongoose';
import crypto from 'crypto';

import User from "../models/user";
import EmailVerificationToken from "../models/emailVerificationToken";
import PasswordResetToken from "../models/passwordResetToken";
import {
  CreateUser,
  VerifyEmailRequest,
  resendVerificationTokenRequest,
  generatePasswordResetLinkRequest
} from "../@types/user";
import { generateOtpToken } from "../utils/helper";
import { sendVerificationMail, sendPasswordResetLink, sendPasswordResetSuccessEmail } from "../utils/mail";
import { PASSWORD_RESET_LINK } from "../utils/variable";

export const create: RequestHandler = async (
  req: CreateUser,
  res
) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({
    name,
    email,
    password
  });

  const otpToken = generateOtpToken();

  // await EmailVerificationToken.create({
  //   owner: newUser._id,
  //   token: otpToken
  // });

  sendVerificationMail(otpToken, {
    name,
    email,
    userId: newUser._id.toString()
  })

  res.status(201).json({
    newUser: {
      id: newUser._id.toString(),
      name,
      email
    } 
  });
}

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId
  })

  if (!verificationToken) {
    return res
      .status(403)
      .json({ error: "Invalid token." })
  }

  const isVerified = await verificationToken.compareToken(token);

  if (!isVerified) {
    return res
      .status(403)
      .json({ error: "Invalid token." })
  }

  await User.findByIdAndUpdate(userId, {
    verified: true
  })

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({
    message: "Your email has been verified."
  })
}

export const resendVerificationToken: RequestHandler = async (
  req: resendVerificationTokenRequest,
  res
) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId)) {
    return res
      .status(403)
      .json({
        error: "Invalid request."
      })
  }

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(403)
      .json({
        error: "Invalid request."
      })
  }

  await EmailVerificationToken.findOneAndDelete({
    owner: userId
  });

  const otpToken = generateOtpToken();

  sendVerificationMail(otpToken, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString()
  })

  res.json({
    message: "Token has been sent. Please check your email."
  })
}

export const generatePasswordResetLink: RequestHandler = async (
  req: generatePasswordResetLinkRequest,
  res
) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({
        error: "User account doesn't exist."
      })
  }

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });
  
  const passwordResetToken = crypto.randomBytes(36).toString("hex")
  
  await PasswordResetToken.create({
    owner: user._id,
    token: passwordResetToken
  })

  const passwordResetLink = `${ PASSWORD_RESET_LINK }?token=${ passwordResetToken }&userId=${ user._id }`

  sendPasswordResetLink({
    email,
    link: passwordResetLink
  })

  res.json({
    passwordResetLink
  })
}

export const validGrantAccess: RequestHandler = async (
  req,
  res
) => {
  res.json({
    valid: true
  })
}

export const updatePassword: RequestHandler = async (
  req,
  res
) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId)

  if (!user) {
    return res
      .status(403)
      .json({
        message: "Unauthorized access."
      })
  }

  const newPasswordIsSameWithOldPassword = await user.comparePassword(password);

  if (newPasswordIsSameWithOldPassword) {
    return res
      .status(422)
      .json({
        error: "Entered password is the same as the old password."
      })
  }

  user.password = password;

  await user.save()

  await PasswordResetToken.findOneAndDelete({
    owner: user._id
  })

  sendPasswordResetSuccessEmail(
    user.name,
    user.email
  )

  res.json({
    message: "Password has been successfully updated."
  })
}