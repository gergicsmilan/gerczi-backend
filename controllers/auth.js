const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: { api_key: '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' },
  })
);

exports.getUser = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false });

  let user;
  try {
    user = await User.findOne({ _id: userId });
  } catch (err) {
    next(err);
  }

  if (!user) return res.status(401).json({ success: false });

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    address: user.address,
    orderedItems: user.orderedItems,
  };

  return res.status(200).json({ success: true, userData: userData });
};

exports.IsEmailExists = async (req, res, next) => {
  const inputEmail = req.params.email;
  let user;

  try {
    user = await User.findOne({ email: inputEmail });
  } catch (err) {
    return next(err);
  }

  if (user) return res.status(200).json({ succes: true, data: true });

  return res.status(200).json({ succes: true, data: false });
};

exports.postChangePersonalData = async (req, res, next) => {
  const userId = req.userId;
  const address = { zip: req.body.zip, city: req.body.city, street: req.body.street };

  try {
    const user = await User.findById(userId);
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.phoneNumber = req.body.phoneNumber;
    user.address = address;
    await user.save();
  } catch (err) {
    next(err);
  }
  res.status(200).json({ success: true });
};

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

    await transporter.sendMail({
      to: req.body.email,
      from: 'gergics.milan@hotmail.com',
      subject: 'Signup succeeded!',
      html: '<h1>You successfully signed up!</h1>',
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
    const isEqualPassword = await bcrypt.compare(req.body.password, loadedUser.password);
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

  const token = jwt.sign(payload, 'mysecretkey', { expiresIn: '1d' });

  return res.status(200).json({ success: true, jwt: token });
};
