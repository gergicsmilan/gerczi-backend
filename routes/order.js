const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();

// Method:POST
// path: "/order/add-order"
router.post('/add-order', orderController.postOrder);

module.exports = router;
