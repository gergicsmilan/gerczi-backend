const { validationResult } = require('express-validator');

const Order = require('../models/order');
const User = require('../models/user');
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

exports.getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find({ userId: req.userId });
  } catch (err) {
    next(err);
  }
  res.status(200).json({ success: true, data: orders });
};

exports.postOrder = async (req, res, next) => {
  try {
    const order = await Order.create({
      contactInfo: req.body.contactInfo,
      shippingInfo: req.body.shippingInfo,
      orderedItems: req.body.orderedItems,
      date: req.body.date,
      userId: req.userId,
    });

    const user = await User.findById(req.userId);
    await user.addOrderToUser(order._id);
  } catch (err) {
    return next(err);
  }
  return res.status(200).json({ success: true });
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
