import { Router } from "express";

import { getHistories, getRecentlyPlayed, removeHistory, updateHistory } from "#/controllers/history";
import { mustBeAuthenticated } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { UpdateHistorySchema } from "#/utils/validationSchema";

const historyRouter = Router();

historyRouter.post("/", mustBeAuthenticated, validate(UpdateHistorySchema), updateHistory);
historyRouter.delete("/", mustBeAuthenticated, removeHistory);
historyRouter.get("/", mustBeAuthenticated, getHistories);
historyRouter.get("/recently-played", mustBeAuthenticated, getRecentlyPlayed);

export default historyRouter;
