/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file: productModel.js
 */

const mongoose = require("mongoose");

const productSchema = mongoose.Schema({

    user : {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Veuillez ajouter un nom"]
    },
    sku: {
        type: String,
        required: [true],
        default: "SKU",
        trim: true,
    },
    categorie: {
        type: String,
        required: [true, "Veuillez ajouter une categorie"],
        default: "SKU",
        trim: true,
    },
    quantity: {
        type: String,
        required: [true, "Veuillez ajouter une contité"],
        default: "SKU",
        trim: true,
    },
    price: {
        type: String,
        required: [true, "Veuillez ajouter un prix"],
        default: "SKU",
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Veuillez ajouter une description"],
        default: "SKU",
        trim: true,
    },
    image: {
        type: Object,
        default: {},
    },

}, {
    timestamps: true,
})


const Product = mongoose.model("Product", productSchema);
module.exports = Product;