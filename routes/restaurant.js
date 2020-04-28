const express = require("express");

const restaurantController = require("../controllers/restaurant");

const router = express.Router();

//method:GET, path:"/"
router.get("/", restaurantController.getHome);

module.exports = router;
