const Product = require("../models/product");
const User = require("../models/user");

exports.getHome = (req, res, next) => {
  res.status(200).json({ message: "Test get request" });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json({ products }))
    .catch((err) => console.log(err));
};

exports.addToCart = (req, res, next) => {
  console.log(req.user);
  const productId = req.body.productId;
  req.user
    .addProductToCart(productId)
    .then((result) => {
      res.status(200).json({ message: "Product added to cart!" });
    })
    .catch((err) => console.log(err));
};
