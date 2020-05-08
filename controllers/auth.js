const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
    });
  } catch (err) {
    return next(err);
  }

  return res.status(201).json({ success: true });
};

exports.signIn = async (req, res, next) => {
  let loadedUser;
  const errors = validationResult(req);
  const authError = new Error('Invalid email or password!');
  authError.statusCode = 422;

  try {
    if (!errors.isEmpty()) {
      throw authError;
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw authError;
    }

    loadedUser = user;
    const isEqualPassword = await bcrypt.compare(
      req.body.password,
      loadedUser.password
    );
    if (!isEqualPassword) {
      throw authError;
    }
  } catch (err) {
    return next(err);
  }

  const payload = {
    userId: loadedUser._id.toString(),
    email: loadedUser.email,
    lastName: loadedUser.lastName,
    firstName: loadedUser.firstName,
  };

  const token = jwt.sign(payload, 'mysecretkey', { expiresIn: '2h' });

  return res.status(200).json({ success: true, jwt: token });
};
