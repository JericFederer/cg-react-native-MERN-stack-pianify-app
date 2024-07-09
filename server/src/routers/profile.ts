import { getPublicPlaylist, getPublicProfile, getPublicUploads, getUploads, updateFollower } from "#/controllers/profile";
import { mustBeAuthenticated } from "#/middleware/auth";
import { Router } from "express";

const profileRouter = Router();

profileRouter.post("/update-follower/:profileId", mustBeAuthenticated, updateFollower);
profileRouter.get("/uploads", mustBeAuthenticated, getUploads);
profileRouter.get("/uploads/:profileId", mustBeAuthenticated, getPublicUploads);
profileRouter.get("/info/:profileId", getPublicProfile);
profileRouter.get("/playlist/:profileId", getPublicPlaylist);

export default profileRouter;