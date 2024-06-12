import { Router } from "express";

import { CreateUserSchema, EmailVerificationBodySchema } from "../utils/validationSchema";
import { validate } from "../middleware/validator";
import { create, verifyEmail, resendVerificationToken, generatePasswordResetLink } from "../controllers/user";

const authRouter = Router();

// * ROUTE - CREATE NEW USER
authRouter.post("/create", validate(CreateUserSchema), create);
authRouter.post("/verify-email", validate(EmailVerificationBodySchema), verifyEmail);
authRouter.post("/resend-verify-email", resendVerificationToken);
authRouter.post("/password-reset", generatePasswordResetLink);

export default authRouter;