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

exports.postAddCartProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .addProductToCart(productId)
    .then((result) => {
      res
        .status(200)
        .json({ message: `Product: ${productId} is added to cart!` });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeProductFromCart(productId)
    .then((result) =>
      res
        .status(200)
        .json({ message: `Product: ${productId} is removed from cart!` })
    )
    .catch((err) => console.log(err));
};
