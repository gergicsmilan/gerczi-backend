const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

//method: GET

//method: POST
//path: '/admin/add-product'
router.post('/add-product', [
    body('productName', 'Invalid or missing product name!').exists().isString(),
    body('productPrice', 'Invalid or missing product price!').exists().isNumeric(),
    body('productIngredients', 'Invalid or missing product ingredients!').exists().isLength({ min: 1 }),
    body('imageUrl', 'Invalid product image url!').optional().isString().isLength({ min: 36 }),
    body('categoryIds', 'Invalid product category ids!').optional().custom((categoryIds) => {
        if (categoryIds && categoryIds.length > 0) {
            if (!Array.isArray(categoryIds)) {
                return false;
            }
            categoryIds.map(categoryId => {
                if (!typeof categoryId === 'String' && categoryId.length !== 24) {
                    return false;
                }
            })
        }
        return true;
    })
], adminController.addProduct);

//path: '/admin/add-product-to-category'
router.post('/add-product-to-category', [
    body('productId', 'Invalid or missing product id!').exists().isString().isLength({ min: 24, max: 24 }),
    body('categoryId', 'Invalid or missing category id!').exists().isString().isLength({ min: 24, max: 24 })
], adminController.addProductToCategory);

//path: '/admin/add-category'
router.post('/add-category', [
    body('categoryName', 'Invalid or missing category name!').exists().isString(),
    body('imageUrl', 'Invalid category image url!').optional().isString().isLength({ min: 36 })
], adminController.addCategory);

module.exports = router;
