/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file: productRoute.js
 */

const express = require("express");
const { createProduct } = require("../controllers/productController");
const protect = require("../middleWares/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();


router.post("/", protect, upload.single("image"), createProduct);


module.exports = router;