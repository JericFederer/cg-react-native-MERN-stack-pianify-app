import { Router } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "#/utils/variable";

import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidationSchema, UpdatePasswordSchema } from "../utils/validationSchema";
import { validate } from "../middleware/validator";
import {
  create,
  verifyEmail,
  resendVerificationToken,
  generatePasswordResetLink,
  validGrantAccess,
  updatePassword,
  signIn
} from "../controllers/user";
import { isValidPasswordResetToken, mustBeAuthenticated } from "../middleware/auth";
import fileParser from "#/middleware/fileParser";


const authRouter = Router();

// * ROUTE - CREATE NEW USER
authRouter.post("/create", validate(CreateUserSchema), create);
authRouter.post("/verify-email", validate(TokenAndIDValidationSchema), verifyEmail);
authRouter.post("/resend-verify-email", resendVerificationToken);
authRouter.post("/password-reset", generatePasswordResetLink);
authRouter.post("/verify-password-reset-token", validate(TokenAndIDValidationSchema), isValidPasswordResetToken, validGrantAccess);
authRouter.post("/update-password", validate(UpdatePasswordSchema), isValidPasswordResetToken, updatePassword);
authRouter.post("/sign-in", validate(SignInValidationSchema), signIn);
authRouter.get("/is-auth", mustBeAuthenticated, (req, res) => res.json({ profile: req.user }));
authRouter.post('/update-profile', fileParser)

export default authRouter;