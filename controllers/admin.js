const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Product = require('../models/product');
const Category = require('../models/category');

exports.addProduct = async (req, res, next) => {
  const categoryIds = req.body.categoryIds ? [...req.body.categoryIds] : null;

  try {
    const addProductResult = await Product.create({
      name: req.body.productName,
      price: req.body.productPrice,
      ingredients: [...req.body.productIngredients],
      imageUrl: req.file ? req.file.path.replace('\\', '/') : null,
      categoryIds: categoryIds,
    });
    if (categoryIds) {
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
    next(err);
  }
  console.log('Product successfully created!');
  return res.status(200).json({ success: true });
};

exports.addCategory = (req, res, next) => {
  const categoryName = req.body.categoryName;
  const categoryPrice = req.body.categoryPrice;
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }

  const newCategory = new Category({
    name: categoryName,
    price: categoryPrice,
  });

  if (imageUrl) {
    newCategory.imageUrl = imageUrl;
  }

  newCategory
    .save()
    .then((result) => {
      console.log('Category successfully created!');
      res
        .status(201)
        .json({ message: 'Category successfully created!', category: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addProductToCategory = async (req, res, next) => {
  const productId = req.body.productId;
  const categoryId = req.body.categoryId;
  let result;
  try {
    result = await Category.updateOne(
      { _id: mongoose.Types.ObjectId(categoryId) },
      {
        $addToSet: { products: mongoose.Types.ObjectId(productId) },
      }
    );
    if (result.nModified === 0) {
      throw new Error('Update failed!');
    }
  } catch (err) {
    return next(err);
  }
  return res.status(202).json({ success: true });
};
