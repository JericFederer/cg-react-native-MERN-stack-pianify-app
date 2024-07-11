import { Router } from "express";

import { createAudio, getLatestUploads, updateAudio } from "#/controllers/audio";
import { isVerified, mustBeAuthenticated } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { AudioValidationSchema } from "#/utils/validationSchema";
import fileParser from "#/middleware/fileParser";

const audioRouter = Router();

audioRouter.post("/create", mustBeAuthenticated, isVerified, fileParser, validate(AudioValidationSchema), createAudio);
audioRouter.patch("/:audioId", mustBeAuthenticated, isVerified, fileParser, validate(AudioValidationSchema), updateAudio);
audioRouter.get("/latest", getLatestUploads);

export default audioRouter;
