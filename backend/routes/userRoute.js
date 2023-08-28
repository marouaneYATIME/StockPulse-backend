/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file : useRoute.js
 */

const express = require("express");
const { registerUser,
      loginUser, 
      logoutUser,
      getUser,
      loginStatus,
     } = require("../controllers/userController.js");
const protect = require("../middleWares/authMiddleware.js");
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);







module.exports = router;
