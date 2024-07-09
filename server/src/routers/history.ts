import { updateHistory } from "#/controllers/history";
import { mustBeAuthenticated } from "#/middleware/auth";
import { Router } from "express";

const historyRouter = Router();

historyRouter.post("/", mustBeAuthenticated, updateHistory);

export default historyRouter;
