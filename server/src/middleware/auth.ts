import { RequestHandler } from "express";

import passwordResetToken from "../models/passwordResetToken";

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