const express = require("express");

const restaurantController = require("../controllers/restaurant");

const router = express.Router();

// method:GET
// path:"/"
router.get("/", restaurantController.getHome);

//path:"/products"
router.get("/products", restaurantController.getProducts);

// method:POST
router.post("/cart/add-product", restaurantController.addToCart);

module.exports = router;
