/**
 * author : YATIME Marouane
 */
const dotenv = require("dotenv").config();
const express = require("express");
//const connectDB = require("./config/connectDB.js");
const mongoose = require("mongoose");
const bodyPaser = require("body-parser");
//const taskRoutes = require("./routes/taskRoute");
const cors = require("cors"); 


const app = express();

// Init port de connexion 
const PORT = process.env.PORT || 5000;

// Cpnnect to DB and Start server

mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port: ${PORT} `);
        })
    })
    .catch((err) => console.log(err));