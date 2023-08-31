/**
 * author : YATIME Marouane
 * app : PFE - TaskPulse software
 * file: productController.js
 */

const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel.js");
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

// Get all Products
const getProducts = asyncHandler (async (req, res) => { 
    const products = await Product.find({user: req.user.id}).sort("-createdAt");
    res.status(200).json(products);

});

// Get Single Products 
const getProduct = asyncHandler (async (req, res) => { 
    
    const product = await Product.findById(req.params.id);

    // If product doesnt exist
    if (!product) {
        res.status(404);
        throw new Error("Produit Introuvable");
    }

    // Match product to user 
    if(product.user.toString() !== req.user.id){
        res.status(404);
        throw new Error("Utilisateur non autorisé");
    }

    res.status(200).json(product);

});

// Delete Product 
const deleteProduct = asyncHandler (async (req, res) => { 

    const product = await Product.findById(req.params.id);

    // If product doesnt exist
    if (!product) {
        res.status(404);
        throw new Error("Produit Introuvable");
    }

    // Match product to user 
    if(product.user.toString() !== req.user.id){
        res.status(404);
        throw new Error("Utilisateur non autorisé");
    }

    await product.remove;
    res.status(200).json({message: "Produit suprimmé "});


});


// Update product 

// Delete Product 
const updateProduct = asyncHandler (async (req, res) => { 

    const {name, categorie, quantity, price, description} = req.body;

    const {id} = req.params;

    const product = await Product.findById(req.params.id);    

     // If product doesnt exist
     if (!product) {
        res.status(404);
        throw new Error("Produit Introuvable");
    }

    // Match product to user 
    if(product.user.toString() !== req.user.id){
        res.status(404);
        throw new Error("Utilisateur non autorisé");
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


    // Update Product 

    const productUpdated = await Product.findByIdAndUpdate(
        {_id: id},
        {
            name,
            categorie,
            quantity,
            price,
            description,
            image: Object.keys(fileData).length === 0 ?  product?.image: fileData,
        },
        {
            new: true,
            runValidators: true,
        }
    )

    res.status(201).json(productUpdated);

});


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
}