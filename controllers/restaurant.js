const { validationResult } = require('express-validator');

const Product = require('../models/product');
const Category = require('../models/category');

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
  return res.status(200).json({ success: true, data: products });
};

exports.getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find().populate('products', '-categoryIds');
  } catch (err) {
    return next(err);
  }

  return res.status(200).json({ success: true, data: categories });
};

exports.getProductsByCategory = async (req, res, next) => {
  const errors = validationResult(req);
  let products;
  try {
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      throw error;
    }

    products = await Category.findById(req.params.id)
      .select('products')
      .populate('products', '-categoryIds');

    if (!products) {
      const error = new Error(`Category: ${req.categoryId} not found!`);
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    return next(err);
  }

  return res.status(200).json({ success: true, data: products });
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
    return next(err);
  }
  return res.status(200).json({ success: true });
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
    return next(err);
  }
  return res.status(200).json({ success: true });
};
