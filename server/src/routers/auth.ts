import { Router } from "express";

import { CreateUser } from "../@types/user";
import { CreateUserSchema } from "../utils/validationSchema";
import { validate } from "../middleware/validator";
import { create } from "../controllers/user";

const authRouter = Router();

// * ROUTE - CREATE NEW USER
authRouter.post("/create", validate(CreateUserSchema), create)

export default authRouter;