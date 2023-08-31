const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file: contactModel.js
 */
const contactUs = expressAsyncHandler(async (req, res) => {
    const {subject, message} = req.body;
    const user = await User.findById(req.user._id);

    if(!user) {
        res.status(400);
        throw new Error("Utilisateur introuvable, veuillez se connecter");

    }

    // Validation 
    if(!subject || !message){
        res.status(400);
        throw new Error("Veuillez remplir tous les champs");
    }


    const send_to = process.env.EMAIL_USER;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = user.email;

    try {
        await sendEmail(subject, message, send_to, sent_from, reply_to);
        res.status(200).json({succuss: true,
            message: "Reset Email Sent"})
    } catch (error) {
        res.status(500);
        throw new Error("Email not sent, please try again");
    }

});

module.exports = {
    contactUs,
}