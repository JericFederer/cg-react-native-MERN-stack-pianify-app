import express from "express";
import "dotenv/config";

import "./db";
import authRouter from "./routers/auth";

const app = express();

// * MIDDLEWARE
// * This will parse post request coming from a fetch api
app.use(express.json());
// * This will parse post request coming from an html form
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

const PORT = process.env.PORT || 1111;

app.listen(PORT, () => {
  console.log(`Port is listening on port ${ PORT }`)
})