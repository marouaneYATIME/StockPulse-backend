/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file: productController.js
 */

const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;




const createProduct = asyncHandler (async (req, res) => {
    const {name, sku, categorie, quantity, price, description} = req.body;

    // Validation
    if (!name || !categorie || !quantity || !price || !description) {
        res.status(400);
        throw new Error("veuillez remplir tous les champs !");
    } 

    // Handle Image upload 
    let fileData = {}
    if (req.file) {
        // Save image to cloudinary
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader
             .upload(req.file.path, {folder: "StockPluse-app", resource_type: "image"});
        } catch (error) {
            res.status(500);
            throw new Error("L'image clous n'a pas pu être téléchargée");
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }


    // Create Product 
    const product = await Product.create({
        user: req.user.id,
        name,
        sku,
        categorie,
        quantity,
        price,
        description,
        image: fileData,
    });

    res.status(201).json(product);

});


module.exports = {
    createProduct,
}