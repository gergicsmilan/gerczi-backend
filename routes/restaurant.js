const express = require("express");
const { body } = require("express-validator");

const restaurantController = require("../controllers/restaurant");

const router = express.Router();

// method:GET
// path:"/"
router.get("/", restaurantController.getHome);

//path:"/products"
router.get("/products", restaurantController.getProducts);

// method:POST
// path:"/cart/add-product"
router.post("/cart/add-product", body('productId').exists().isString().isLength({ min: 24, max: 24 }), restaurantController.postAddCartProduct);

// path:"/cart/remove-product"
router.post("/cart/remove-product", body('productId').exists().isString().isLength({ min: 24, max: 24 }), restaurantController.postDeleteCartProduct);

module.exports = router;
