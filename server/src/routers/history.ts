import { Router } from "express";

import { removeHistory, updateHistory } from "#/controllers/history";
import { mustBeAuthenticated } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { UpdateHistorySchema } from "#/utils/validationSchema";


const historyRouter = Router();

historyRouter.post("/", mustBeAuthenticated, validate(UpdateHistorySchema), updateHistory);
historyRouter.delete("/", mustBeAuthenticated, removeHistory);

export default historyRouter;
