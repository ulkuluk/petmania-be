import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import UserRoute from "./route/userRoute.js";
import PetInSaleRoute from "./route/petInSaleRoute.js";
import TransactionRoute from "./route/transactionRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(UserRoute, PetInSaleRoute, TransactionRoute);

app.listen(5000, () => console.log("Server connected"));