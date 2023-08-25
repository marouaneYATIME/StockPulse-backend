/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 */
const dotenv = require("dotenv").config();
const express = require("express");
//const connectDB = require("./config/connectDB.js");
const mongoose = require("mongoose");
const bodyPaser = require("body-parser");
//const taskRoutes = require("./routes/taskRoute");
const cors = require("cors"); 
const userRoute = require("./routes/userRoute.js");



const app = express();

// Middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyPaser.json());

// Routes Middlewares 
app.use("/api/users", userRoute);

// Creating Routes 
app.get("/", (req, res) => {
    res.send("Home Page 1 ");
});

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