/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file : userController.js
 */

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const bcrybt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate Token
const generateToken = (id) =>  {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};

// Register User
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
    password,
   });

    // Generate Token 
    const token = generateToken(user._id)

    // Send  HTTP-only  cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
    });

   if(user) {
    const {_id, name, email, photo, numero, bio } = user;
    res.status(201).json({
        _id, 
        name, 
        email, 
        photo, 
        numero, 
        bio,
        token,
    })
   } else {
    res.status(400);
    throw new Error("Utilisateur data invalide");
   }



});

// Login User 
const loginUser = asyncHandler( async (req, res) => {
    
    const {email, password} = req.body;

    //res.send("Login user");

    // Validate Request 
    if (!email || !password){
        res.status(400);
        console.log(Error);
        throw new Error("Veulliez entrer une adresse mail et un mot de passe !");
    }

    // check if user exists
    const user = await User.findOne({email});

    if (!user){
        res.status(400);
    throw new Error("Utilisateur introuvable !");
    }

    // User exists , Check if password is correct
    const passwordIsCorrect = await bcrybt.compare(password, user.password);

    // Generate Token 
    const token = generateToken(user._id)

    // Send  HTTP-only  cookie
    if(passwordIsCorrect){
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true,
        });        
    }

    // Get user information and chek it 
    if(user && passwordIsCorrect){
        const {_id, name, email, photo, numero, bio } = user;
        res.status(201).json({
            _id, 
            name, 
            email, 
            photo, 
            numero, 
            bio,
            token,
        });

    } else {
        res.status(400);
        throw new Error("mot de passe ou email invalide !");
    }
});

// Logout User function 
const logoutUser = asyncHandler( async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 1 day
        sameSite: "none",
        secure: true,
    });
    return res.status(200).json({ message: "Déconnexion réussie"})
    
    
});


// Get user from DataBase
const getUser = asyncHandler( async (req, res) => {
   
    const user = await User.findById(req.user._id);

    if(user){
        const {_id, name, email, photo, numero, bio } = user;
        res.status(201).json({
            _id, 
            name, 
            email, 
            photo, 
            numero, 
            bio,
           
        });

    } else {
        res.status(400);
        throw new Error("Utilisateur introuvable !");
    }
    
});


// Get Login Status 
const loginStatus = asyncHandler( async (req, res) => {

    const token = req.cookies.token;

    if(!token ){
        return res.json(false)
    }
    
    // Verify Token
    const verifed = jwt.verify(token, process.env.JWT_SECRET);

    if(verifed) {
        return res.json(true)
    }

    return res.json(false);

});   

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
};