/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file : userController.js
 */

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const bcrybt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");


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


// Update User
const updateUser = asyncHandler( async (req, res) => {

    // Get the user
    const user = await User.findById(req.user._id)

    if (user) {
        const {name, email, photo, numero, bio } = user;
        user.email = email; 
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.bio = req.body.bio || bio;
        user.numero = req.body.numero || numero;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            photo: updatedUser.numero, 
            numero: updatedUser.bio, 
            bio: updatedUser.photo,
        })
    } else {
        res.status(400);
        throw new Error("Utilisateur introuvable");
    }

});

// Change password
const changePassword = asyncHandler( async (req, res) => {  
    // Get the user
    const user = await User.findById(req.user._id);

    const {oldPassword, password} = req.body

    // Check user
    if(!user){
        res.status(400);
        throw new Error("Utilisateur introuvable, veuiller vous connecter");
    }

    // Validate
    if(!oldPassword || !password){
        res.status(400);
        throw new Error("Veuillez rentrer l'ancien et le nouveau mot de passe");
    }

    // Check  if old password matches password 
    const passwordIsCorrect = await bcrybt.compare(oldPassword, user.password);
   
    // Save new password 
    if (user && passwordIsCorrect) {
        user.password = password;
        await user.save();
        res.status(200).send("Mot de passe à été changer !")
    }else {
        res.status(400);
        throw new Error("Mot de passe incorrecte");
    }

});  


const forgotPassword = asyncHandler( async (req, res) => {  

    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user) {
        res.status(404);
        throw new Error("Utilisatteur introuvable");

    }

    // Delete Token if ti exists in DB 
    let token = await Token.findOne({userId: user._id});
    if(token) {
        await token.deleteOne();
    }


    // Create Reste Token 
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

    // Hash token before saving to DB
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");


    // Save Token 
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) // Thirty minutes
    }).save()
    
    
    // Construct Reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

    // Reset Email 
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password</p>
        <p>This reset link is valid for only 30minutes.</p>

        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

        <p>Regards...</p>
        <p>StockPulse Team</p>
    `;
    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({succuss: true,
            message: "Reset Email Sent"})
    } catch (error) {
        res.status(500);
        throw new Error("Email not sent, please try again");
    }
        
});



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
};