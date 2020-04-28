const express = require("express");

const router = express.Router();

const admintController = require("../controllers/admin");

//method: GET

//method: POST
//path: "/admin/add-product"
router.post("/add-product", admintController.addProduct);

module.exports = router;
