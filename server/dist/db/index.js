"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const variable_1 = require("../utils/variable");
console.log(variable_1.MONGO_URI);
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(variable_1.MONGO_URI)
    .then(() => {
    console.log('Connected to DB successfully.');
})
    .catch((err) => {
    console.log('Could not connect to DB.', err);
});
