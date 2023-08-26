/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file : userController.js
 */

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");


const registerUser = asyncHandler( async (req,res) => {
   const {name, email, password} = req.body 

   // Validation 
   if(!name || !email || !password) {
    res.status(400);
    throw new Error("Veuillez remplir tous les champs requis ")
   }

   // Check Password lengh
   if(password.length < 6 ) {
    res.status(400);
    throw new Error("Le mot de passe doit comporter  6 caractères");
   }

   // check if user email already exists
   const userExist = await User.findOne({email});

   if(userExist) {
    res.status(400);
    throw new Error("Utilisateur exist déja !");
   }

   // Create new user
   const user = await User.create({
    name,
    email,
    password 
   })


   if(user) {
    const {_id, name, email, photo, numero, bio } = user
    res.status(201).json({
        _id, name, email, photo, numero, bio
    })
   } else {
    res.status(400);
    throw new Error("Utilisateur data invalide");
   }



});



module.exports = {
    registerUser,
};