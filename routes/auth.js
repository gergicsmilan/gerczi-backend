const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// Method: GET
// path:"/"

// Method: POST
// path: "/auth/sign-up"
router.post("/sign-up", authController.signUp);

module.exports = router;
