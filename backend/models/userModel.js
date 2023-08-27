/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 */

const mongoose = require("mongoose");
const bcrybt = require("bcryptjs");


// create the user shema 
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required: [true, "Veuillez Entrer un nom !"]
    }, 
    email: {
        type : String,
        unique: true,
        trim: true,
        required: [true, "Veuillez Entrer un mail !"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Entrer une adresse mal valide ! "
        ]
    },
    password: {
        type : String,
        minLenght: [6,"mot de passe faut avoir 6 caractere au minimum"],
        maxLenght: [25,"mot de passe faut avoir 25 caractere au maximum"],
        required: [true, "Entrer un mot de passe !"]
    },
    photo:{
        type: String,
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
        required: [true, "Veuillez Entrer une photo !"]
    },
    numero:{
        type: String,
        default: "+00 00 00 00 00",
    },
    bio: {
        type: String,
        maxLenght: [250,"Bio faut avoir 250 caractere au maximum"],
        default: "bio"
    }

},{
    timestamps: true
});

// Encrypter le mot de passe avant le sauvgarder dans l base de données 
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) {
        return next();
    }

    // Hash password  
    const salt = await  bcrybt.genSalt(10)
    const hashedPassword = await bcrybt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;