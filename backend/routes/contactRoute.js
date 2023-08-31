/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file: contactRoute.js
 */
const express = require("express");
const router = express.Router();
const protect = require("../middleWares/authMiddleware");
const { contactUs } = require("../controllers/contactModel.js");


router.post("/", protect, contactUs);



module.exports = router;

