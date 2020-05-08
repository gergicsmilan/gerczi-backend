const { validationResult } = require('express-validator');

const Product = require("../models/product");

exports.getHome = (req, res, next) => {
  return res.status(200).json({ success: true });
};

exports.getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    return next(err);
  }
  return res.status(200).json({ success: true, products: products })
};

exports.postAddCartProduct = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error(`productId not found!\n${errors.array()[0].msg}`);
      error.statusCode = 422;
      throw error;
    }
    await req.user.addProductToCart(req.body.productId);
  } catch (err) {
    return next(err)
  }
  return res.status(200).json({ success: true })
};

exports.postDeleteCartProduct = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error(`productId not found!\n${errors.array()[0].msg}`);
      error.statusCode = 422;
      throw error;
    }
    await req.user.removeProductFromCart(req.body.productId);
  } catch (err) {
    return next(err)
  }
  return res.status(200).json({ success: true })
};
