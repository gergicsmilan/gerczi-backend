const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Product = require('../models/product');
const Category = require('../models/category');

exports.addProduct = async (req, res, next) => {
  const categoryIds = req.body.categoryIds ? [...req.body.categoryIds] : [];

  try {
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
  console.log('Product successfully created!');
  return res.status(200).json({ success: true });
};

exports.addCategory = async (req, res, next) => {
  try {
    const addCategoryResult = await Category.create({
      name: req.body.categoryName,
      imageUrl: req.file ? req.file.path.replace('\\', '/') : null,
    });
  } catch (err) {
    return next(err);
  }
  console.log('Category successfully created!');
  res.status(201).json({ success: true });
};

exports.addProductToCategory = async (req, res, next) => {
  let result;
  try {
    result = await Category.updateOne(
      { _id: req.body.categoryId },
      {
        $addToSet: { products: req.body.productId },
      }
    );
    if (result.nModified === 0) {
      const error = new Error(
        'Adding product to category failed! Category might not exist or product is already added to this category!'
      );
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    return next(err);
  }
  console.log('Product successfully added to category!');
  return res.status(202).json({ success: true });
};
