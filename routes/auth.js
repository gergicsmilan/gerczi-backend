const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

// Method: GET
// path: "/auth/exists/:email"
router.get('/exists/:email', authController.IsEmailExists);

// Method: POST
// path: "/auth/sign-up"
router.post(
  '/sign-up',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email!')
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('This email is already in use!');
          }
        });
      }),
    body('password', 'Password should contain minimum 5 characters!')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword', 'Confirm password should match with other password!')
      .exists()
      .custom((value, { req }) => value === req.body.password),
    body('firstName', 'First name should contain only alphabetical characters!').isString(),
    body('lastName', 'Last name should contain only alphabetical characters!').isString(),
  ],
  authController.signUp
);

// path: "/auth/sign-in"
router.post(
  '/sign-in',
  [body('email').isEmail().withMessage('Invalid email or password!')],
  authController.signIn
);

module.exports = router;
