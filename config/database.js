import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";


const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Nyambungin db ke BE
const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

export default db;