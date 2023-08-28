/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file : authMiddleware.js
 */
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if there s a Token
        if(!token){
            res.status(401);
            throw new Error("Non autorisé, veuillez vous connecter !");
        }

        // Verify Token
        const verifed = jwt.verify(token, process.env.JWT_SECRET);

        // Get User Id from Token
        const user = await User.findById(verifed.id).select("-password");

        if(!user){
            res.status(401);
            throw new Error("Utilisateur introuvable !");
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401);
        throw new Error("Non autorisé, veuillez vous connecter !");
    }

});

module.exports = protect;