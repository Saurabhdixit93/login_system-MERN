// Importin required packages and files
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const { connectDB } = require("./config/databaseConfig");
const Router = require("./router");
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// routers
app.use("/", Router);
app.use("*", (req, res) => {
  return res.json({
    success: false,
    message: "path not defined.",
  });
});

// server start with DB
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server Running Successfully in PORT : ${port}`);
  });
});
