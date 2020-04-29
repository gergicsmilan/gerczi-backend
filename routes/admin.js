const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

//method: GET

//method: POST
//path: "/admin/add-product"
router.post("/add-product", adminController.addProduct);

module.exports = router;
