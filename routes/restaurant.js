const express = require('express');
const { param, body } = require('express-validator');

const restaurantController = require('../controllers/restaurant');
const isAuth = require('../authentication/is-auth');

const router = express.Router();

// method:GET
// path:"/"
router.get('/', restaurantController.getHome);

// path:"/categories"
router.get('/categories', restaurantController.getCategories);

//path:"/products"
router.get('/products', restaurantController.getProducts);

//path:"/products-by-category"
router.get(
  '/products-by-category/:id',
  param('id', 'Invalid or missing category id!')
    .exists()
    .isString()
    .isLength({ min: 24, max: 24 }),
  restaurantController.getProductsByCategory
);

//path:"/order/get-orders"
router.get('/order/get-orders', isAuth, restaurantController.getOrders);

// method:POST
// path:"/cart/add-product"
router.post(
  '/cart/add-product',
  body('productId').exists().isString().isLength({ min: 24, max: 24 }),
  restaurantController.postAddCartProduct
);

// path:"/cart/remove-product"
router.post(
  '/cart/remove-product',
  body('productId').exists().isString().isLength({ min: 24, max: 24 }),
  restaurantController.postDeleteCartProduct
);

// path: "/order/post-order"
router.post('/order/post-order', isAuth, restaurantController.postOrder);

module.exports = router;
