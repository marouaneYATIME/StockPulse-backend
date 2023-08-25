/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file : useRoute.js
 */

const express = require("express");
const { registerUser } = require("../controllers/userController.js");
const router = express.Router();


router.post("/register", registerUser);



module.exports = router
