const { validationResult } = require('express-validator');

const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, incorrect data!')
    error.statusCode = 422;
    throw error;
  };
  if (!req.file) {
    const error = new Error('No image provided!')
    error.statusCode = 422;
    throw error;
  }
  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  const imageUrl = req.file.path.replace("\\", "/");
  let productIngredients = [];
  if (req.body.productIngredients) {
    productIngredients = [...req.body.productIngredients];
  }
  const newProduct = new Product({
    name: productName,
    price: productPrice,
    imageUrl: imageUrl,
    ingredients: productIngredients,
  });
  newProduct
    .save()
    .then((result) => {
      console.log('Product successfully created!')
      res.status(201).json({ message: "Product successfully created!", product: result })

    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err)
    });
};
