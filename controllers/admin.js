const { validationResult } = require('express-validator');

const Product = require('../models/product');
const Category = require('../models/category');

exports.addProduct = async (req, res, next) => {
  const categoryIds = req.body.categoryIds ? [...req.body.categoryIds] : [];
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error(`addProduct failed!\n${errors.array()[0].msg}`);
      error.statusCode = 422;
      throw error;
    }
    const addProductResult = await Product.create({
      name: req.body.productName,
      price: req.body.productPrice,
      ingredients: [...req.body.productIngredients],
      imageUrl: req.file ? req.file.path.replace('\\', '/') : null,
      categoryIds: categoryIds,
    });
    if (categoryIds.length > 0) {
      const updateQueries = categoryIds.map((categoryId) => ({
        updateOne: {
          filter: { _id: categoryId },
          update: {
            $addToSet: { products: addProductResult._id },
          },
        },
      }));
      if (updateQueries.length > 0) await Category.bulkWrite(updateQueries);
    }
  } catch (err) {
    return next(err);
  }
  return res.status(200).json({ success: true });
};

exports.addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error(`addCategory failed!\n${errors.array()[0].msg}`);
      error.statusCode = 422;
      throw error;
    }
    const addCategoryResult = await Category.create({
      name: req.body.categoryName,
      imageUrl: req.file ? req.file.path.replace('\\', '/') : null,
    });
  } catch (err) {
    return next(err);
  }
  return res.status(201).json({ success: true });
};

exports.addProductToCategory = async (req, res, next) => {
  const errors = validationResult(req);
  let categoryUpdate;
  let productUpdate;
  try {
    if (!errors.isEmpty()) {
      const error = new Error(`addProductToCategory failed!\n${errors.array()[0].msg}`);
      error.statusCode = 422;
      throw error;
    }
    categoryUpdate = await Category.updateOne(
      { _id: req.body.categoryId },
      {
        $addToSet: { products: req.body.productId },
      }
    );
    productUpdate = await Product.updateOne(
      { _id: req.body.productId },
      {
        $addToSet: { categoryIds: req.body.categoryId },
      }
    );
    if (categoryUpdate.nModified === 0 || productUpdate.nModified === 0) {
      const error = new Error(
        'Adding product to category failed!\nInvalid category or product is already added!'
      );
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    return next(err);
  }
  return res.status(202).json({ success: true });
};
