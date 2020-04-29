const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// Method: GET
// path:"/"

// Method: POST
// path: "/auth/sign-up"
router.post("/sign-up", authController.signUp);

// path: "/auth/sign-in"
router.post("/sign-in", authController.signIn);


module.exports = router;
