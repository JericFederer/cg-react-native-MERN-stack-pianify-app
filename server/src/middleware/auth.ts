import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import { JWT_SECRET } from "#/utils/variable";
import passwordResetToken from "../models/passwordResetToken";
import User from "#/models/user";

export const isValidPasswordResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;
  
  const resetOtpToken = await passwordResetToken.findOne({
    owner: userId
  })

  if (!resetOtpToken) {
    return res
      .status(403)
      .json({
        error: "Unauthorized access, invalid token."
      })
  }

  const isVerified = await resetOtpToken.compareToken(token);

  if (!isVerified) {
    return res
      .status(403)
      .json({
        error: "Unauthorized access, invalid token."
      })
  }

  next();
}

export const mustBeAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(403).json({ error: "Unauthorized request." })
  }

  const payload = verify(token, JWT_SECRET) as JwtPayload;
  const id = payload.userId;
  const user = await User.findOne({ _id: id, tokens: token });

  if (!user) {
    return res.status(403).json({ error: "Unauthorized request." })
  }

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  };

  req.token = token;
  
  next();
}

export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({ error: "Please verify your email account." });
  }

  next();
};

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (token) {
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;
    const user = await User.findOne({ _id: id, tokens: token });

    if (!user) {
      return res.status(403).json({ error: "Unauthorized request." })
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    };

    req.token = token;
  }
  
  next();
}