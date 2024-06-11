import mongoose from "mongoose";

import { MONGO_URI } from "../utils/variable";

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB successfully.");
  })
  .catch((err) => {
    console.log("Could not connect to DB.", err)
  });