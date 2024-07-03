import { RequestHandler } from "express";
import { isValidObjectId } from 'mongoose';
import crypto from 'crypto';
import jwt from "jsonwebtoken";

import {
  CreateUser,
  VerifyEmailRequest,
  resendVerificationTokenRequest,
  generatePasswordResetLinkRequest
} from "../@types/user";
import { formatProfile, generateOtpToken } from "../utils/helper";
import { sendVerificationMail, sendPasswordResetLink, sendPasswordResetSuccessEmail } from "../utils/mail";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "../utils/variable";
import User from "../models/user";
import EmailVerificationToken from "../models/emailVerificationToken";
import PasswordResetToken from "../models/passwordResetToken";
import { RequestWithFiles } from "#/middleware/fileParser";
import cloudinary from "#/cloud";
import formidable from "formidable";

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

export const signIn: RequestHandler = async (
  req,
  res
) => {
  const { password, email } = req.body;

  const user = await User.findOne({
    email
  })

  if (!user) {
    return res.status(403).json({
      error: "Email/Password mismatch."
    })
  }

  // * Compare the password
  const passwordIsTheSame = user.comparePassword(password);
  
  let passwordIsTheSameAwait: boolean = false;

  if (passwordIsTheSame instanceof Promise) {
    passwordIsTheSameAwait = await passwordIsTheSame;
  }
  
  if (!passwordIsTheSame || !passwordIsTheSameAwait) {
    return res.status(403).json({
      error: "Email/Password mismatch."
    })
  }

  // * Generate token
  const jwtToken = jwt.sign(
    { userId: user._id },
    JWT_SECRET
  );

  user.tokens.push(jwtToken);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    jwtToken,
  });
}

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new Error ("User not found.");
  }

  if (
    typeof name !== "string"
    || name.trim().length < 3
  ) {
    return res.status(422).json({ errror: "Invalid name." });
  }

  user.name = name;

  if (avatar) {
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(avatar.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face"
    });

    user.avatar = {
      url: secure_url,
      publicId: public_id
    }
  }

  await user.save();

  res.json({
    profile: formatProfile(user)
  });
}

export const sendProfile: RequestHandler = (req, res) => {
  res.json({ profile: req.user })
}

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;
  const token = req.token;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new Error ("User not found.");
  }

  // * Logout all the devices
  if (fromAll === "yes") {
    user.tokens = [];
  } else {
    user.tokens = user.tokens.filter((tkn) => tkn !== token);
  }

  await user.save();

  res.json({
    success: true
  });
}