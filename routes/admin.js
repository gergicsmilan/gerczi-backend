const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

//method: GET

//method: POST
//path: "/admin/add-product"
router.post("/add-product", adminController.addProduct);

//path: "/admin/add-product-to-category"
router.post("/add-product-to-category", adminController.addProductToCategory);

//path: "/admin/add-category"
router.post("/add-category", adminController.addCategory);

module.exports = router;
