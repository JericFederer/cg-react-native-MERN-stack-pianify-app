import { Router } from "express";

import { getFavorites, getIsFavorite, toggleFavorite } from "#/controllers/favorite";
import { isVerified, mustBeAuthenticated } from "#/middleware/auth";

const favoriteRouter = Router();

favoriteRouter.post("/", mustBeAuthenticated, isVerified, toggleFavorite);
favoriteRouter.get("/", mustBeAuthenticated, getFavorites);
favoriteRouter.get("/is-fav", mustBeAuthenticated, getIsFavorite);

export default favoriteRouter;