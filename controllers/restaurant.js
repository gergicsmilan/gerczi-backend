const Product = require("../models/product");

exports.getHome = (req, res, next) => {
  res.status(200).json({ message: "Test get request" });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json({ products }))
    .catch((err) => console.log(err));
};
