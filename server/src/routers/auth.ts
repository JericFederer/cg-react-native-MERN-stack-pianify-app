import { Router } from "express";

import { CreateUserSchema, TokenAndIDValidationSchema, UpdatePasswordSchema } from "../utils/validationSchema";
import { validate } from "../middleware/validator";
import {
  create,
  verifyEmail,
  resendVerificationToken,
  generatePasswordResetLink,
  validGrantAccess,
  updatePassword
} from "../controllers/user";
import { isValidPasswordResetToken } from "../middleware/auth";

const authRouter = Router();

// * ROUTE - CREATE NEW USER
authRouter.post("/create", validate(CreateUserSchema), create);
authRouter.post("/verify-email", validate(TokenAndIDValidationSchema), verifyEmail);
authRouter.post("/resend-verify-email", resendVerificationToken);
authRouter.post("/password-reset", generatePasswordResetLink);
authRouter.post(
  "/verify-password-reset-token",
  validate(TokenAndIDValidationSchema),
  isValidPasswordResetToken,
  validGrantAccess
);
authRouter.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);

export default authRouter;