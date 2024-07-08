import { Router } from "express";

import { createPlaylist, getAudios, getPlaylistByProfile, removePlaylist, updatePlaylist } from "#/controllers/playlist";
import { isVerified, mustBeAuthenticated } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { NewPlaylistValidationSchema, OldPlaylistValidationSchema } from "#/utils/validationSchema";

const playlistRouter = Router();

playlistRouter.post("/create", mustBeAuthenticated, isVerified, validate(NewPlaylistValidationSchema), createPlaylist);
playlistRouter.patch("/", mustBeAuthenticated, isVerified, validate(OldPlaylistValidationSchema), updatePlaylist);
playlistRouter.delete("/", mustBeAuthenticated, removePlaylist);
playlistRouter.get("/by-profile", mustBeAuthenticated, getPlaylistByProfile);
playlistRouter.get("/:playlistId", mustBeAuthenticated, getAudios);

export default playlistRouter;