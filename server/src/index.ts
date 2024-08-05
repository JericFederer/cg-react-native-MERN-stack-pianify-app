import express from "express";
import "dotenv/config";
import "express-async-errors";

import { errorHandler } from "./middleware/error";
import "./db";
import "./utils/schedule";
import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import favoriteRouter from "./routers/favorite";
import playlistRouter from "./routers/playlist";
import profileRouter from "./routers/profile";
import historyRouter from "./routers/history";

const app = express();
const cors = require('cors');

// * Enable CORS for all routes
app.use(cors()); 

// * MIDDLEWARE
// * This will parse post request coming from a fetch api
app.use(express.json());
// * This will parse post request coming from an html form
app.use(express.urlencoded({ extended: false }));
// * Any HTML inside public folder can be accessed by using its filename as an endpoint
// * localhost:1111/reset-password
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 1111;

app.listen(PORT, () => {
  console.log(`Port is listening on port ${ PORT }`)
})