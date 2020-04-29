const express = require("express");

const restaurantController = require("../controllers/restaurant");

const router = express.Router();

// method:GET
// path:"/"
router.get("/", restaurantController.getHome);

//path:"/products"
router.get("/products", restaurantController.getProducts);

// method:POST
// path:"/cart/add-product"
router.post("/cart/add-product", restaurantController.postAddCartProduct);

// path:"/cart/remove-product"
router.post("/cart/remove-product", restaurantController.postDeleteCartProduct)

module.exports = router;
