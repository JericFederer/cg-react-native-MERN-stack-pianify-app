import { Router } from "express";

import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidationSchema, UpdatePasswordSchema } from "../utils/validationSchema";
import { validate } from "../middleware/validator";
import {
  create,
  verifyEmail,
  resendVerificationToken,
  generatePasswordResetLink,
  validGrantAccess,
  updatePassword,
  signIn,
  updateProfile,
  sendProfile,
  logOut
} from "../controllers/auth";
import { isValidPasswordResetToken, mustBeAuthenticated } from "../middleware/auth";
import fileParser from "#/middleware/fileParser";

const authRouter = Router();

authRouter.post("/create", validate(CreateUserSchema), create);
authRouter.post("/verify-email", validate(TokenAndIDValidationSchema), verifyEmail);
authRouter.post("/resend-verify-email", resendVerificationToken);
authRouter.post("/password-reset", generatePasswordResetLink);
authRouter.post("/verify-password-reset-token", validate(TokenAndIDValidationSchema), isValidPasswordResetToken, validGrantAccess);
authRouter.post("/update-password", validate(UpdatePasswordSchema), isValidPasswordResetToken, updatePassword);
authRouter.post("/sign-in", validate(SignInValidationSchema), signIn);
authRouter.get("/is-auth", mustBeAuthenticated, sendProfile);
authRouter.post("/update-profile", mustBeAuthenticated, fileParser, updateProfile);
authRouter.post("/log-out", mustBeAuthenticated, logOut);

export default authRouter;