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
  try {
    await req.user.addProductToCart(req.body.productId);
  } catch (err) {
    return next(err)
  }
  return res.status(200).json({ success: true })
};

exports.postDeleteCartProduct = async (req, res, next) => {
  try {
    await req.user.removeProductFromCart(req.body.productId);
  } catch (err) {
    return next(err)
  }
  return res.status(200).json({ success: true })
};
